import axios from 'axios'
import { clearCustomerSession, getStoredCustomerJwt, isCustomerProtectedPath } from '../util/customerSession';
import { clearSellerSession, extractBearerToken, getStoredSellerJwt } from '../util/sellerSession';
import { clearAdminSession, getStoredAdminJwt } from '../util/adminSession';

const normalizeBaseUrl = (value?: string) => String(value || "").trim().replace(/\/$/, "");

const resolveApiBaseUrl = () => {
    const configuredBaseUrl = normalizeBaseUrl(import.meta.env.VITE_API_BASE_URL);

    if (configuredBaseUrl) {
        return configuredBaseUrl;
    }

    if (import.meta.env.DEV) {
        return "http://localhost:5000";
    }

    return "";
};

export const api=axios.create({
    baseURL:resolveApiBaseUrl() || undefined,
    headers:{
        'Content-Type':'application/json'
    }
})

api.interceptors.response.use(
    (response) => response,
    (error) => {
        const requestToken = extractBearerToken(
            error?.config?.headers?.Authorization || error?.config?.headers?.authorization,
        );
        const storedSellerToken = getStoredSellerJwt();
        const storedCustomerToken = getStoredCustomerJwt();
        const storedAdminToken = getStoredAdminJwt();
        const isSellerAuthFailure =
            error?.response?.status === 401 &&
            Boolean(requestToken) &&
            Boolean(storedSellerToken) &&
            requestToken === storedSellerToken;
        const isCustomerAuthFailure =
            error?.response?.status === 401 &&
            Boolean(requestToken) &&
            Boolean(storedCustomerToken) &&
            requestToken === storedCustomerToken;
        const isAdminAuthFailure =
            error?.response?.status === 401 &&
            Boolean(requestToken) &&
            Boolean(storedAdminToken) &&
            requestToken === storedAdminToken;

        if (isSellerAuthFailure) {
            clearSellerSession();

            if (typeof window !== "undefined" && window.location.pathname.startsWith("/seller")) {
                window.location.replace("/become-seller");
            }
        }

        if (isCustomerAuthFailure) {
            clearCustomerSession();

            if (typeof window !== "undefined" && isCustomerProtectedPath(window.location.pathname)) {
                window.location.replace("/login");
            }
        }

        if (isAdminAuthFailure) {
            clearAdminSession();

            if (typeof window !== "undefined" && window.location.pathname.startsWith("/admin")) {
                window.location.replace("/admin/login");
            }
        }

        return Promise.reject(error);
    },
);
