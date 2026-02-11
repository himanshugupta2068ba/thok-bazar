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
import { useState, type ChangeEvent } from "react";

import mainCategory from "../../data/category/mainCategory";
import { menLevelTwo } from "../../data/category/level2/menlevelTwo";
import { womenLevelTwo } from "../../data/category/level2/womenlevel2";
import { homelivingLevelTwo } from "../../data/category/level2/homelivinglevel2";
import { electronicsLevelTwo } from "../../data/category/level2/eletronicslevel2";

import { menthirdlevel } from "../../data/category/level3/menthirdlevel";
import { womenthirdlevel } from "../../data/category/level3/womenthirdlevel";
import { homethirdlevel } from "../../data/category/level3/homelivinglevel3";
import { electronicthirdlevel } from "../../data/category/level3/electronicslevel3";

import { colours } from "../../data/Filters/colour";

const sizes = ["S", "M", "L", "XL", "XXL"];

const categories2: { [key: string]: any[] } = {
  men: menLevelTwo,
  women: womenLevelTwo,
  kids: [],
  homeliving: homelivingLevelTwo,
  beauty: [],
  electronics: electronicsLevelTwo,
};

const categories3: { [key: string]: any[] } = {
  men: menthirdlevel,
  women: womenthirdlevel,
  kids: [],
  homeliving: homethirdlevel,
  beauty: [],
  electronics: electronicthirdlevel,
};

export const AddProduct = () => {
  const [uploadedImages, setUploadedImages] = useState(false);

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
      colors: "",
      sizes: "",
      images: ["https://avatars.githubusercontent.com/u/196467988?v=4"],
    },
    onSubmit: (values) => {
      console.log(values);
    },
  });

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    console.log("Selected files:", event.target.files);
  };

  const handleRemoveImage = (index: number) => {
    console.log("Remove image at index:", index);
  };

 const childCategoryOptions = (category: any[] = [], parentCategoryId: any) => {
  if (!parentCategoryId) return [];
  return category.filter(
    (c) => String(c.parentCategoryId) === String(parentCategoryId)
  );
};

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold text-center">Add Product</h1>

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
            ["description", "Product Description"],
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
                {categories2[formik.values.category]?.map((item, i) => (
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
                {childCategoryOptions(categories3[formik.values.category],formik.values.category2)?.map((item, i) => (
                  <MenuItem key={i} value={item.categoryId}>
                    {item.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Colors */}
          <Grid size={{ xs: 12, md: 6 }}>
            <FormControl fullWidth>
              <InputLabel id="colors-label">Colors</InputLabel>
              <Select
                labelId="colors-label"
                name="colors"
                value={formik.values.colors}
                label="Colors"
                onChange={formik.handleChange}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {colours.map((c, i) => (
                  <MenuItem key={i} value={c.name}>
                    {c.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Sizes */}
          <Grid size={{ xs: 12, md: 6 }}>
            <FormControl fullWidth>
              <InputLabel id="sizes-label">Sizes</InputLabel>
              <Select
                labelId="sizes-label"
                name="sizes"
                value={formik.values.sizes}
                label="Sizes"
                onChange={formik.handleChange}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {sizes.map((s) => (
                  <MenuItem key={s} value={s}>
                    {s}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Button type="submit" variant="contained">
              Add Product
            </Button>
          </Grid>
        </Grid>
      </form>
    </div>
  );
};
