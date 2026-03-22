import { clearPurchasedProductIds } from "./purchaseSession";

const CUSTOMER_JWT_KEY = "jwt";
export const CUSTOMER_PROFILE_OVERRIDES_KEY = "customer_profile_overrides";

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

export const getStoredCustomerJwt = () => {
    const storage = getStorage();
    return storage?.getItem(CUSTOMER_JWT_KEY)?.trim() || null;
};

export const clearCustomerSession = () => {
    const storage = getStorage();
    storage?.removeItem(CUSTOMER_JWT_KEY);
    storage?.removeItem("role");
    storage?.removeItem(CUSTOMER_PROFILE_OVERRIDES_KEY);
    clearPurchasedProductIds();
};

export const getCustomerJwtPayload = (token: string) => {
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

export const isCustomerJwtExpired = (token: string, bufferMs = 5000) => {
    const payload = getCustomerJwtPayload(token);

    if (!payload?.exp) {
        return true;
    }

    return payload.exp * 1000 <= Date.now() + bufferMs;
};

export const getValidCustomerJwt = () => {
    const token = getStoredCustomerJwt();

    if (!token) {
        return null;
    }

    if (isCustomerJwtExpired(token)) {
        clearCustomerSession();
        return null;
    }

    return token;
};

export const isCustomerProtectedPath = (pathname: string) =>
    pathname.startsWith("/customer/profile") ||
    pathname.startsWith("/checkout") ||
    pathname.startsWith("/payment/success");
