const https = require("https");
const jwt = require("jsonwebtoken");

const GOOGLE_CERTS_URL = "https://www.googleapis.com/oauth2/v1/certs";
const GOOGLE_ISSUERS = ["https://accounts.google.com", "accounts.google.com"];

let cachedCerts = null;
let cachedCertExpiry = 0;

const parseMaxAge = (cacheControlHeader = "") => {
    const match = String(cacheControlHeader).match(/max-age=(\d+)/i);
    return match ? Number(match[1]) : 3600;
};

const readJson = (url) =>
    new Promise((resolve, reject) => {
        https
            .get(url, (response) => {
                let body = "";

                response.on("data", (chunk) => {
                    body += chunk;
                });

                response.on("end", () => {
                    if (response.statusCode !== 200) {
                        return reject(new Error(`Google auth request failed with status ${response.statusCode}`));
                    }

                    try {
                        resolve({
                            data: JSON.parse(body),
                            headers: response.headers,
                        });
                    } catch (_error) {
                        reject(new Error("Invalid response from Google auth service"));
                    }
                });
            })
            .on("error", () => reject(new Error("Unable to reach Google auth service")));
    });

const getConfiguredAudiences = () => {
    const combinedValue = [process.env.GOOGLE_CLIENT_IDS, process.env.GOOGLE_CLIENT_ID]
        .filter(Boolean)
        .join(",");

    return combinedValue
        .split(",")
        .map((value) => value.trim())
        .filter(Boolean);
};

const getGoogleCertificates = async () => {
    if (cachedCerts && Date.now() < cachedCertExpiry) {
        return cachedCerts;
    }

    const response = await readJson(GOOGLE_CERTS_URL);
    const maxAgeSeconds = parseMaxAge(response.headers["cache-control"]);

    cachedCerts = response.data;
    cachedCertExpiry = Date.now() + maxAgeSeconds * 1000;

    return cachedCerts;
};

const verifyGoogleIdToken = async (credential) => {
    if (!credential || typeof credential !== "string") {
        throw new Error("Google credential is required");
    }

    const configuredAudiences = getConfiguredAudiences();

    if (!configuredAudiences.length) {
        throw new Error("Google sign-in is not configured on the backend");
    }

    const decodedToken = jwt.decode(credential, { complete: true });
    const keyId = decodedToken?.header?.kid;

    if (!keyId) {
        throw new Error("Invalid Google credential");
    }

    const certificates = await getGoogleCertificates();
    const certificate = certificates?.[keyId];

    if (!certificate) {
        throw new Error("Google sign-in certificate expired. Please try again.");
    }

    const payload = jwt.verify(credential, certificate, {
        algorithms: ["RS256"],
        audience: configuredAudiences,
        issuer: GOOGLE_ISSUERS,
    });

    if (!payload?.email || payload.email_verified !== true) {
        throw new Error("Google account email is not verified");
    }

    const normalizedEmail = String(payload.email).trim().toLowerCase();
    const normalizedName = String(payload.name || payload.given_name || normalizedEmail.split("@")[0]).trim();

    return {
        email: normalizedEmail,
        googleId: String(payload.sub || "").trim(),
        name: normalizedName || normalizedEmail.split("@")[0],
        picture: String(payload.picture || "").trim(),
    };
};

module.exports = {
    verifyGoogleIdToken,
};
