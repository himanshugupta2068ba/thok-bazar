import { CircularProgress } from "@mui/material";
import { useEffect, useState, type PropsWithChildren } from "react";
import { Navigate, useLocation } from "react-router";
import { api } from "../config/api";
import { clearAdminSession, getValidAdminJwt } from "../util/adminSession";

type GuardState = "checking" | "authorized" | "unauthorized";

export const AdminProtectedRoute = ({ children }: PropsWithChildren) => {
  const location = useLocation();
  const [guardState, setGuardState] = useState<GuardState>("checking");

  useEffect(() => {
    let isActive = true;

    const validateAdminSession = async () => {
      const adminJwt = getValidAdminJwt();

      if (!adminJwt) {
        if (isActive) {
          setGuardState("unauthorized");
        }
        return;
      }

      try {
        await api.get("/admin/session", {
          headers: {
            Authorization: `Bearer ${adminJwt}`,
          },
        });

        if (isActive) {
          setGuardState("authorized");
        }
      } catch {
        clearAdminSession();
        if (isActive) {
          setGuardState("unauthorized");
        }
      }
    };

    setGuardState("checking");
    validateAdminSession();

    return () => {
      isActive = false;
    };
  }, [location.pathname]);

  if (guardState === "checking") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <CircularProgress />
      </div>
    );
  }

  if (guardState === "unauthorized") {
    return (
      <Navigate
        to="/admin/login"
        replace
        state={{ from: `${location.pathname}${location.search}` }}
      />
    );
  }

  return <>{children}</>;
};
