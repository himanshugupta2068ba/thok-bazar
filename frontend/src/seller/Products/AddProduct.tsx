import { useFormik } from "formik";
import {
  Button,
  CircularProgress,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { AddPhotoAlternate, Close } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

import mainCategory from "../../data/category/mainCategory";
import { uploadToCloudiniary } from "../../util/uploadToCloudNarry";
import {
  clearSellerProductError,
  clearSellerProductMessage,
  createSellerProduct,
} from "../../Redux Toolkit/featurs/seller/sellerProductSlice";
import { useAppDispatch, useAppSelector } from "../../Redux Toolkit/store";
import {
  getLevelThreeOptions,
  getLevelTwoOptions,
  getProductSpecificationFields,
} from "../../data/product/productConfig";
import { ProductSpecificationFields } from "./ProductSpecificationFields";

export const AddProduct = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [uploadedImages, setUploadedImages] = useState(false);
  const { loading, error, successMessage } = useAppSelector(
    (state) => state.sellerProducts,
  );

  const jwtToken =
    useAppSelector((state) => state.seller?.jwt) ||
    localStorage.getItem("sellerJwt");

  useEffect(() => {
    return () => {
      dispatch(clearSellerProductError());
      dispatch(clearSellerProductMessage());
    };
  }, [dispatch]);

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      mrpPrice: "",
      sellingPrice: "",
      stock: "",
      category: "",
      category2: "",
      category3: "",
      images: [],
      specifications: {} as Record<string, string>,
    },
    onSubmit: (values) => {
      if (!jwtToken) {
        console.error("Seller not authenticated. Please login again.");
        return;
      }

      dispatch(createSellerProduct({ productData: values, jwt: jwtToken }))
        .unwrap()
        .then(() => {
          formik.resetForm();
          navigate("/seller/products");
        })
        .catch((submitError: unknown) => {
          console.error("Create product failed:", submitError);
        });
    },
  });

  useEffect(() => {
    formik.setFieldValue("category2", "");
    formik.setFieldValue("category3", "");
    formik.setFieldValue("specifications", {});
  }, [formik.values.category]);

  useEffect(() => {
    formik.setFieldValue("category3", "");
  }, [formik.values.category2]);

  const handleImageChange = async (event: any) => {
    const selectedFiles = Array.from(event.target.files || []) as File[];
    if (!selectedFiles.length) return;

    setUploadedImages(true);

    try {
      const uploadedUrls = await Promise.all(
        selectedFiles.map((file) => uploadToCloudiniary(file)),
      );

      formik.setFieldValue("images", [...formik.values.images, ...uploadedUrls]);
    } catch (error) {
      console.error("Image upload failed:", error);
    } finally {
      setUploadedImages(false);
      event.target.value = "";
    }

    console.log("Selected files:", event.target.files);
  };

  const handleRemoveImage = (index: number) => {
    const updatedImages = formik.values.images.filter((_, i) => i !== index);
    formik.setFieldValue("images", updatedImages);
  };

  const specificationFields = getProductSpecificationFields(formik.values.category);
  const levelTwoOptions = getLevelTwoOptions(formik.values.category);
  const levelThreeOptions = getLevelThreeOptions(
    formik.values.category,
    formik.values.category2,
  );

  const handleSpecificationChange = (key: string, value: string) => {
    formik.setFieldValue("specifications", {
      ...formik.values.specifications,
      [key]: value,
    });
  };

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold text-center">Add Product</h1>
      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      {successMessage && <p className="mt-3 text-sm text-green-600">{successMessage}</p>}

      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={3} className="mt-5">
          {/* Images */}
         <Grid size={{ xs: 12, md: 12 }} className="flex flex-wrap gap-4">
  <input
    type="file"
    multiple
    accept="image/*"
    id="fileInput"
    name="images"
    style={{ display: "none" }}
    onChange={handleImageChange}
  />

  <label htmlFor="fileInput" className="relative">
    <span className="w-24 h-24 cursor-pointer flex items-center justify-center border-2 border-gray-300 rounded-md p-2">
      <AddPhotoAlternate className="text-gray-700" />
    </span>

    {uploadedImages && (
      <div className="absolute inset-0 w-24 h-24 flex items-center justify-center">
        <CircularProgress size={24} />
      </div>
    )}
  </label>

  <div className="flex mt-2 space-x-2">
    {formik.values.images.map((item, index) => (
      <div key={index} className="relative">
        <img
          src={item}
          alt={`Preview ${index}`}
          className="w-24 h-24 object-cover rounded-md"
        />
        <IconButton
          onClick={() => handleRemoveImage(index)}
          size="small"
          color="error"
          sx={{
            position: "absolute",
            top: 0,
            right: 0,
            outline: "none",
          }}
        >
          <Close sx={{ fontSize: "1rem" }} />
        </IconButton>
      </div>
    ))}
  </div>
</Grid>

          {/* Text Inputs */}
          {[
            ["title", "Product Title"],
          ].map(([name, placeholder]) => (
            <Grid key={name} size={{ xs: 12, md: 6 }}>
              <input
                name={name}
                placeholder={placeholder}
                value={(formik.values as any)[name]}
                onChange={formik.handleChange}
                className="w-full border-2 border-gray-300 rounded-md p-2"
              />
            </Grid>
          ))}

          <Grid size={{ xs: 12, md: 6 }}>
            <textarea
              name="description"
              placeholder="Product Description"
              value={formik.values.description}
              onChange={formik.handleChange}
              className="min-h-28 w-full rounded-md border-2 border-gray-300 p-2"
            />
          </Grid>

          {[
            ["mrpPrice", "MRP Price"],
            ["sellingPrice", "Selling Price"],
            ["stock", "Stock Quantity"],
          ].map(([name, placeholder]) => (
            <Grid key={name} size={{ xs: 12, md: 4 }}>
              <input
                type="number"
                name={name}
                placeholder={placeholder}
                value={(formik.values as any)[name]}
                onChange={formik.handleChange}
                className="w-full border-2 border-gray-300 rounded-md p-2"
              />
            </Grid>
          ))}

          {/* Category */}
          <Grid size={{ xs: 12, md: 4 }}>
            <FormControl fullWidth>
              <InputLabel id="category-label">Category</InputLabel>
              <Select
                labelId="category-label"
                name="category"
                value={formik.values.category}
                label="Category"
                onChange={formik.handleChange}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {mainCategory.map((c, i) => (
                  <MenuItem key={i} value={c.categoryid}>
                    {c.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Category 2 */}
          <Grid size={{ xs: 12, md: 4 }}>
            <FormControl fullWidth>
              <InputLabel id="category2-label">Category 2</InputLabel>
              <Select
                labelId="category2-label"
                name="category2"
                value={formik.values.category2}
                label="Category 2"
                onChange={formik.handleChange}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {levelTwoOptions.map((item, i) => (
                  <MenuItem key={i} value={item.categoryId}>
                    {item.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Category 3 */}
          <Grid size={{ xs: 12, md: 4 }}>
            <FormControl fullWidth>
              <InputLabel id="category3-label">Category 3</InputLabel>
              <Select
                labelId="category3-label"
                name="category3"
                value={formik.values.category3}
                label="Category 3"
                onChange={formik.handleChange}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {levelThreeOptions.map((item, i) => (
                  <MenuItem key={i} value={item.categoryId}>
                    {item.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {formik.values.category ? (
            <>
              <Grid size={{ xs: 12 }}>
                <div className="rounded-2xl border border-teal-100 bg-teal-50 px-4 py-3 text-sm text-teal-900">
                  Category-specific details are now tailored for the selected main
                  category, so electronics, fashion, and home products each get
                  relevant fields.
                </div>
              </Grid>

              <ProductSpecificationFields
                fields={specificationFields}
                values={formik.values.specifications}
                onChange={handleSpecificationChange}
              />
            </>
          ) : null}

          <Grid size={{ xs: 12 }}>
            <Button
              type="submit"
              variant="contained"
              disabled={
                loading ||
                uploadedImages ||
                !formik.values.category ||
                !formik.values.category2 ||
                !formik.values.category3
              }
            >
              Add Product
            </Button>
          </Grid>
        </Grid>
      </form>
    </div>
  );
};
