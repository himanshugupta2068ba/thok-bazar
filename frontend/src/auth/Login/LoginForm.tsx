import { TextField, Box, Typography, Button, Grid, Alert } from "@mui/material";
import { useFormik } from "formik";
import { useAppDispatch, useAppSelector } from "../../Redux Toolkit/store";
import { signin, signinWithGoogle, clearError } from "../../Redux Toolkit/featurs/Auth/authSlice";
import { useNavigate } from "react-router";
import { GoogleSignInButton } from "../../common/GoogleSignInButton";

export const LoginForm = () => {
    const { auth } = useAppSelector((state) => state);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            email: "",
            password: "",
        },
        validate: (values) => {
            const errors: any = {};

            if (!values.email) {
                errors.email = "Email is required";
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
                errors.email = "Invalid email format";
            }

            if (!values.password) {
                errors.password = "Password is required";
            }

            return errors;
        },
        onSubmit: async (values) => {
            try {
                dispatch(clearError());
                await dispatch(signin(values)).unwrap();
                navigate("/");
            } catch (error) {
                console.log("Login failed:", error);
            }
        },
    });

    const getErrorMessage = () => {
        if (!auth.error) return null;
        if (typeof auth.error === "string") return auth.error;
        if (typeof auth.error === "object" && (auth.error as any)?.error) return (auth.error as any).error;
        if (typeof auth.error === "object" && (auth.error as any)?.message) return (auth.error as any).message;
        return "An error occurred";
    };

    const handleGoogleSignin = async (credential: string) => {
        try {
            dispatch(clearError());
            await dispatch(signinWithGoogle({ credential })).unwrap();
            navigate("/");
        } catch (error) {
            console.log("Google login failed:", error);
        }
    };

    return (
        <Box sx={{ padding: { xs: 3, sm: 5 } }}>
            <Typography variant="h5" sx={{ marginBottom: 3, fontWeight: 600, textAlign: "center", color: "teal" }}>
                Login With Password
            </Typography>

            {auth.error && getErrorMessage() && (
                <Alert severity="error" sx={{ marginBottom: 2 }} onClose={() => dispatch(clearError())}>
                    {getErrorMessage()}
                </Alert>
            )}

            <Box component="form" onSubmit={formik.handleSubmit}>
                <Grid container spacing={3}>
                    <Grid size={{ xs: 12 }}>
                        <TextField
                            fullWidth
                            label="Email"
                            name="email"
                            placeholder="Enter your email"
                            type="email"
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.email && Boolean(formik.errors.email)}
                            helperText={formik.touched.email && formik.errors.email}
                            variant="outlined"
                            disabled={auth.loading}
                        />
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                        <TextField
                            fullWidth
                            label="Password"
                            name="password"
                            placeholder="Enter your password"
                            type="password"
                            value={formik.values.password}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.password && Boolean(formik.errors.password)}
                            helperText={formik.touched.password && formik.errors.password}
                            variant="outlined"
                            disabled={auth.loading}
                        />
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                        <Button
                            fullWidth
                            variant="contained"
                            type="submit"
                            disabled={auth.loading}
                            sx={{ py: 1.5, fontSize: "1rem", fontWeight: 600 }}
                        >
                            {auth.loading ? "Signing in..." : "Login"}
                        </Button>
                    </Grid>
                </Grid>
            </Box>

            <div className="my-5 flex items-center gap-3">
                <div className="h-px flex-1 bg-slate-200" />
                <span className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">or</span>
                <div className="h-px flex-1 bg-slate-200" />
            </div>

            <GoogleSignInButton disabled={auth.loading} buttonText="signin_with" onCredential={handleGoogleSignin} />
            <Typography sx={{ mt: 2, textAlign: "center", color: "#64748b", fontSize: 13 }}>
                Use Google if your customer email is a Google account.
            </Typography>
        </Box>
    );
};
