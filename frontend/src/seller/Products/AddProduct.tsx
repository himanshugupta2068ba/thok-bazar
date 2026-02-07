import { useFormik } from "formik";
import { Button, CircularProgress, Grid } from "@mui/material";
import { AddPhotoAlternate } from "@mui/icons-material";
import { useState, type ChangeEvent } from "react";

export const AddProduct = () => {

  const [uploadedImages, setUploadedImages] = useState<File[]>([]);

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
      colors: [],
      sizes: [],
      images: [],
    },
    onSubmit: (values) => {
      console.log(values);
    },
  });

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files ? Array.from(event.target.files) : [];
    formik.setFieldValue("images", files);
  };
  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold">Add Product</h1>
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={3} className="mt-5">
          <Grid size={{ xs: 12, md: 12 }}>
            <input
              type="file"
              multiple
              accept="image/*"
              id="fileInput"
              // className="w-full border-2 border-gray-300 rounded-md p-2"
              name="images"
              style={{display:"name"}}
              onChange={(event) => {handleImageChange(event);
              formik.handleChange(event);}
              }
            />
            <label htmlFor="fileInput" className="text-sm text-gray-500 mt-1 relative">
             <span className="w-24 h-24 cursor-pointer flex items-center justify-center border-2 border-gray-300 rounded-md p-2 ">
               <AddPhotoAlternate className="text-gray-700" />
             </span>
              {
                uploadedImages.length > 0 && <div className="absolute left-0 right-0 top-0 bottom-0 w-24 h-24 flex justify-center item-center">
                  <CircularProgress size={20} className="absolute top-0 right-0" />
                </div>
              }
            </label>
            <div className="flex mt-2 space-x-2">
              {
                formik.values.images && Array.from(formik.values.images).map((file, index) => (
                  <img
                    key={index}
                    src={URL.createObjectURL(file)}
                    alt={`Preview ${index}`}
                    className="w-24 h-24 object-cover rounded-md"
                  />
                ))
              }
            </div>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <input
              type="text"
              placeholder="Product Title"
              className="w-full border-2 border-gray-300 rounded-md p-2"
              name="title"
              value={formik.values.title}
              onChange={formik.handleChange}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <input
              type="text"
              placeholder="Product Description"
              className="w-full border-2 border-gray-300 rounded-md p-2"
              name="description"
              value={formik.values.description}
              onChange={formik.handleChange}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <input
              type="number"
              placeholder="MRP Price"
              className="w-full border-2 border-gray-300 rounded-md p-2"
              name="mrpPrice"
              value={formik.values.mrpPrice}
              onChange={formik.handleChange}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <input
              type="number"
              placeholder="Selling Price"
              className="w-full border-2 border-gray-300 rounded-md p-2"
              name="sellingPrice"
              value={formik.values.sellingPrice}
              onChange={formik.handleChange}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <input
              type="number"
              placeholder="Stock Quantity"
              className="w-full border-2 border-gray-300 rounded-md p-2"
              name="stock"
              value={formik.values.stock}
              onChange={formik.handleChange}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <input
              type="text"
              placeholder="Category 1"
              className="w-full border-2 border-gray-300 rounded-md p-2"
              name="category"
              value={formik.values.category}
              onChange={formik.handleChange}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <input
              type="text"
              placeholder="Category 2"
              className="w-full border-2 border-gray-300 rounded-md p-2"
              name="category2"
              value={formik.values.category2}
              onChange={formik.handleChange}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <input
              type="text"
              placeholder="Category 3"
              className="w-full border-2 border-gray-300 rounded-md p-2"
              name="category3"
              value={formik.values.category3}
              onChange={formik.handleChange}
            />
          </Grid>
          {/* Colors, Sizes, Images inputs can be added similarly */}
        </Grid>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          className="mt-5 pt-4"
        >
          Add Product
        </Button>
      </form>
    </div>
  );
};
