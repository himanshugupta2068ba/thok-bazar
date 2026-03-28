import { TextField, Box, Typography, Button, Grid, Alert } from "@mui/material";
import { useFormik } from "formik"
import { useAppDispatch, useAppSelector } from "../../Redux Toolkit/store";
import { sendLoginSignupOtp, signin, clearError } from "../../Redux Toolkit/featurs/Auth/authSlice";
import { useNavigate } from "react-router";

export const LoginForm=()=>{

    const {auth}=useAppSelector((state)=>state);
        //   const auth=useAppSelector((state)=>state.auth);
            const dispatch=useAppDispatch();
            const navigate=useNavigate();
    const formik=useFormik({
        initialValues:{
            email:"",
            otp:""
        },
         validate: (values) => {
    const errors: any = {};

    if (!values.email) {
      errors.email = "Email is required";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)
    ) {
      errors.email = "Invalid email format";
    }

    return errors;
  },
        onSubmit: async (values) => {
  try {
    dispatch(clearError());
    const result = await dispatch(signin(values)).unwrap();
    localStorage.setItem("jwt", result.jwt);
    navigate("/");
  } catch (error) {
    console.log("Login failed:", error);
  }
}
    })

    const handleSentOtp = async () => {
        const errors = await formik.validateForm();
        formik.setTouched({ ...formik.touched, email: true });

        if (errors.email || !formik.values.email) {
            return;
        }
        dispatch(clearError());
        dispatch(sendLoginSignupOtp({email:`signin_user_${formik.values.email}`}));
    };

    const getErrorMessage = () => {
        if (!auth.error) return null;
        if (typeof auth.error === 'string') return auth.error;
        if (typeof auth.error === 'object' && (auth.error as any)?.error) return (auth.error as any).error;
        if (typeof auth.error === 'object' && (auth.error as any)?.message) return (auth.error as any).message;
        return "An error occurred";
    };

    const buttonLabel = auth.loading
        ? auth.otpSent
            ? "Logging in..."
            : "Sending OTP..."
        : auth.otpSent
            ? "Login"
            : "Send OTP";

    return(
        <Box sx={{ padding: { xs: 3, sm: 5 } }}>
            <Typography variant="h5" sx={{ marginBottom: 3, fontWeight: 600, textAlign: "center", color:"teal"}}>
                 Login
            </Typography>
            
            {/* Error Alert */}
            {auth.error && getErrorMessage() && (
                <Alert severity="error" sx={{ marginBottom: 2 }} onClose={() => dispatch(clearError())}>
                    {getErrorMessage()}
                </Alert>
            )}

            {auth.loading && !auth.otpSent && (
                <Alert severity="info" sx={{ marginBottom: 2 }}>
                    Sending OTP to {formik.values.email || "your email"}...
                </Alert>
            )}
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
                            disabled={auth.loading}
                        />
                    </Grid>

                    {/* OTP */}
                   {auth.otpSent &&  <Grid size={{ xs: 12 }}>
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
                            disabled={auth.loading}
                        />
                    </Grid>}

                    {/* Submit Button */}
                    <Grid size={{ xs: 12 }}>
                        <Button
                            fullWidth
                            variant="contained"
                            type="submit"
                            disabled={auth.loading}
                            sx={{ py: 1.5, fontSize: "1rem", fontWeight: 600 }}
                            onClick={auth.otpSent?(e)=>formik.handleSubmit(e as any):handleSentOtp}
                        >
                            {buttonLabel}
                        </Button>
                    </Grid>
                </Grid>
            </Box>
        )
}
