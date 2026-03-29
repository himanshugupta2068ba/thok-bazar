const crypto = require("crypto");

const LOG_LEVELS = {
    silent: 0,
    error: 1,
    warn: 2,
    info: 3,
};

const configuredLogLevel = String(process.env.LOG_LEVEL || "warn").trim().toLowerCase();
const activeLogLevel = LOG_LEVELS[configuredLogLevel] ?? LOG_LEVELS.warn;

const shouldLog = (level) => activeLogLevel >= (LOG_LEVELS[level] ?? LOG_LEVELS.info);

const readHeader = (req, headerName) => {
    const headerValue = req?.headers?.[headerName];

    if (Array.isArray(headerValue)) {
        return String(headerValue[0] || "").trim();
    }

    return String(headerValue || "").trim();
};

const maskEmail = (value) => {
    const email = String(value || "").trim().toLowerCase();

    if (!email.includes("@")) {
        return email || null;
    }

    const [localPart, domain] = email.split("@");
    const visibleLocalPart = localPart.slice(0, 2);
    const maskedLocalPart = visibleLocalPart + "*".repeat(Math.max(localPart.length - visibleLocalPart.length, 2));

    return `${maskedLocalPart}@${domain}`;
};

const buildRequestContext = (req) => ({
    bodyKeys: Object.keys(req?.body || {}),
    ip: readHeader(req, "x-forwarded-for").split(",")[0].trim() || req?.ip || req?.socket?.remoteAddress || null,
    method: req?.method || null,
    origin: readHeader(req, "origin") || null,
    path: req?.originalUrl || req?.url || null,
    referer: readHeader(req, "referer") || null,
    requestId: req?.requestId || null,
    userAgent: readHeader(req, "user-agent") || null,
});

const requestLogger = (req, res, next) => {
    const requestId = readHeader(req, "x-request-id") || crypto.randomUUID();
    const startedAt = Date.now();

    req.requestId = requestId;
    req.requestContext = buildRequestContext({ ...req, requestId });

    res.setHeader("x-request-id", requestId);

    if (shouldLog("info")) {
        console.info("HTTP request started", req.requestContext);
    }

    res.on("finish", () => {
        if (shouldLog("info")) {
            console.info("HTTP request completed", {
                ...req.requestContext,
                durationMs: Date.now() - startedAt,
                statusCode: res.statusCode,
            });
        }
    });

    next();
};

const getRequestContext = (req, extraContext = {}) => ({
    ...(req?.requestContext || buildRequestContext(req)),
    ...extraContext,
});

const logInfo = (message, context = {}) => {
    if (shouldLog("info")) {
        console.info(message, context);
    }
};

const logWarn = (message, context = {}) => {
    if (shouldLog("warn")) {
        console.warn(message, context);
    }
};

const logError = (message, error, context = {}) => {
    if (shouldLog("error")) {
        console.error(message, {
            ...context,
            errorCode: error?.code,
            errorMessage: error?.message,
            errorStatusCode: error?.statusCode,
            stack: error?.stack,
        });
    }
};

module.exports = {
    getRequestContext,
    logError,
    logInfo,
    logWarn,
    maskEmail,
    requestLogger,
};
