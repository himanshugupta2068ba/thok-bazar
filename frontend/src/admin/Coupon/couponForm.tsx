import { Alert, Box, Button, Grid, TextField } from "@mui/material";
import { useFormik } from "formik";
import { useNavigate } from "react-router";
import * as Yup from "yup";
import { createCoupon } from "../../Redux Toolkit/featurs/admin/couponSlice";
import { useAppDispatch, useAppSelector } from "../../Redux Toolkit/store";

const couponSchema = Yup.object({
  couponCode: Yup.string().trim().required("Coupon code is required"),
  startDate: Yup.string().required("Start date is required"),
  endDate: Yup.string().required("End date is required"),
  minOrderAmount: Yup.number().min(0, "Must be 0 or more").required("Min order amount is required"),
  discount: Yup.number().min(1, "Min 1%").max(100, "Max 100%").required("Discount is required"),
});

export const CouponForm = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error, successMessage } = useAppSelector((state) => state.adminCoupons);
  const adminToken = localStorage.getItem("adminToken") || "";

  const formik = useFormik({
    initialValues: {
      couponCode: "",
      startDate: "",
      endDate: "",
      minOrderAmount: 0,
      discount: 1,
    },
    validationSchema: couponSchema,
    onSubmit: async (values) => {
      const resultAction = await dispatch(
        createCoupon({
          couponData: values,
          jwt: adminToken,
        }),
      );

      if (createCoupon.fulfilled.match(resultAction)) {
        navigate("/admin/coupon");
      }
    },
  });

  return (
    <Box sx={{ mt: 3 }} component="form" onSubmit={formik.handleSubmit}>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 5 }}>
          <TextField
            fullWidth
            label="Coupon Code"
            name="couponCode"
            value={formik.values.couponCode}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.couponCode && Boolean(formik.errors.couponCode)}
            helperText={formik.touched.couponCode && formik.errors.couponCode}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <TextField
            fullWidth
            type="number"
            label="Discount %"
            name="discount"
            value={formik.values.discount}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.discount && Boolean(formik.errors.discount)}
            helperText={formik.touched.discount && formik.errors.discount}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            label="Start Date"
            name="startDate"
            type="date"
            value={formik.values.startDate}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            InputLabelProps={{ shrink: true }}
            error={formik.touched.startDate && Boolean(formik.errors.startDate)}
            helperText={formik.touched.startDate && formik.errors.startDate}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            label="End Date"
            name="endDate"
            type="date"
            value={formik.values.endDate}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            InputLabelProps={{ shrink: true }}
            error={formik.touched.endDate && Boolean(formik.errors.endDate)}
            helperText={formik.touched.endDate && formik.errors.endDate}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 12 }}>
          <TextField
            fullWidth
            type="number"
            label="Min Order Amount"
            name="minOrderAmount"
            value={formik.values.minOrderAmount}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.minOrderAmount && Boolean(formik.errors.minOrderAmount)}
            helperText={formik.touched.minOrderAmount && formik.errors.minOrderAmount}
          />
        </Grid>

        {error && (
          <Grid size={{ xs: 12 }}>
            <Alert severity="error">{error}</Alert>
          </Grid>
        )}

        {successMessage && (
          <Grid size={{ xs: 12 }}>
            <Alert severity="success">{successMessage}</Alert>
          </Grid>
        )}

        <Grid size={{ xs: 12 }} sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}>
          <Button type="submit" variant="contained" color="primary" disabled={loading}>
            {loading ? "Submitting..." : "Submit"}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};
