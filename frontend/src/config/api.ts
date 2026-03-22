import axios from 'axios'
import { clearCustomerSession, getStoredCustomerJwt, isCustomerProtectedPath } from '../util/customerSession';
import { clearSellerSession, extractBearerToken, getStoredSellerJwt } from '../util/sellerSession';
import { clearAdminSession, getStoredAdminJwt } from '../util/adminSession';

export const api=axios.create({
    baseURL:"http://localhost:5000",
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
