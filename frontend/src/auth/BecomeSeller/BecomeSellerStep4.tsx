import { Grid, TextField, Box, Typography, FormControl, InputLabel, Select, MenuItem } from "@mui/material"

export const BecomeSellerStep4=({formik}:any)=>{
    return(
        <Box sx={{ padding: 3 }}>
          <Typography variant="h5" sx={{ marginBottom: 3, fontWeight: 600 }}>
            Step 4: Business Details
          </Typography>
          
          <Grid container spacing={3}>
            
            {/* Business Name */}
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Business Name"
                name="businessDetails.businessName"
                placeholder="Enter business name"
                value={formik.values.businessDetails.businessName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.businessDetails?.businessName && Boolean(formik.errors.businessDetails?.businessName)}
                helperText={formik.touched.businessDetails?.businessName && formik.errors.businessDetails?.businessName}
                variant="outlined"
              />
            </Grid>

            {/* Business Type */}
            <Grid size={{ xs: 12, md: 6 }}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Business Type</InputLabel>
                <Select
                  name="businessDetails.businessType"
                  label="Business Type"
                  value={formik.values.businessDetails.businessType}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.businessDetails?.businessType && Boolean(formik.errors.businessDetails?.businessType)}
                >
                  <MenuItem value="">-- Select Business Type --</MenuItem>
                  <MenuItem value="sole_proprietor">Sole Proprietor</MenuItem>
                  <MenuItem value="partnership">Partnership</MenuItem>
                  <MenuItem value="pvt_ltd">Private Limited</MenuItem>
                  <MenuItem value="public_ltd">Public Limited</MenuItem>
                  <MenuItem value="llp">LLP</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Business Phone */}
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Business Phone"
                name="businessDetails.bussinessMobile"
                placeholder="Enter business phone number"
                type="tel"
                value={formik.values.businessDetails.bussinessMobile}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.businessDetails?.bussinessMobile && Boolean(formik.errors.businessDetails?.bussinessMobile)}
                helperText={formik.touched.businessDetails?.bussinessMobile && formik.errors.businessDetails?.bussinessMobile}
                variant="outlined"
              />
            </Grid>

            {/* Business Email */}
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Business Email"
                name="businessDetails.businessEmail"
                placeholder="Enter business email"
                type="email"
                value={formik.values.businessDetails.businessEmail}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.businessDetails?.businessEmail && Boolean(formik.errors.businessDetails?.businessEmail)}
                helperText={formik.touched.businessDetails?.businessEmail && formik.errors.businessDetails?.businessEmail}
                variant="outlined"
              />
            </Grid>

            {/* Business Address */}
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Business Address"
                name="businessDetails.bussinessAddress"
                placeholder="Enter your business address"
                value={formik.values.businessDetails.bussinessAddress}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.businessDetails?.bussinessAddress && Boolean(formik.errors.businessDetails?.bussinessAddress)}
                helperText={formik.touched.businessDetails?.bussinessAddress && formik.errors.businessDetails?.bussinessAddress}
                variant="outlined"
                multiline
                rows={2}
              />
            </Grid>

            {/* Logo */}
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Business Logo URL"
                name="businessDetails.logo"
                placeholder="Enter logo URL"
                type="url"
                value={formik.values.businessDetails.logo}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.businessDetails?.logo && Boolean(formik.errors.businessDetails?.logo)}
                helperText={formik.touched.businessDetails?.logo && formik.errors.businessDetails?.logo}
                variant="outlined"
              />
            </Grid>

            {/* Seller Name */}
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Seller Name"
                name="sellerName"
                placeholder="Enter your seller name"
                value={formik.values.sellerName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.sellerName && Boolean(formik.errors.sellerName)}
                helperText={formik.touched.sellerName && formik.errors.sellerName}
                variant="outlined"
              />
            </Grid>

            {/* Email */}
            <Grid size={{ xs: 12, md: 6 }}>
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

            {/* Password */}
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Password"
                name="Password"
                placeholder="Enter password"
                type="password"
                value={formik.values.Password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.Password && Boolean(formik.errors.Password)}
                helperText={formik.touched.Password && formik.errors.Password}
                variant="outlined"
              />
            </Grid>

            {/* Confirm Password */}
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Confirm Password"
                name="confirmPassword"
                placeholder="Confirm password"
                type="password"
                value={formik.values.confirmPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
                helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
                variant="outlined"
              />
            </Grid>

          </Grid>
        </Box>
    )
}