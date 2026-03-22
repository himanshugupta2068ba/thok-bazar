import { CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import type { PropsWithChildren } from "react";
import { Navigate, useLocation } from "react-router";
import { logout } from "../Redux Toolkit/featurs/Auth/authSlice";
import { clearCartState } from "../Redux Toolkit/featurs/coustomer/cartSlice";
import { resetOrderState } from "../Redux Toolkit/featurs/coustomer/orderSlice";
import { resetUserState, fetchUserProfile } from "../Redux Toolkit/featurs/coustomer/userSlice";
import { resetWishlistState } from "../Redux Toolkit/featurs/coustomer/wishlistSlice";
import { useAppDispatch } from "../Redux Toolkit/store";
import { clearCustomerSession, getValidCustomerJwt } from "../util/customerSession";

type GuardState = "checking" | "authorized" | "unauthorized";

export const CustomerProtectedRoute = ({ children }: PropsWithChildren) => {
    const dispatch = useAppDispatch();
    const location = useLocation();
    const [guardState, setGuardState] = useState<GuardState>("checking");

    useEffect(() => {
        let isActive = true;

        const clearCustomerState = () => {
            dispatch(logout());
            dispatch(resetUserState());
            dispatch(clearCartState());
            dispatch(resetOrderState());
            dispatch(resetWishlistState());
        };

        const validateCustomerSession = async () => {
            const jwt = getValidCustomerJwt();

            if (!jwt) {
                clearCustomerState();
                if (isActive) {
                    setGuardState("unauthorized");
                }
                return;
            }

            try {
                await dispatch(fetchUserProfile(jwt)).unwrap();
                if (isActive) {
                    setGuardState("authorized");
                }
            } catch {
                clearCustomerSession();
                clearCustomerState();
                if (isActive) {
                    setGuardState("unauthorized");
                }
            }
        };

        setGuardState("checking");
        validateCustomerSession();

        return () => {
            isActive = false;
        };
    }, [dispatch, location.pathname]);

    if (guardState === "checking") {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <CircularProgress />
            </div>
        );
    }

    if (guardState === "unauthorized") {
        return <Navigate to="/login" replace state={{ from: `${location.pathname}${location.search}` }} />;
    }

    return <>{children}</>;
};
