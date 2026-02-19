import { TextField, Box, Typography, Button, Grid } from "@mui/material";
import { useFormik } from "formik"
import { useAppSelector } from "../../Redux Toolkit/store";

export const LoginForm=()=>{

    const {auth}=useAppSelector((state)=>state);
        
    const formik=useFormik({
        initialValues:{
            email:"",
            otp:""
        },
        onSubmit:(values)=>{
            console.log(values);
        }
    })
    return(
        <Box sx={{ padding: 5 }}>
            <Typography variant="h5" sx={{ marginBottom: 3, fontWeight: 600, textAlign: "center", color:"teal"}}>
                 Login
            </Typography>
            
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
                        >
                            Login
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </Box>
    )
}
