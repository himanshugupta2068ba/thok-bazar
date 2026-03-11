import { TextField, Box, Typography, Button, Grid, Alert } from "@mui/material";
import { useFormik } from "formik";
import { useNavigate } from "react-router";
import { clearSellerError, sendLoginOtp, verifyLoginOtp } from "../../Redux Toolkit/featurs/seller/sellerAuthentication";
import { useAppDispatch, useAppSelector } from "../../Redux Toolkit/store";

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
        const email="signin_"+formik.values.email;
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
        <Box sx={{ padding: 5 }}>
            <Typography variant="h5" sx={{ marginBottom: 3, fontWeight: 600, textAlign: "center", color:"teal"}}>
                Seller Login
            </Typography>

            {seller.error && getErrorMessage() && (
                <Alert severity="error" sx={{ marginBottom: 2 }} onClose={() => dispatch(clearSellerError())}>
                    {getErrorMessage()}
                </Alert>
            )}
            
            <form onSubmit={formik.handleSubmit}>
                <Grid container spacing={3}>
                    
                    {/* Email */}
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

                    {/* OTP */}
                    {seller.otpSent && <Grid size={{ xs: 12 }}>
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
                    </Grid>}

                    {/* Submit Button */}
                    <Grid size={{ xs: 12 }}>
                        <Button
                            fullWidth
                            variant="contained"
                            type={seller.otpSent ? "submit" : "button"}
                            onClick={seller.otpSent ? undefined : handleSendOtp}
                            disabled={seller.loading}
                            sx={{ py: 1.5, fontSize: "1rem", fontWeight: 600 }}
                        >
                            {seller.loading ? "Please wait..." : seller.otpSent ? "Login" : "Send OTP"}
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </Box>
    )
}
