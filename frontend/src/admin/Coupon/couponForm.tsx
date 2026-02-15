import { Box, Button, Grid, TextField } from "@mui/material";
import { useFormik } from "formik"

interface CouponFormProps {
    initialValues: {
        couponCode: string;
        startDate: Date | null;
        endDate: Date | null;
        minOrderAmount: number;
        discount: number;
    }
}
export const CouponForm = () => {
    const formik = useFormik({
        initialValues: {
            couponCode: "",
            startDate: null,
            endDate: null,
            minOrderAmount: 0,
            discount: 0,
        },
        onSubmit: (values) => {
            console.log(values);
        }
    })
    return (
        <Box sx={{ mt: 3 }} component="form" onSubmit={formik.handleSubmit}>
            <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 5 }}>
                    <TextField
                        fullWidth
                        type="string"
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
                        type="Number"
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
                        type="Number"
                        label="Min Order Amount"
                        name="minOrderAmount"
                        value={formik.values.minOrderAmount}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.minOrderAmount && Boolean(formik.errors.minOrderAmount)}
                        helperText={formik.touched.minOrderAmount && formik.errors.minOrderAmount}
                        />
                </Grid>
                <Grid size={{ xs: 12 }} sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}>
                    <Button type="submit" variant="contained" color="primary">
                        Submit
                    </Button>
                </Grid>
            </Grid>
        </Box>
    )
}