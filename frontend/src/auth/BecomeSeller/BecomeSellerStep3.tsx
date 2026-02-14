import { Grid, TextField, Box, Typography } from "@mui/material"

export const BecomeSellerStep3=({formik}:any)=>{
    return(
        <Box sx={{ padding: 3 }}>
          <Typography variant="h5" sx={{ marginBottom: 3, fontWeight: 600 }}>
            Step 3: Bank Details
          </Typography>
          
          <Grid container spacing={3}>
            
            {/* Account Number */}
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Account Number"
                name="bankDetails.accountNumber"
                placeholder="Enter account number"
                type="password"
                value={formik.values.bankDetails.accountNumber}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.bankDetails?.accountNumber && Boolean(formik.errors.bankDetails?.accountNumber)}
                helperText={formik.touched.bankDetails?.accountNumber && formik.errors.bankDetails?.accountNumber}
                variant="outlined"
              />
            </Grid>

            {/* Bank Name */}
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Bank Name"
                name="bankDetails.bankName"
                placeholder="Enter bank name"
                value={formik.values.bankDetails.bankName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.bankDetails?.bankName && Boolean(formik.errors.bankDetails?.bankName)}
                helperText={formik.touched.bankDetails?.bankName && formik.errors.bankDetails?.bankName}
                variant="outlined"
              />
            </Grid>

            {/* IFSC Code */}
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="IFSC Code"
                name="bankDetails.IFSC"
                placeholder="Enter IFSC Code"
                value={formik.values.bankDetails.IFSC}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.bankDetails?.IFSC && Boolean(formik.errors.bankDetails?.IFSC)}
                helperText={formik.touched.bankDetails?.IFSC && formik.errors.bankDetails?.IFSC}
                variant="outlined"
              />
            </Grid>

          </Grid>
        </Box>
    )
}