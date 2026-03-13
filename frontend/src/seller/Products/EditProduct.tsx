import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useFormik } from "formik";
import {
  Button,
  CircularProgress,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import {
  fetchSellerProducts,
  updateSellerProduct,
} from "../../Redux Toolkit/featurs/seller/sellerProductSlice";
import { useAppDispatch, useAppSelector } from "../../Redux Toolkit/store";
import { uploadToCloudiniary } from "../../util/uploadToCloudNarry";
import mainCategory from "../../data/category/mainCategory";
import {
  getLevelThreeOptions,
  getLevelTwoOptions,
  getProductSpecificationFields,
  getSpecificationValue,
  resolveCategoryPath,
} from "../../data/product/productConfig";
import { ProductSpecificationFields } from "./ProductSpecificationFields";

export const EditProduct = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { productId } = useParams();
  const jwtToken = localStorage.getItem("sellerJwt");
  const { products, loading, error } = useAppSelector((state) => state.sellerProducts);
  const [uploadingImages, setUploadingImages] = useState(false);

  useEffect(() => {
    if (!jwtToken) return;
    if (!products.length) {
      dispatch(fetchSellerProducts({ jwt: jwtToken, pageNumber: 0 }));
    }
  }, [dispatch, jwtToken, products.length]);

  const product = useMemo(
    () => products.find((p: any) => String(p._id || p.id) === String(productId)),
    [products, productId],
  );

  const resolvedCategoryPath = useMemo(() => {
    return resolveCategoryPath(
      product?.subSubCategory || product?.category?.categoryId || product?.subCategory,
      product?.mainCategory,
    );
  }, [product]);

  const initialMainCategory = product?.mainCategory || resolvedCategoryPath.mainCategory;
  const initialSpecificationFields = getProductSpecificationFields(initialMainCategory);
  const initialSpecifications = useMemo(() => {
    const specifications = { ...(product?.specifications || {}) } as Record<string, string>;

    initialSpecificationFields.forEach((field) => {
      const value = getSpecificationValue(product, field.key);
      if (value) {
        specifications[field.key] = String(value);
      }
    });

    return specifications;
  }, [initialSpecificationFields, product]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      title: product?.title || "",
      description: product?.description || "",
      mrpPrice: product?.mrpPrice || "",
      sellingPrice: product?.sellingPrice || "",
      stock: product?.stock ?? 0,
      category: initialMainCategory || "",
      category2: product?.subCategory || resolvedCategoryPath.subCategory || "",
      category3: product?.subSubCategory || resolvedCategoryPath.subSubCategory || "",
      images: product?.images || [],
      specifications: initialSpecifications,
    },
    onSubmit: (values) => {
      if (!jwtToken || !productId) {
        console.error("Seller not authenticated or invalid product");
        return;
      }

      dispatch(
        updateSellerProduct({
          productId,
          updates: {
            title: values.title,
            description: values.description,
            mrpPrice: Number(values.mrpPrice),
            sellingPrice: Number(values.sellingPrice),
            stock: Number(values.stock),
            categoryId: values.category,
            subCategoryId: values.category2,
            subSubCategoryId: values.category3,
            specifications: values.specifications,
            images: values.images,
          },
          jwt: jwtToken,
        }),
      )
        .unwrap()
        .then(() => navigate("/seller/products"))
        .catch((submitError: unknown) => {
          console.error("Update product failed:", submitError);
        });
    },
  });

  const handleImageChange = async (event: any) => {
    const selectedFiles = Array.from(event.target.files || []) as File[];
    if (!selectedFiles.length) return;

    setUploadingImages(true);

    try {
      const uploadedUrls = await Promise.all(
        selectedFiles.map((file) => uploadToCloudiniary(file)),
      );

      formik.setFieldValue("images", [...formik.values.images, ...uploadedUrls]);
    } catch (uploadError) {
      console.error("Image upload failed:", uploadError);
    } finally {
      setUploadingImages(false);
      event.target.value = "";
    }
  };

  const handleRemoveImage = (index: number) => {
    const updatedImages = formik.values.images.filter((_: string, i: number) => i !== index);
    formik.setFieldValue("images", updatedImages);
  };

  const handleMainCategoryChange = (value: string) => {
    formik.setFieldValue("category", value);
    formik.setFieldValue("category2", "");
    formik.setFieldValue("category3", "");
    formik.setFieldValue("specifications", {});
  };

  const handleSubCategoryChange = (value: string) => {
    formik.setFieldValue("category2", value);
    formik.setFieldValue("category3", "");
  };

  const handleSpecificationChange = (key: string, value: string) => {
    formik.setFieldValue("specifications", {
      ...formik.values.specifications,
      [key]: value,
    });
  };

  const levelTwoOptions = getLevelTwoOptions(formik.values.category);
  const levelThreeOptions = getLevelThreeOptions(
    formik.values.category,
    formik.values.category2,
  );
  const specificationFields = getProductSpecificationFields(formik.values.category);

  if (!product && loading) {
    return <p className="text-sm text-gray-600">Loading product...</p>;
  }

  if (!product && !loading) {
    return (
      <div>
        <p className="text-sm text-red-600">Product not found.</p>
        <Button variant="outlined" onClick={() => navigate("/seller/products")}>
          Back to products
        </Button>
      </div>
    );
  }

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold text-center">Edit Product</h1>
      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={3} className="mt-5">
          <Grid size={{ xs: 12, md: 6 }}>
            <input
              name="title"
              placeholder="Product Title"
              value={formik.values.title}
              onChange={formik.handleChange}
              className="w-full border-2 border-gray-300 rounded-md p-2"
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <textarea
              name="description"
              placeholder="Product Description"
              value={formik.values.description}
              onChange={formik.handleChange}
              className="min-h-28 w-full rounded-md border-2 border-gray-300 p-2"
            />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <input
              type="number"
              name="mrpPrice"
              placeholder="MRP Price"
              value={formik.values.mrpPrice}
              onChange={formik.handleChange}
              className="w-full border-2 border-gray-300 rounded-md p-2"
            />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <input
              type="number"
              name="sellingPrice"
              placeholder="Selling Price"
              value={formik.values.sellingPrice}
              onChange={formik.handleChange}
              className="w-full border-2 border-gray-300 rounded-md p-2"
            />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <input
              type="number"
              name="stock"
              placeholder="Stock Quantity"
              value={formik.values.stock}
              onChange={formik.handleChange}
              className="w-full border-2 border-gray-300 rounded-md p-2"
            />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <FormControl fullWidth>
              <InputLabel id="edit-category-label">Category</InputLabel>
              <Select
                labelId="edit-category-label"
                value={formik.values.category}
                label="Category"
                onChange={(event) => handleMainCategoryChange(String(event.target.value))}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {mainCategory.map((item) => (
                  <MenuItem key={item.categoryid} value={item.categoryid}>
                    {item.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <FormControl fullWidth>
              <InputLabel id="edit-category2-label">Category 2</InputLabel>
              <Select
                labelId="edit-category2-label"
                value={formik.values.category2}
                label="Category 2"
                onChange={(event) => handleSubCategoryChange(String(event.target.value))}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {levelTwoOptions.map((item, index) => (
                  <MenuItem key={`${item.categoryId}-${index}`} value={item.categoryId}>
                    {item.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <FormControl fullWidth>
              <InputLabel id="edit-category3-label">Category 3</InputLabel>
              <Select
                labelId="edit-category3-label"
                value={formik.values.category3}
                label="Category 3"
                onChange={(event) =>
                  formik.setFieldValue("category3", String(event.target.value))
                }
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {levelThreeOptions.map((item, index) => (
                  <MenuItem key={`${item.categoryId}-${index}`} value={item.categoryId}>
                    {item.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <div className="rounded-2xl border border-teal-100 bg-teal-50 px-4 py-3 text-sm text-teal-900">
              Product specifications adapt to the current main category, so you
              can keep apparel, electronics, and home products cleanly structured.
            </div>
          </Grid>

          <ProductSpecificationFields
            fields={specificationFields}
            values={formik.values.specifications}
            onChange={handleSpecificationChange}
          />

          <Grid size={{ xs: 12 }}>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              className="mb-3"
            />

            {uploadingImages && <CircularProgress size={22} />}

            <div className="flex flex-wrap gap-2 mt-2">
              {formik.values.images.map((img: string, index: number) => (
                <div key={`${img}-${index}`} className="relative">
                  <img src={img} alt="product" className="w-16 h-16 object-cover rounded" />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5"
                  >
                    x
                  </button>
                </div>
              ))}
            </div>
          </Grid>

          <Grid size={{ xs: 12 }} className="flex gap-3">
            <Button
              type="submit"
              variant="contained"
              disabled={
                loading ||
                uploadingImages ||
                !formik.values.category ||
                !formik.values.category2 ||
                !formik.values.category3
              }
            >
              Update Product
            </Button>
            <Button variant="outlined" onClick={() => navigate("/seller/products")}>Cancel</Button>
          </Grid>
        </Grid>
      </form>
    </div>
  );
};
