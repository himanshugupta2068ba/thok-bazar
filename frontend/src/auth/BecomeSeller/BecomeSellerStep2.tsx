import { Grid, TextField, Box, Typography } from "@mui/material"

export const BecomeSellerStep2=({formik}:any)=>{
    return(
        <Box sx={{ padding: 3 }}>
          <Typography variant="h5" sx={{ marginBottom: 3, fontWeight: 600 }}>
            Step 2: Pickup Address
          </Typography>
          
          <Grid container spacing={3}>
            
            {/* Full Name */}
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Full Name"
                name="pickupAddress.name"
                placeholder="Enter your full name"
                value={formik.values.pickupAddress.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.pickupAddress?.name && Boolean(formik.errors.pickupAddress?.name)}
                helperText={formik.touched.pickupAddress?.name && formik.errors.pickupAddress?.name}
                variant="outlined"
              />
            </Grid>

            {/* Mobile Number */}
            <Grid size={{ xs: 12, md: 6 }} >
              <TextField
                fullWidth
                label="Mobile Number"
                name="pickupAddress.mobile"
                placeholder="Enter your mobile number"
                type="tel"
                value={formik.values.pickupAddress.mobile}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.pickupAddress?.mobile && Boolean(formik.errors.pickupAddress?.mobile)}
                helperText={formik.touched.pickupAddress?.mobile && formik.errors.pickupAddress?.mobile}
                variant="outlined"
              />
            </Grid>

            {/* Pincode */}
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                label="Pincode"
                name="pickupAddress.pincode"
                placeholder="Enter your pincode"
                value={formik.values.pickupAddress.pincode}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.pickupAddress?.pincode && Boolean(formik.errors.pickupAddress?.pincode)}
                helperText={formik.touched.pickupAddress?.pincode && formik.errors.pickupAddress?.pincode}
                variant="outlined"
              />
            </Grid>

            {/* Address */}
            <Grid size={{ xs: 12, md: 12 }}>
              <TextField
                fullWidth
                label="Street Address"
                name="pickupAddress.address"
                placeholder="Enter your street address"
                value={formik.values.pickupAddress.address}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.pickupAddress?.address && Boolean(formik.errors.pickupAddress?.address)}
                helperText={formik.touched.pickupAddress?.address && formik.errors.pickupAddress?.address}
                variant="outlined"
                multiline
                rows={2}
              />
            </Grid>

            {/* Locality */}
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Locality"
                name="pickupAddress.locality"
                placeholder="Enter locality"
                value={formik.values.pickupAddress.locality}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.pickupAddress?.locality && Boolean(formik.errors.pickupAddress?.locality)}
                helperText={formik.touched.pickupAddress?.locality && formik.errors.pickupAddress?.locality}
                variant="outlined"
              />
            </Grid>

            {/* City */}
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                label="City"
                name="pickupAddress.city"
                placeholder="Enter city"
                value={formik.values.pickupAddress.city}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.pickupAddress?.city && Boolean(formik.errors.pickupAddress?.city)}
                helperText={formik.touched.pickupAddress?.city && formik.errors.pickupAddress?.city}
                variant="outlined"
              />
            </Grid>

            {/* State */}
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                label="State"
                name="pickupAddress.state"
                placeholder="Enter state"
                value={formik.values.pickupAddress.state}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.pickupAddress?.state && Boolean(formik.errors.pickupAddress?.state)}
                helperText={formik.touched.pickupAddress?.state && formik.errors.pickupAddress?.state}
                variant="outlined"
              />
            </Grid>

          </Grid>
        </Box>
    )
}