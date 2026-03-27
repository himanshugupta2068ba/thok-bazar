const dns = require('dns').promises;
const nodemailer = require('nodemailer');
const createHttpError = require('./createHttpError');

const normalizeHost = (value) => String(value || "").trim().toLowerCase();

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

const resolveMailerConfig = async () => {
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

    const port = Number(process.env.SMTP_PORT || (host === "smtp.gmail.com" ? 465 : 587));
    const secure = toBoolean(process.env.SMTP_SECURE, port === 465);
    const from = String(process.env.EMAIL_FROM || user).trim();
    const servername = String(process.env.SMTP_SERVERNAME || host).trim() || host;
    const preferredFamily = resolvePreferredFamily(host);
    const resolvedTarget = await resolvePreferredAddress(host, servername, preferredFamily);

    return {
        auth: { user, pass },
        connectionTimeout: toOptionalNumber(process.env.SMTP_CONNECTION_TIMEOUT),
        dnsTimeout: toOptionalNumber(process.env.SMTP_DNS_TIMEOUT),
        from,
        greetingTimeout: toOptionalNumber(process.env.SMTP_GREETING_TIMEOUT),
        host: resolvedTarget.host,
        port,
        preferredFamily,
        resolvedAddress: resolvedTarget.resolvedAddress,
        resolvedFamily: resolvedTarget.resolvedFamily,
        secure,
        servername: resolvedTarget.servername,
        socketTimeout: toOptionalNumber(process.env.SMTP_SOCKET_TIMEOUT),
    };
};

let cachedTransporterPromise = null;
let cachedConfig = null;

const getTransporter = async () => {
    if (!cachedTransporterPromise) {
        cachedTransporterPromise = (async () => {
            cachedConfig = await resolveMailerConfig();

            return nodemailer.createTransport({
                auth: cachedConfig.auth,
                connectionTimeout: cachedConfig.connectionTimeout,
                dnsTimeout: cachedConfig.dnsTimeout,
                greetingTimeout: cachedConfig.greetingTimeout,
                host: cachedConfig.host,
                port: cachedConfig.port,
                secure: cachedConfig.secure,
                servername: cachedConfig.servername,
                socketTimeout: cachedConfig.socketTimeout,
            });
        })().catch((error) => {
            cachedTransporterPromise = null;
            cachedConfig = null;
            throw error;
        });
    }

    return {
        config: cachedConfig,
        transporter: await cachedTransporterPromise,
    };
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
        console.error("Failed to send OTP email", {
            address: error?.address,
            code: error?.code,
            command: error?.command,
            errno: error?.errno,
            host: config?.host,
            port: config?.port,
            preferredFamily: config?.preferredFamily,
            response: error?.response,
            resolvedAddress: config?.resolvedAddress,
            resolvedFamily: config?.resolvedFamily,
            servername: config?.servername,
            syscall: error?.syscall,
        });

        if (error?.code === "EAUTH") {
            throw createHttpError(
                "Email authentication failed. Verify EMAIL_USER and EMAIL_PASS on Render.",
                503,
            );
        }

        if (["ENETUNREACH", "EHOSTUNREACH"].includes(String(error?.code || ""))) {
            throw createHttpError(
                "SMTP network route is unreachable. Gmail SMTP is now configured to prefer IPv4; redeploy Render and retry.",
                503,
            );
        }

        if (["ECONNECTION", "ESOCKET", "ETIMEDOUT"].includes(String(error?.code || ""))) {
            throw createHttpError("Email service is temporarily unreachable.", 503);
        }

        throw createHttpError("Failed to send OTP email.", 503);
    }
}

module.exports = sendVerificationEmail;
