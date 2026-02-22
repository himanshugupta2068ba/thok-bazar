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

    const handleSentOtp=()=>{
        formik.validateField("email");
        if(formik.errors.email){
            return;
        }
        dispatch(clearError());
        // Send with "signin_" prefix to indicate login OTP (backend requirement)
        dispatch(sendLoginSignupOtp({email:`signin_${formik.values.email}`}));
    }

    const getErrorMessage = () => {
        if (!auth.error) return null;
        if (typeof auth.error === 'string') return auth.error;
        if (typeof auth.error === 'object' && (auth.error as any)?.error) return (auth.error as any).error;
        if (typeof auth.error === 'object' && (auth.error as any)?.message) return (auth.error as any).message;
        return "An error occurred";
    };

    return(
        <Box sx={{ padding: 5 }}>
            <Typography variant="h5" sx={{ marginBottom: 3, fontWeight: 600, textAlign: "center", color:"teal"}}>
                 Login
            </Typography>
            
            {/* Error Alert */}
            {auth.error && getErrorMessage() && (
                <Alert severity="error" sx={{ marginBottom: 2 }} onClose={() => dispatch(clearError())}>
                    {getErrorMessage()}
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
                        />
                    </Grid>}

                    {/* Submit Button */}
                    <Grid size={{ xs: 12 }}>
                        <Button
                            fullWidth
                            variant="contained"
                            type="submit"
                            sx={{ py: 1.5, fontSize: "1rem", fontWeight: 600 }}
                            onClick={auth.otpSent?(e)=>formik.handleSubmit(e as any):handleSentOtp}
                        >
                            {auth.otpSent ? "Login" : "Send OTP"}
                            {auth.loading ? "Please wait..." : "Login"}
                        </Button>
                    </Grid>
                </Grid>
            </Box>
        )
}
