const SELLER_JWT_KEY = "sellerJwt";

const getStorage = () => {
    if (typeof window === "undefined") {
        return null;
    }

    return window.localStorage;
};

const normalizeBase64 = (value: string) => {
    const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
    const padding = normalized.length % 4;

    if (!padding) {
        return normalized;
    }

    return normalized.padEnd(normalized.length + (4 - padding), "=");
};

export const getStoredSellerJwt = () => {
    const storage = getStorage();
    return storage?.getItem(SELLER_JWT_KEY)?.trim() || null;
};

export const clearSellerSession = () => {
    const storage = getStorage();
    storage?.removeItem(SELLER_JWT_KEY);
};

export const extractBearerToken = (authorization?: string | null) => {
    if (!authorization) {
        return null;
    }

    const [scheme, token] = authorization.split(" ");

    if (scheme !== "Bearer" || !token) {
        return null;
    }

    return token;
};

export const getSellerJwtPayload = (token: string) => {
    try {
        const [, payload] = token.split(".");

        if (!payload) {
            return null;
        }

        return JSON.parse(atob(normalizeBase64(payload)));
    } catch {
        return null;
    }
};

export const isSellerJwtExpired = (token: string, bufferMs = 5000) => {
    const payload = getSellerJwtPayload(token);

    if (!payload?.exp) {
        return true;
    }

    return payload.exp * 1000 <= Date.now() + bufferMs;
};

export const getValidSellerJwt = () => {
    const token = getStoredSellerJwt();

    if (!token) {
        return null;
    }

    if (isSellerJwtExpired(token)) {
        clearSellerSession();
        return null;
    }

    return token;
};
