import { TextField, Box, Typography, Button, Alert } from "@mui/material";
import { useFormik } from "formik";
import { useNavigate } from "react-router";
import { clearSellerError, sendLoginOtp, verifyLoginOtp } from "../../Redux Toolkit/featurs/seller/sellerAuthentication";
import { useAppDispatch, useAppSelector } from "../../Redux Toolkit/store";

const sellerLoginBenefits = [
    "Manage your orders.",
    "Update your products.",
    "Track payments and reports.",
];

export const SellerLogin=()=>{

    const { seller } = useAppSelector((state) => state);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const formik=useFormik({
        initialValues:{
            email:"",
            otp:""
        },
        validate: (values) => {
            const errors: any = {};

            if (!values.email) {
                errors.email = "Email is required";
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
                errors.email = "Invalid email format";
            }

            if (seller.otpSent && !values.otp) {
                errors.otp = "OTP is required";
            }

            return errors;
        },
        onSubmit: (values) => {
            dispatch(clearSellerError());
            dispatch(
                verifyLoginOtp({
                    email: values.email,
                    otp: values.otp,
                    navigate,
                })
            );
        }
    });

    const handleSendOtp = async () => {
        const errors = await formik.validateForm();
        formik.setTouched({ ...formik.touched, email: true });

        if (errors.email || !formik.values.email) {
            return;
        }

        dispatch(clearSellerError());
        const email="signin_seller_"+formik.values.email;
        dispatch(sendLoginOtp({ email}));
    };

    const getErrorMessage = () => {
        if (!seller.error) return null;
        if (typeof seller.error === "string") return seller.error;
        if (typeof seller.error === "object" && (seller.error as any)?.error) return (seller.error as any).error;
        if (typeof seller.error === "object" && (seller.error as any)?.message) return (seller.error as any).message;
        return "An error occurred";
    };

    return(
        <Box sx={{ padding: { xs: 3, sm: 5 } }}>
            <div className="space-y-6">
                <div className="space-y-3">
                    <span className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-emerald-800">
                        {seller.otpSent ? "Verify Access" : "Seller Sign In"}
                    </span>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: "#0f172a" }}>
                        Seller Login
                    </Typography>
                    <Typography sx={{ color: "#475569", fontSize: 15, lineHeight: 1.8 }}>
                        {seller.otpSent
                            ? "Enter the OTP sent to your seller email."
                            : "Enter your seller email to receive an OTP."}
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

                {seller.otpSent ? (
                    <div className="rounded-[22px] border border-emerald-200 bg-emerald-50/70 px-4 py-3 text-sm text-emerald-900">
                        OTP sent to <span className="font-semibold">{formik.values.email || "your email"}</span>.
                    </div>
                ) : null}

                <Box
                    component="form"
                    onSubmit={formik.handleSubmit}
                    className="rounded-[26px] border border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] p-4 shadow-[0_18px_45px_rgba(15,23,42,0.05)] sm:p-5"
                >
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className={seller.otpSent ? "" : "sm:col-span-2"}>
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

                        {seller.otpSent ? (
                            <div>
                                <TextField
                                    fullWidth
                                    label="OTP"
                                    name="otp"
                                    placeholder="Enter OTP"
                                    value={formik.values.otp}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.otp && Boolean(formik.errors.otp)}
                                    helperText={formik.touched.otp && formik.errors.otp}
                                    variant="outlined"
                                />
                            </div>
                        ) : null}
                    </div>

                    <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <Typography sx={{ color: "#64748b", fontSize: 13, lineHeight: 1.7 }}>
                            {seller.otpSent
                                ? "Enter the OTP to continue."
                                : "OTP will be sent after you enter your email."}
                        </Typography>

                        <Button
                            variant="contained"
                            type={seller.otpSent ? "submit" : "button"}
                            onClick={seller.otpSent ? undefined : handleSendOtp}
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
                            {seller.loading ? "Please wait..." : seller.otpSent ? "Login" : "Send OTP"}
                        </Button>
                    </div>
                </Box>
            </div>
        </Box>
    )
}
