const normalizeOrigin = (value = "") => String(value || "").trim().replace(/\/$/, "");

const parseOrigins = (value = "") =>
  String(value || "")
    .split(",")
    .map((origin) => normalizeOrigin(origin))
    .filter(Boolean);

const explicitOrigins = new Set([
  "http://localhost:5173",
  "http://localhost:4173",
  normalizeOrigin(process.env.FRONTEND_URL),
  ...parseOrigins(process.env.CORS_ORIGINS),
].filter(Boolean));

const shouldAllowVercelPreview = String(process.env.ALLOW_VERCEL_PREVIEWS || "false").toLowerCase() === "true";

const isAllowedOrigin = (origin) => {
  const normalizedOrigin = normalizeOrigin(origin);

  if (!normalizedOrigin) {
    return true;
  }

  if (explicitOrigins.has(normalizedOrigin)) {
    return true;
  }

  if (!shouldAllowVercelPreview) {
    return false;
  }

  try {
    const parsedUrl = new URL(normalizedOrigin);
    return parsedUrl.protocol === "https:" && parsedUrl.hostname.endsWith(".vercel.app");
  } catch {
    return false;
  }
};

module.exports = {
  allowedHeaders: ["Authorization", "Content-Type"],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  origin(origin, callback) {
    if (isAllowedOrigin(origin)) {
      callback(null, true);
      return;
    }

    callback(new Error(`Origin not allowed by CORS: ${origin}`));
  },
};
