import { Box, Button, Grid, TextField } from "@mui/material";
import { useFormik } from "formik";

export const AddressForm = () => {
  const formik = useFormik({
    initialValues: {
      name: "",
      street: "",
      city: "",
      state: "",
      country: "",
      pinCode: "",
      mobile: "",
      locality: "",
    },
    onSubmit: (values) => {
      console.log(values);
    },
  });

  return (
    <Box sx={{ maxwidth: 600, m: "auto" }}>
      <p className="text-xl font-bold text-center pb-5">Contact Details</p>
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              name="name"
              label="Full Name"
              variant="outlined"
              value={formik.values.name}
              onChange={formik.handleChange}
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              name="mobile"
              label="Mobile Number"
              variant="outlined"
              value={formik.values.mobile}
              onChange={formik.handleChange}
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              name="locality"
              label="Locality"
              variant="outlined"
              value={formik.values.locality}
              onChange={formik.handleChange}
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              name="street"
              label="Street Address"
              variant="outlined"
              value={formik.values.street}
              onChange={formik.handleChange}
            />
          </Grid>
          <Grid size={{ xs: 6 }}>
            <TextField
              fullWidth
              name="city"
              label="City"
              variant="outlined"
              value={formik.values.city}
              onChange={formik.handleChange}
            />
          </Grid>
          <Grid size={{ xs: 6 }}>
            <TextField
              fullWidth
              name="state"
              label="State"
              variant="outlined"
              value={formik.values.state}
              onChange={formik.handleChange}
            />
          </Grid>
          <Grid size={{ xs: 6 }}>
            <TextField
              fullWidth
              name="country"
              label="Country"
              variant="outlined"
              value={formik.values.country}
              onChange={formik.handleChange}
            />
          </Grid>
          <Grid size={{ xs: 6 }}>
            <TextField
              fullWidth
              name="pinCode"
              label="Pin Code"
              variant="outlined"
              value={formik.values.pinCode}
              onChange={formik.handleChange}
            />
          </Grid>
          <Grid size={{ xs: 12 }} className="text-center pt-5">
            <Button sx={{ py: "14px" }} type="submit" variant="contained">
              Save Address
            </Button>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};
