import { TextField, Box, Typography, Button, Grid, Alert } from "@mui/material";
import { useFormik } from "formik";
import { useAppDispatch, useAppSelector } from "../../Redux Toolkit/store";
import { signup, signinWithGoogle, clearError } from "../../Redux Toolkit/featurs/Auth/authSlice";
import { useNavigate } from "react-router";
import { GoogleSignInButton } from "../../common/GoogleSignInButton";

export const SignUp = () => {
    const navigate = useNavigate();
    const auth = useAppSelector((state) => state.auth);
    const dispatch = useAppDispatch();
    const formik = useFormik({
        initialValues: {
            fullname: "",
            email: "",
            mobile: "",
            password: "",
            confirmPassword: "",
        },
        validate: (values) => {
            const errors: any = {};

            if (!values.fullname.trim()) {
                errors.fullname = "Full name is required";
            }

            if (!values.email) {
                errors.email = "Email is required";
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
                errors.email = "Invalid email format";
            }

            if (!/^\d{10}$/.test(values.mobile.trim())) {
                errors.mobile = "Mobile must be 10 digits";
            }

            if (values.password.length < 6) {
                errors.password = "Password must be at least 6 characters";
            }

            if (values.confirmPassword !== values.password) {
                errors.confirmPassword = "Passwords do not match";
            }

            return errors;
        },
        onSubmit: async (values) => {
            try {
                dispatch(clearError());
                await dispatch(signup({
                    signupRequest: {
                        email: values.email,
                        name: values.fullname,
                        mobile: values.mobile,
                        password: values.password,
                    },
                })).unwrap();
                navigate("/", { replace: true });
            } catch (error) {
                console.log("Signup failed:", error);
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
            navigate("/", { replace: true });
        } catch (error) {
            console.log("Google signup failed:", error);
        }
    };

    return (
        <Box sx={{ padding: { xs: 3, sm: 5 } }}>
            <Typography variant="h5" sx={{ marginBottom: 3, fontWeight: 600, textAlign: "center", color: "teal" }}>
                Sign Up With Password
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
                            label="Full Name"
                            name="fullname"
                            placeholder="Enter your full name"
                            type="text"
                            value={formik.values.fullname}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.fullname && Boolean(formik.errors.fullname)}
                            helperText={formik.touched.fullname && formik.errors.fullname}
                            variant="outlined"
                        />
                    </Grid>

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
                        />
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                        <TextField
                            fullWidth
                            label="Mobile"
                            name="mobile"
                            placeholder="Enter your mobile number"
                            value={formik.values.mobile}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.mobile && Boolean(formik.errors.mobile)}
                            helperText={formik.touched.mobile && formik.errors.mobile}
                            variant="outlined"
                        />
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                        <TextField
                            fullWidth
                            label="Password"
                            name="password"
                            type="password"
                            placeholder="Create a password"
                            value={formik.values.password}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.password && Boolean(formik.errors.password)}
                            helperText={formik.touched.password && formik.errors.password}
                            variant="outlined"
                        />
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                        <TextField
                            fullWidth
                            label="Confirm Password"
                            name="confirmPassword"
                            type="password"
                            placeholder="Confirm your password"
                            value={formik.values.confirmPassword}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
                            helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
                            variant="outlined"
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
                            {auth.loading ? "Please wait..." : "Create Account"}
                        </Button>
                    </Grid>

                    {Boolean(auth.error) && (
                        <Grid size={{ xs: 12 }}>
                            <Typography color="error" variant="body2">
                                {typeof auth.error === "object" && auth.error !== null
                                    ? String((auth.error as { error?: string; message?: string }).error || (auth.error as { error?: string; message?: string }).message || "Something went wrong")
                                    : String(auth.error)}
                            </Typography>
                        </Grid>
                    )}
                </Grid>
            </Box>

            <div className="my-5 flex items-center gap-3">
                <div className="h-px flex-1 bg-slate-200" />
                <span className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">or</span>
                <div className="h-px flex-1 bg-slate-200" />
            </div>

            <GoogleSignInButton disabled={auth.loading} onCredential={handleGoogleSignin} />
            <Typography sx={{ mt: 2, textAlign: "center", color: "#64748b", fontSize: 13 }}>
                Google sign-in will create your customer account automatically if it does not exist yet.
            </Typography>
        </Box>
    );
};
