import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useFormik } from "formik";
import { Button, CircularProgress, Grid } from "@mui/material";
import {
  fetchSellerProducts,
  updateSellerProduct,
} from "../../Redux Toolkit/featurs/seller/sellerProductSlice";
import { useAppDispatch, useAppSelector } from "../../Redux Toolkit/store";
import { uploadToCloudiniary } from "../../util/uploadToCloudNarry";

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

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      title: product?.title || "",
      description: product?.description || "",
      mrpPrice: product?.mrpPrice || "",
      sellingPrice: product?.sellingPrice || "",
      stock: product?.stock ?? 0,
      color: product?.color || "",
      size: product?.size || "",
      images: product?.images || [],
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
            color: values.color,
            size: values.size,
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
            <input
              name="description"
              placeholder="Product Description"
              value={formik.values.description}
              onChange={formik.handleChange}
              className="w-full border-2 border-gray-300 rounded-md p-2"
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

          <Grid size={{ xs: 12, md: 6 }}>
            <input
              name="color"
              placeholder="Color"
              value={formik.values.color}
              onChange={formik.handleChange}
              className="w-full border-2 border-gray-300 rounded-md p-2"
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <input
              name="size"
              placeholder="Size"
              value={formik.values.size}
              onChange={formik.handleChange}
              className="w-full border-2 border-gray-300 rounded-md p-2"
            />
          </Grid>

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
              disabled={loading || uploadingImages}
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
