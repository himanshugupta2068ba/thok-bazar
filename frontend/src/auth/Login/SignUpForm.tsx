import { TextField, Box, Typography, Button, Grid, Alert } from "@mui/material";
import { useFormik } from "formik"
import { useAppDispatch, useAppSelector } from "../../Redux Toolkit/store";
import { sendLoginSignupOtp, signup, clearError } from "../../Redux Toolkit/featurs/Auth/authSlice";
import {  useNavigate } from "react-router";


export const SignUp=()=>{
 
     const navigate=useNavigate();
    const auth=useAppSelector((state)=>state.auth);
    const dispatch=useAppDispatch();
    const formik=useFormik({
        initialValues:{
            fullname:"",
            email:"",
            otp:""
        }, validate: (values) => {
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
        onSubmit:(values)=>{
            console.log(values);
            dispatch(sendLoginSignupOtp(values))
        }
    })

    const handleSendOtp=()=>{
        console.log(formik.values.email);
        dispatch(clearError());
        dispatch(sendLoginSignupOtp({email:formik.values.email}))
    }

    const getErrorMessage = () => {
        if (!auth.error) return null;
        if (typeof auth.error === 'string') return auth.error;
        if (typeof auth.error === 'object' && (auth.error as any)?.error) return (auth.error as any).error;
        if (typeof auth.error === 'object' && (auth.error as any)?.message) return (auth.error as any).message;
        return "An error occurred";
    };
    // const handleCreateAcoount=()=>{
    //     dispatch(signup({signupRequest:formik.values}))
    // }
    const handleCreateAccount = async () => {
  try {
    dispatch(clearError());
    const result = await dispatch(signup({signupRequest:formik.values})).unwrap();

    // store JWT
    localStorage.setItem("jwt", result.jwt);

    // optional: store role
    localStorage.setItem("role", result.role);

    // navigate to home
    navigate("/");
    
    // Force page reload to trigger fetchUserProfile in App.tsx
    window.location.href = "/";
  } catch (error) {
    console.log("Signup failed:", error);
  }
};
    return(
        <>   
        {/* <Navbar/> */}
        <Box sx={{ padding: 5 }}>
            
            <Typography variant="h5" sx={{ marginBottom: 3, fontWeight: 600, textAlign: "center", color:"teal"}}>
                SignUp
            </Typography>
            
            {/* Error Alert */}
            {auth.error && getErrorMessage() && (
                <Alert severity="error" sx={{ marginBottom: 2 }} onClose={() => dispatch(clearError())}>
                    {getErrorMessage()}
                </Alert>
            )}
            
            <div>
                <Grid container spacing={3}>
                      {auth.otpSent &&  <Grid size={{ xs: 12 }}>
                        <TextField
                            fullWidth
                            label="FullName"
                            name="fullname"
                            placeholder="Enter your fullname"
                            type="text"
                            value={formik.values.fullname}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.fullname && Boolean(formik.errors.fullname)}
                            helperText={formik.touched.fullname && formik.errors.fullname}
                            variant="outlined"
                        />
                    </Grid>}

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
                { auth.otpSent &&   <Grid size={{ xs: 12 }}>
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
                    </Grid>
}
                    {/* Submit Button */}
                    <Grid size={{ xs: 12 }}>
                        {!auth.otpSent && <Button
                            fullWidth
                            variant="contained"
                            type="submit"
                            disabled={auth.loading}
                            sx={{ py: 1.5, fontSize: "1rem", fontWeight: 600 }}
                            onClick={() => handleSendOtp()}
                        >
                            {auth.loading ? "Please wait..." : "Register"}
                        </Button>}
                        {auth.otpSent && <Button
                            fullWidth
                            variant="contained"
                            type="submit"
                            disabled={auth.loading}
                            sx={{ py: 1.5, fontSize: "1rem", fontWeight: 600 }}
                            onClick={() => handleCreateAccount()}
                        >
                            {auth.loading ? "Please wait..." : "Create Account"}
                        </Button>}
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
            </div>
        </Box>
            </>
    )
}
