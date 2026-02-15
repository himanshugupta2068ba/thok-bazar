import { Box, Button, FormControl, FormHelperText, Grid, InputLabel, MenuItem, Paper, Select, TextField, Typography } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";

// Mock categories - replace with API fetch when backend is ready
const DEAL_CATEGORIES = [
  { id: "1", name: "Electronics" },
  { id: "2", name: "Fashion" },
  { id: "3", name: "Home & Living" },
  { id: "4", name: "Beauty" },
  { id: "5", name: "Sports" },
];

const createDealSchema = Yup.object({
  categoryId: Yup.string().required("Category is required"),
  discount: Yup.number()
    .min(1, "Discount must be at least 1%")
    .max(100, "Discount cannot exceed 100%")
    .required("Discount is required"),
});

export const CreateDeal = () => {
  const formik = useFormik({
    initialValues: {
      categoryId: "",
      discount: "",
    },
    validationSchema: createDealSchema,
    onSubmit: (values) => {
      console.log("Create deal:", {
        categoryId: values.categoryId,
        discount: Number(values.discount),
      });
    },
  });

  return (
    <Box sx={{ mt: 3, maxWidth: 640, mx: "auto", px: 2 }}>
      <Paper elevation={2} sx={{ p: 3 }}>
        <Typography component="h1" variant="h5" align="center" sx={{ mb: 3, fontWeight: 600 }}>
          Create Deal
        </Typography>
        <Box component="form" onSubmit={formik.handleSubmit}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <FormControl fullWidth error={formik.touched.categoryId && Boolean(formik.errors.categoryId)}>
                <InputLabel id="deal-category-label">Category</InputLabel>
                <Select
                  labelId="deal-category-label"
                  id="categoryId"
                  name="categoryId"
                  value={formik.values.categoryId}
                  label="Category"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                >
                  <MenuItem value="">
                    <em>Select category</em>
                  </MenuItem>
                  {DEAL_CATEGORIES.map((cat) => (
                    <MenuItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText error={formik.touched.categoryId && Boolean(formik.errors.categoryId)}>
                  {formik.touched.categoryId && formik.errors.categoryId}
                </FormHelperText>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                type="number"
                label="Discount (%)"
                name="discount"
                value={formik.values.discount}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.discount && Boolean(formik.errors.discount)}
                helperText={formik.touched.discount && formik.errors.discount}
                inputProps={{ min: 1, max: 100 }}
              />
            </Grid>
            <Grid size={{ xs: 12 }} sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
              <Button type="submit" variant="contained" color="primary" size="large">
                Create Deal
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Box>
  );
};
