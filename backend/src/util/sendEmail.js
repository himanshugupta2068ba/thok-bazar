const dns = require('dns').promises;
const nodemailer = require('nodemailer');
const createHttpError = require('./createHttpError');

const normalizeHost = (value) => String(value || "").trim().toLowerCase();
const isGmailHost = (value) => normalizeHost(value) === "smtp.gmail.com";

const toBoolean = (value, fallback = false) => {
    if (value === undefined || value === null || value === "") {
        return fallback;
    }

    return String(value).toLowerCase() === "true";
};

const toOptionalNumber = (value) => {
    if (value === undefined || value === null || value === "") {
        return undefined;
    }

    const parsedValue = Number(value);
    return Number.isFinite(parsedValue) ? parsedValue : undefined;
};

const resolvePreferredFamily = (host) => {
    const rawValue = String(process.env.SMTP_IP_FAMILY || "").trim();

    if (!rawValue || rawValue === "0" || rawValue.toLowerCase() === "auto") {
        return normalizeHost(host) === "smtp.gmail.com" ? 4 : undefined;
    }

    const parsedFamily = Number(rawValue);
    if (parsedFamily === 4 || parsedFamily === 6) {
        return parsedFamily;
    }

    throw createHttpError("SMTP_IP_FAMILY must be 4, 6, or left empty.", 500);
};

const resolvePreferredAddress = async (host, servername, family) => {
    if (!family) {
        return {
            host,
            resolvedAddress: undefined,
            resolvedFamily: undefined,
            servername,
        };
    }

    try {
        const lookupResult = await dns.lookup(servername || host, {
            family,
            verbatim: true,
        });

        return {
            host: lookupResult.address,
            resolvedAddress: lookupResult.address,
            resolvedFamily: lookupResult.family,
            servername,
        };
    } catch (error) {
        throw createHttpError(
            `Unable to resolve SMTP host over IPv${family}. Check SMTP_IP_FAMILY or SMTP_HOST.`,
            503,
        );
    }
};

const hasExplicitEnvValue = (value) => value !== undefined && value !== null && value !== "";

const buildTransportVariants = (host) => {
    const explicitPort = toOptionalNumber(process.env.SMTP_PORT);
    const hasExplicitSecure = hasExplicitEnvValue(process.env.SMTP_SECURE);

    if (explicitPort !== undefined) {
        const secure = toBoolean(process.env.SMTP_SECURE, explicitPort === 465);

        return [
            {
                port: explicitPort,
                requireTLS: !secure,
                secure,
            },
        ];
    }

    if (isGmailHost(host)) {
        return [
            {
                port: 465,
                requireTLS: false,
                secure: true,
            },
            {
                port: 587,
                requireTLS: true,
                secure: false,
            },
        ];
    }

    const secure = hasExplicitSecure ? toBoolean(process.env.SMTP_SECURE, false) : false;

    return [
        {
            port: 587,
            requireTLS: !secure,
            secure,
        },
    ];
};

const resolveMailerConfigs = async () => {
    const user = String(process.env.SMTP_USER || process.env.EMAIL_USER || "").trim();
    const pass = String(process.env.SMTP_PASS || process.env.EMAIL_PASS || "").trim();

    if (!user || !pass) {
        throw createHttpError(
            "Email service is not configured. Set EMAIL_USER and EMAIL_PASS on Render.",
            503,
        );
    }

    const host =
        String(process.env.SMTP_HOST || "").trim() ||
        (user.toLowerCase().endsWith("@gmail.com") ? "smtp.gmail.com" : "");

    if (!host) {
        throw createHttpError(
            "Email service host is not configured. Set SMTP_HOST or use a Gmail EMAIL_USER.",
            503,
        );
    }

    const from = String(process.env.EMAIL_FROM || user).trim();
    const servername = String(process.env.SMTP_SERVERNAME || host).trim() || host;
    const preferredFamily = resolvePreferredFamily(host);
    const resolvedTarget = await resolvePreferredAddress(host, servername, preferredFamily);
    const transportVariants = buildTransportVariants(host);

    return transportVariants.map((variant) => ({
        auth: { user, pass },
        connectionTimeout: toOptionalNumber(process.env.SMTP_CONNECTION_TIMEOUT),
        dnsTimeout: toOptionalNumber(process.env.SMTP_DNS_TIMEOUT),
        from,
        greetingTimeout: toOptionalNumber(process.env.SMTP_GREETING_TIMEOUT),
        host: resolvedTarget.host,
        originalHost: host,
        port: variant.port,
        preferredFamily,
        requireTLS: variant.requireTLS,
        resolvedAddress: resolvedTarget.resolvedAddress,
        resolvedFamily: resolvedTarget.resolvedFamily,
        secure: variant.secure,
        servername: resolvedTarget.servername,
        socketTimeout: toOptionalNumber(process.env.SMTP_SOCKET_TIMEOUT),
    }));
};

let cachedTransporterPromise = null;

const getErrorCode = (error) => String(error?.code || "").toUpperCase();
const getErrorMessage = (error) => String(error?.message || "");

const isConnectionError = (error) => {
    const errorCode = getErrorCode(error);
    const errorMessage = getErrorMessage(error);

    return (
        [
            "EACCES",
            "ECONNECTION",
            "ECONNREFUSED",
            "EHOSTUNREACH",
            "ENETUNREACH",
            "ESOCKET",
            "ETIMEDOUT",
        ].includes(errorCode) ||
        /\b(EACCES|ECONNREFUSED|EHOSTUNREACH|ENETUNREACH|ETIMEDOUT)\b/i.test(errorMessage)
    );
};

const toMailHttpError = (error) => {
    if (error?.statusCode) {
        return error;
    }

    const errorCode = getErrorCode(error);
    const errorMessage = getErrorMessage(error);

    if (errorCode === "EAUTH") {
        return createHttpError(
            "Email authentication failed. Verify EMAIL_USER and EMAIL_PASS on the server.",
            503,
        );
    }

    if (
        ["EACCES", "ECONNREFUSED", "EHOSTUNREACH", "ENETUNREACH"].includes(errorCode) ||
        /\b(EACCES|ECONNREFUSED|EHOSTUNREACH|ENETUNREACH)\b/i.test(errorMessage)
    ) {
        return createHttpError(
            "SMTP connection is blocked or unreachable. Check outbound SMTP access, firewall rules, or try SMTP_PORT=587 with SMTP_SECURE=false.",
            503,
        );
    }

    if (["ECONNECTION", "ESOCKET", "ETIMEDOUT"].includes(errorCode)) {
        return createHttpError("Email service is temporarily unreachable.", 503);
    }

    return createHttpError(errorMessage || "Failed to send OTP email.", 503);
};

const formatMailError = (error, config, phase) => ({
    address: error?.address,
    code: error?.code,
    command: error?.command,
    errno: error?.errno,
    host: config?.host,
    message: error?.message,
    phase,
    port: config?.port,
    preferredFamily: config?.preferredFamily,
    requireTLS: config?.requireTLS,
    response: error?.response,
    resolvedAddress: config?.resolvedAddress,
    resolvedFamily: config?.resolvedFamily,
    secure: config?.secure,
    servername: config?.servername,
    stack: error?.stack,
    syscall: error?.syscall,
});

const createTransporter = (config) =>
    nodemailer.createTransport({
        auth: config.auth,
        connectionTimeout: config.connectionTimeout,
        dnsTimeout: config.dnsTimeout,
        greetingTimeout: config.greetingTimeout,
        host: config.host,
        port: config.port,
        requireTLS: config.requireTLS,
        secure: config.secure,
        servername: config.servername,
        socketTimeout: config.socketTimeout,
    });

const loadTransporter = async () => {
    const configs = await resolveMailerConfigs();
    let lastError = null;

    for (let index = 0; index < configs.length; index += 1) {
        const config = configs[index];
        const transporter = createTransporter(config);

        try {
            await transporter.verify();
            return { config, transporter };
        } catch (error) {
            lastError = error;
            transporter.close?.();

            console.error("SMTP transport verification failed", formatMailError(error, config, "verify"));

            const hasFallback = index < configs.length - 1;

            if (!hasFallback || !isConnectionError(error)) {
                break;
            }

            console.warn(
                `Retrying SMTP using alternate port after ${config.originalHost}:${config.port} failed.`,
            );
        }
    }

    throw toMailHttpError(lastError || new Error("Failed to initialize email transport."));
};

const getTransporter = async () => {
    if (!cachedTransporterPromise) {
        cachedTransporterPromise = loadTransporter().catch((error) => {
            cachedTransporterPromise = null;
            throw error;
        });
    }

    return await cachedTransporterPromise;
};

async function sendVerificationEmail(to, subject, body) {
    const { transporter, config } = await getTransporter();

    try {
        await transporter.sendMail({
            from: config.from,
            to,
            subject,
            text: body,
        });
    } catch (error) {
        cachedTransporterPromise = null;

        console.error("Failed to send OTP email", formatMailError(error, config, "send"));
        throw toMailHttpError(error);
    }
}

module.exports = sendVerificationEmail;
