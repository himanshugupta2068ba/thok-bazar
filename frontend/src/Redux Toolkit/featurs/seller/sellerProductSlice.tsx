import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../../config/api";

interface SellerProductState {
  products: any[];
  loading: boolean;
  error: string | null;
  successMessage: string | null;
}

const initialState: SellerProductState = {
  products: [],
  loading: false,
  error: null,
  successMessage: null,
};

const API_URL = "/seller-products";

const getErrorMessage = (error: any) =>
  error?.response?.data?.message ||
  error?.response?.data?.error ||
  error?.message ||
  "An error occurred";

export const fetchSellerProducts = createAsyncThunk<any, any>(
  "sellerProduct/fetchSellerProducts",
  async ({ jwt, pageNumber = 0 }, { rejectWithValue }) => {
    try {
      const response = await api.get(API_URL, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
        params: {
          pageNumber,
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const createSellerProduct = createAsyncThunk<any, any>(
  "sellerProduct/createSellerProduct",
  async ({ productData, jwt }, { rejectWithValue }) => {
    try {
      const response = await api.post(
        API_URL,
        {
          title: productData.title,
          description: productData.description,
          mrpPrice: Number(productData.mrpPrice),
          sellingPrice: Number(productData.sellingPrice),
          stock: Number(productData.stock),
          categoryId: productData.category,
          subCategoryId: productData.category2,
          subSubCategoryId: productData.category3,
          color: productData.colors,
          size: productData.sizes,
          images: productData.images || [],
        },
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        },
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const updateSellerProduct = createAsyncThunk<any, any>(
  "sellerProduct/updateSellerProduct",
  async ({ productId, updates, jwt }, { rejectWithValue }) => {
    try {
      const response = await api.put(`${API_URL}/${productId}`, updates, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const deleteSellerProduct = createAsyncThunk<any, any>(
  "sellerProduct/deleteSellerProduct",
  async ({ productId, jwt }, { rejectWithValue }) => {
    try {
      const response = await api.delete(`${API_URL}/${productId}`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      return { productId, response: response.data };
    } catch (error: any) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

const sellerProductSlice = createSlice({
  name: "sellerProduct",
  initialState,
  reducers: {
    clearSellerProductError: (state) => {
      state.error = null;
    },
    clearSellerProductMessage: (state) => {
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSellerProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSellerProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products =
          action.payload?.content ||
          action.payload?.products ||
          action.payload ||
          [];
      })
      .addCase(fetchSellerProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createSellerProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(createSellerProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products.unshift(action.payload);
        state.successMessage = "Product created successfully";
      })
      .addCase(createSellerProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateSellerProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSellerProduct.fulfilled, (state, action) => {
        state.loading = false;
        const updatedProduct = action.payload;
        const index = state.products.findIndex(
          (product: any) => (product._id || product.id) === (updatedProduct._id || updatedProduct.id),
        );
        if (index !== -1) {
          state.products[index] = updatedProduct;
        }
        state.successMessage = "Product updated successfully";
      })
      .addCase(updateSellerProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteSellerProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteSellerProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products = state.products.filter(
          (product: any) => (product._id || product.id) !== action.payload.productId,
        );
        state.successMessage =
          action.payload?.response?.message || "Product deleted successfully";
      })
      .addCase(deleteSellerProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearSellerProductError, clearSellerProductMessage } =
  sellerProductSlice.actions;

export default sellerProductSlice.reducer;
