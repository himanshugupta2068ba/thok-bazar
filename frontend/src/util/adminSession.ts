const ADMIN_JWT_KEY = "adminToken";

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

export const getStoredAdminJwt = () => {
  const storage = getStorage();
  return storage?.getItem(ADMIN_JWT_KEY)?.trim() || null;
};

export const clearAdminSession = () => {
  const storage = getStorage();
  storage?.removeItem(ADMIN_JWT_KEY);
};

export const getAdminJwtPayload = (token: string) => {
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

export const isAdminJwtExpired = (token: string, bufferMs = 5000) => {
  const payload = getAdminJwtPayload(token);

  if (!payload?.exp) {
    return true;
  }

  return payload.exp * 1000 <= Date.now() + bufferMs;
};

export const getValidAdminJwt = () => {
  const token = getStoredAdminJwt();

  if (!token) {
    return null;
  }

  if (isAdminJwtExpired(token)) {
    clearAdminSession();
    return null;
  }

  return token;
};
