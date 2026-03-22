import { CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import type { PropsWithChildren } from "react";
import { Navigate, useLocation } from "react-router";
import { logoutSeller } from "../Redux Toolkit/featurs/seller/sellerAuthentication";
import { fetchSellerProfile, resetSellerData } from "../Redux Toolkit/featurs/seller/sellerSlice";
import { useAppDispatch } from "../Redux Toolkit/store";
import { clearSellerSession, getValidSellerJwt } from "../util/sellerSession";

type GuardState = "checking" | "authorized" | "unauthorized";

export const SellerProtectedRoute = ({ children }: PropsWithChildren) => {
    const dispatch = useAppDispatch();
    const location = useLocation();
    const [guardState, setGuardState] = useState<GuardState>("checking");

    useEffect(() => {
        let isActive = true;

        const validateSellerSession = async () => {
            const sellerJwt = getValidSellerJwt();

            if (!sellerJwt) {
                dispatch(logoutSeller());
                dispatch(resetSellerData());
                if (isActive) {
                    setGuardState("unauthorized");
                }
                return;
            }

            try {
                await dispatch(fetchSellerProfile(sellerJwt)).unwrap();
                if (isActive) {
                    setGuardState("authorized");
                }
            } catch {
                clearSellerSession();
                dispatch(logoutSeller());
                dispatch(resetSellerData());
                if (isActive) {
                    setGuardState("unauthorized");
                }
            }
        };

        setGuardState("checking");
        validateSellerSession();

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
        return <Navigate to="/become-seller" replace state={{ from: location.pathname }} />;
    }

    return <>{children}</>;
};
