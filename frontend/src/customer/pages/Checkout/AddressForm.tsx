import { Box, Button, Grid, TextField } from "@mui/material";
import { useFormik } from "formik";

type AddressValues = { name: string; address: string; city: string; state: string; pincode: string; mobile: string; locality: string };
type AddressFormProps = { onSave?: (values: AddressValues) => void | Promise<void>; onCancel?: () => void; initialValues?: Partial<AddressValues>; submitting?: boolean };

export const AddressForm = ({ onSave, onCancel, initialValues, submitting = false }: AddressFormProps) => {
  const formik = useFormik({
    initialValues: {
      name: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
      mobile: "",
      locality: "",
      ...initialValues,
    },
    enableReinitialize: true,
    onSubmit: async (values) => {
      const payload = {
        name: values.name?.trim(),
        mobile: values.mobile?.trim(),
        locality: values.locality?.trim(),
        address: values.address?.trim(),
        city: values.city?.trim(),
        state: values.state?.trim(),
        pincode: values.pincode?.trim(),
      };

      if (onSave) {
        await onSave(payload);
      }

      formik.resetForm();
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
              required
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
              required inputProps={{ inputMode: "numeric", pattern: "[0-9]{10}" }}
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
              required
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              name="address"
              label="Street Address"
              variant="outlined"
              value={formik.values.address}
              onChange={formik.handleChange}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              name="city"
              label="City"
              variant="outlined"
              value={formik.values.city}
              onChange={formik.handleChange}
              required
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              name="state"
              label="State"
              variant="outlined"
              value={formik.values.state}
              onChange={formik.handleChange}
              required
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              name="pincode"
              label="Pin Code"
              variant="outlined"
              value={formik.values.pincode}
              onChange={formik.handleChange}
              required inputProps={{ inputMode: "numeric", pattern: "[0-9]{6}" }}
            />
          </Grid>
          <Grid size={{ xs: 12 }} className="text-center pt-5 flex justify-center gap-3">
            <Button sx={{ py: "14px" }} type="submit" variant="contained" disabled={submitting}>
              Save Address
            </Button>
            <Button sx={{ py: "14px" }} variant="outlined" onClick={onCancel}>
              Cancel
            </Button>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};
