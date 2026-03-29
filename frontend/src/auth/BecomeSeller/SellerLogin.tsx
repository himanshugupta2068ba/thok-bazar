import { TextField, Box, Typography, Button, Alert } from "@mui/material";
import { useFormik } from "formik";
import { useNavigate } from "react-router";
import { clearSellerError, signinSeller, signinSellerWithGoogle } from "../../Redux Toolkit/featurs/seller/sellerAuthentication";
import { useAppDispatch, useAppSelector } from "../../Redux Toolkit/store";
import { GoogleSignInButton } from "../../common/GoogleSignInButton";

const sellerLoginBenefits = [
    "Manage your orders.",
    "Update your products.",
    "Track payments and reports.",
];

export const SellerLogin = () => {
    const { seller } = useAppSelector((state) => state);
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
        onSubmit: (values) => {
            dispatch(clearSellerError());
            dispatch(
                signinSeller({
                    email: values.email,
                    password: values.password,
                    navigate,
                })
            );
        },
    });

    const getErrorMessage = () => {
        if (!seller.error) return null;
        if (typeof seller.error === "string") return seller.error;
        if (typeof seller.error === "object" && (seller.error as any)?.error) return (seller.error as any).error;
        if (typeof seller.error === "object" && (seller.error as any)?.message) return (seller.error as any).message;
        return "An error occurred";
    };

    const handleGoogleSignin = async (credential: string) => {
        try {
            dispatch(clearSellerError());
            await dispatch(
                signinSellerWithGoogle({
                    credential,
                    navigate,
                })
            ).unwrap();
        } catch (error) {
            console.log("Seller Google login failed:", error);
        }
    };

    return (
        <Box sx={{ padding: { xs: 3, sm: 5 } }}>
            <div className="space-y-6">
                <div className="space-y-3">
                    <span className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-emerald-800">
                        Seller Sign In
                    </span>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: "#0f172a" }}>
                        Seller Login
                    </Typography>
                    <Typography sx={{ color: "#475569", fontSize: 15, lineHeight: 1.8 }}>
                        Login with your seller email and password, or use Google with the same seller email.
                    </Typography>
                </div>

                <div className="grid gap-3 md:grid-cols-3">
                    {sellerLoginBenefits.map((benefit) => (
                        <div
                            key={benefit}
                            className="rounded-[22px] border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-600"
                        >
                            {benefit}
                        </div>
                    ))}
                </div>

                {seller.error && getErrorMessage() && (
                    <Alert severity="error" sx={{ marginBottom: 0 }} onClose={() => dispatch(clearSellerError())}>
                        {getErrorMessage()}
                    </Alert>
                )}

                <Box
                    component="form"
                    onSubmit={formik.handleSubmit}
                    className="rounded-[26px] border border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] p-4 shadow-[0_18px_45px_rgba(15,23,42,0.05)] sm:p-5"
                >
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="sm:col-span-2">
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
                        </div>

                        <div className="sm:col-span-2">
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
                            />
                        </div>
                    </div>

                    <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <Typography sx={{ color: "#64748b", fontSize: 13, lineHeight: 1.7 }}>
                            Your Google account email must match an existing seller account email.
                        </Typography>

                        <Button
                            variant="contained"
                            type="submit"
                            disabled={seller.loading}
                            sx={{
                                minWidth: { xs: "100%", sm: 180 },
                                py: 1.5,
                                px: 3,
                                fontSize: "1rem",
                                fontWeight: 700,
                                textTransform: "none",
                                borderRadius: "16px",
                                boxShadow: "none",
                            }}
                        >
                            {seller.loading ? "Please wait..." : "Login"}
                        </Button>
                    </div>
                </Box>

                <div className="flex items-center gap-3">
                    <div className="h-px flex-1 bg-slate-200" />
                    <span className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">or</span>
                    <div className="h-px flex-1 bg-slate-200" />
                </div>

                <GoogleSignInButton
                    buttonText="signin_with"
                    disabled={seller.loading}
                    onCredential={handleGoogleSignin}
                />
            </div>
        </Box>
    );
};
