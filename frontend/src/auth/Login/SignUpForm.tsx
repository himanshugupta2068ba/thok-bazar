import { TextField, Box, Typography, Button, Grid } from "@mui/material";
import { useFormik } from "formik"
import { useAppDispatch, useAppSelector } from "../../Redux Toolkit/store";
import { useNavigate } from "react-router";
import { signup } from "../../Redux Toolkit/featurs/Auth/authSlice";


export const SignUp=()=>{
 
    const auth=useAppSelector((state)=>state.auth);
    const dispatch=useAppDispatch();
    const navigate=useNavigate();
    const formik=useFormik({
        initialValues:{
            fullname:"",
            email:"",
            otp:""
        },
        onSubmit:(values)=>{
            console.log(values);
            dispatch(signup({...values, navigate}))
        }
    })

    const handleSendOtp=()=>{
        dispatch(signup({email:formik.values.email, navigate}))
    }
    return(
        <>   
        {/* <Navbar/> */}
        <Box sx={{ padding: 5 }}>
            
            <Typography variant="h5" sx={{ marginBottom: 3, fontWeight: 600, textAlign: "center", color:"teal"}}>
                SignUp
            </Typography>
            
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
                        <Button
                            fullWidth
                            variant="contained"
                            type="submit"
                            sx={{ py: 1.5, fontSize: "1rem", fontWeight: 600 }}
                            onClick={() => auth.otpSent ? formik.handleSubmit() : handleSendOtp()}
                        >
                            Register
                        </Button>
                    </Grid>
                </Grid>
            </div>
        </Box>
            </>
    )
}
