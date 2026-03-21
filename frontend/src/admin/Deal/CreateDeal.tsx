import {
  Alert,
  Box,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useAppDispatch, useAppSelector } from "../../Redux Toolkit/store";
import { fetchHomeCategories } from "../../Redux Toolkit/featurs/admin/adminSlice";
import { createDeal } from "../../Redux Toolkit/featurs/admin/DealSlice";
import mainCategory from "../../data/category/mainCategory";
import { electronicsLevelTwo } from "../../data/category/level2/eletronicslevel2";
import { homelivingLevelTwo } from "../../data/category/level2/homelivinglevel2";
import { menLevelTwo } from "../../data/category/level2/menlevelTwo";
import { womenLevelTwo } from "../../data/category/level2/womenlevel2";
import { electronicthirdlevel } from "../../data/category/level3/electronicslevel3";
import { homethirdlevel } from "../../data/category/level3/homelivinglevel3";
import { menthirdlevel } from "../../data/category/level3/menthirdlevel";
import { womenthirdlevel } from "../../data/category/level3/womenthirdlevel";

const createDealSchema = Yup.object({
  mainCategoryId: Yup.string().required("Category is required"),
  subCategoryId: Yup.string(),
  category3Id: Yup.string(),
  discount: Yup.number()
    .min(1, "Discount must be at least 1%")
    .max(100, "Discount cannot exceed 100%")
    .required("Discount is required"),
  isActive: Yup.string().required("Status is required"),
  productIds: Yup.string(),
});

export const CreateDeal = () => {
  const dispatch = useAppDispatch();
  const adminToken = localStorage.getItem("adminToken") || "";
  const { homeCategories } = useAppSelector((state) => state.adminSlice);
  const { loading, error, successMessage } = useAppSelector((state) => state.deals);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const levelTwoOptions = useMemo(
    () => [...menLevelTwo, ...womenLevelTwo, ...homelivingLevelTwo, ...electronicsLevelTwo],
    [],
  );

  const levelThreeOptions = useMemo(
    () => [...menthirdlevel, ...womenthirdlevel, ...homethirdlevel, ...electronicthirdlevel],
    [],
  );

  const topDealCategories = useMemo(
    () => (homeCategories || []).filter((category: any) => category?.section === "TOP_DEALS"),
    [homeCategories],
  );

  useEffect(() => {
    dispatch(fetchHomeCategories(adminToken));
  }, [dispatch, adminToken]);

  const formik = useFormik({
    initialValues: {
      mainCategoryId: "",
      subCategoryId: "",
      category3Id: "",
      discount: "",
      isActive: "true",
      productIds: "",
    },
    validationSchema: createDealSchema,
    onSubmit: async (values, { resetForm }) => {
      setSubmitError(null);
      const selectedCategoryId = values.category3Id || values.subCategoryId || values.mainCategoryId;

      const mappedTopDealCategory = topDealCategories.find(
        (category: any) => category?.categoryId === selectedCategoryId,
      );

      if (!mappedTopDealCategory?._id) {
        setSubmitError(
          "Top deal category image/details missing for selected category. Please add it in Deal > Categories tab first.",
        );
        return;
      }

      const resultAction = await dispatch(
        createDeal({
          deal: {
            categoryId: mappedTopDealCategory._id,
            discount: Number(values.discount),
            isActive: values.isActive === "true",
            productIds: values.productIds
              .split(",")
              .map((id) => id.trim())
              .filter(Boolean),
          },
          jwt: adminToken,
        }),
      );

      if (createDeal.fulfilled.match(resultAction)) {
        resetForm();
        setSubmitError(null);
      }
    },
  });

  const subCategoryOptions = useMemo(
    () =>
      levelTwoOptions.filter(
        (item: any) => item.parentCategoryId === formik.values.mainCategoryId,
      ),
    [levelTwoOptions, formik.values.mainCategoryId],
  );

  const category3Options = useMemo(
    () =>
      levelThreeOptions.filter(
        (item: any) => item.parentCategoryId === formik.values.subCategoryId,
      ),
    [levelThreeOptions, formik.values.subCategoryId],
  );

  return (
    <Box sx={{ mt: 3, maxWidth: 640, mx: "auto", px: 2 }}>
      <Paper elevation={2} sx={{ p: 3 }}>
        <Typography component="h1" variant="h5" align="center" sx={{ mb: 3, fontWeight: 600 }}>
          Create Deal
        </Typography>

        <Box component="form" onSubmit={formik.handleSubmit}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <FormControl fullWidth error={formik.touched.mainCategoryId && Boolean(formik.errors.mainCategoryId)}>
                <InputLabel id="deal-main-category-label">Category</InputLabel>
                <Select
                  labelId="deal-main-category-label"
                  id="mainCategoryId"
                  name="mainCategoryId"
                  value={formik.values.mainCategoryId}
                  label="Category"
                  onChange={(event) => {
                    formik.setFieldValue("mainCategoryId", event.target.value);
                    formik.setFieldValue("subCategoryId", "");
                    formik.setFieldValue("category3Id", "");
                  }}
                  onBlur={formik.handleBlur}
                >
                  <MenuItem value="">
                    <em>Select category</em>
                  </MenuItem>
                  {mainCategory.map((cat: any) => (
                    <MenuItem key={cat?.categoryid} value={cat?.categoryid}>
                      {cat?.name || "Category"}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>
                  {formik.touched.mainCategoryId && formik.errors.mainCategoryId}
                </FormHelperText>
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <FormControl fullWidth>
                <InputLabel id="deal-sub-category-label">Sub Category (Optional)</InputLabel>
                <Select
                  labelId="deal-sub-category-label"
                  id="subCategoryId"
                  name="subCategoryId"
                  value={formik.values.subCategoryId}
                  label="Sub Category (Optional)"
                  onChange={(event) => {
                    formik.setFieldValue("subCategoryId", event.target.value);
                    formik.setFieldValue("category3Id", "");
                  }}
                  disabled={!formik.values.mainCategoryId}
                >
                  <MenuItem value="">
                    <em>No sub category</em>
                  </MenuItem>
                  {subCategoryOptions.map((cat: any) => (
                    <MenuItem key={cat?.categoryId} value={cat?.categoryId}>
                      {cat?.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <FormControl fullWidth>
                <InputLabel id="deal-category3-label">Category 3 (Optional)</InputLabel>
                <Select
                  labelId="deal-category3-label"
                  id="category3Id"
                  name="category3Id"
                  value={formik.values.category3Id}
                  label="Category 3 (Optional)"
                  onChange={formik.handleChange}
                  disabled={!formik.values.subCategoryId}
                >
                  <MenuItem value="">
                    <em>No category 3</em>
                  </MenuItem>
                  {category3Options.map((cat: any) => (
                    <MenuItem key={cat?.categoryId} value={cat?.categoryId}>
                      {cat?.name}
                    </MenuItem>
                  ))}
                </Select>
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

            <Grid size={{ xs: 12, md: 6 }}>
              <FormControl fullWidth error={formik.touched.isActive && Boolean(formik.errors.isActive)}>
                <InputLabel id="deal-status-label">Status</InputLabel>
                <Select
                  labelId="deal-status-label"
                  id="isActive"
                  name="isActive"
                  value={formik.values.isActive}
                  label="Status"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                >
                  <MenuItem value="true">Active</MenuItem>
                  <MenuItem value="false">Inactive</MenuItem>
                </Select>
                <FormHelperText>{formik.touched.isActive && formik.errors.isActive}</FormHelperText>
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Specific Product IDs (optional, comma separated)"
                name="productIds"
                value={formik.values.productIds}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                helperText="If provided, deal applies to these items; otherwise it applies by category."
              />
            </Grid>

            {error && (
              <Grid size={{ xs: 12 }}>
                <Alert severity="error">{error}</Alert>
              </Grid>
            )}

            {submitError && (
              <Grid size={{ xs: 12 }}>
                <Alert severity="warning">{submitError}</Alert>
              </Grid>
            )}

            {successMessage && (
              <Grid size={{ xs: 12 }}>
                <Alert severity="success">{successMessage}</Alert>
              </Grid>
            )}

            <Grid size={{ xs: 12 }} sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
              <Button type="submit" variant="contained" color="primary" size="large" disabled={loading}>
                {loading ? "Creating..." : "Create Deal"}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Box>
  );
};
