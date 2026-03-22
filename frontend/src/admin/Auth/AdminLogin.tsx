import { Alert, Box, Button, TextField, Typography } from "@mui/material";
import { useEffect, useState, type FormEvent } from "react";
import { useLocation, useNavigate } from "react-router";
import { api } from "../../config/api";
import { clearAdminSession, getValidAdminJwt } from "../../util/adminSession";

export const AdminLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const redirectTarget =
    typeof location.state?.from === "string" && location.state.from.startsWith("/admin")
      ? location.state.from
      : "/admin";

  useEffect(() => {
    let isActive = true;
    const existingToken = getValidAdminJwt();

    if (!existingToken) {
      return;
    }

    api
      .get("/admin/session", {
        headers: {
          Authorization: `Bearer ${existingToken}`,
        },
      })
      .then(() => {
        if (isActive) {
          navigate("/admin", { replace: true });
        }
      })
      .catch(() => {
        clearAdminSession();
      });

    return () => {
      isActive = false;
    };
  }, [navigate]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await api.post("/admin/login", {
        email: email.trim(),
        password,
      });

      localStorage.setItem("adminToken", response.data?.jwt || "");
      navigate(redirectTarget, { replace: true });
    } catch (requestError: any) {
      setError(
        requestError?.response?.data?.message ||
          requestError?.response?.data?.error ||
          requestError?.message ||
          "Unable to log in as admin",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[70vh] max-w-xl items-center justify-center">
        <Box
          component="form"
          onSubmit={handleSubmit}
          className="w-full rounded-[32px] border border-slate-200 bg-white p-8 shadow-[0_24px_70px_rgba(15,23,42,0.08)]"
        >
          <Typography
            variant="h4"
            sx={{ textAlign: "center", fontWeight: 700, color: "#0f172a" }}
          >
            Admin Login
          </Typography>
          <Typography
            sx={{
              mt: 1.5,
              textAlign: "center",
              color: "#475569",
              fontSize: 14,
              lineHeight: 1.7,
            }}
          >
            Enter the configured admin email and password to access the admin panel.
          </Typography>

          {error ? (
            <Alert severity="error" sx={{ mt: 3 }}>
              {error}
            </Alert>
          ) : null}

          <div className="mt-6 space-y-4">
            <TextField
              fullWidth
              label="Admin Email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="username"
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
            />
          </div>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading || !email.trim() || !password}
            sx={{ mt: 4, py: 1.5, fontWeight: 700, textTransform: "none" }}
          >
            {loading ? "Signing In..." : "Access Admin Panel"}
          </Button>
        </Box>
      </div>
    </section>
  );
};
