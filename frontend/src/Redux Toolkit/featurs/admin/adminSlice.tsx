import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../../config/api";

interface AdminState {
  homeCategories: any[];
  loading: boolean;
  error: string | null;
}

const initialState: AdminState = {
  homeCategories: [],
  loading: false,
  error: null,
};

const getErrorMessage = (error: any) =>
  error?.response?.data?.message ||
  error?.response?.data?.error ||
  error?.message ||
  "An error occurred";

export const updateHomeCategoryStatus = createAsyncThunk<any, any>(
  "admin/updateHomeCategoryStatus",
  async ({ categoryId, status, updates, jwt }, { rejectWithValue }) => {
    try {
      const payload = updates || (status ? { section: status } : {});
      const response = await api.put(`/home-categories/${categoryId}`, payload, {
        headers: jwt
          ? {
              Authorization: `Bearer ${jwt}`,
            }
          : undefined,
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const fetchHomeCategories = createAsyncThunk<any, any>(
  "admin/fetchHomeCategories",
  async (jwt, { rejectWithValue }) => {
    try {
      const response = await api.get(`/home-categories`, {
        headers: jwt
          ? {
              Authorization: `Bearer ${jwt}`,
            }
          : undefined,
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    clearAdminError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchHomeCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHomeCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.homeCategories =
          action.payload?.homeCategories || action.payload?.content || action.payload || [];
      })
      .addCase(fetchHomeCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateHomeCategoryStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateHomeCategoryStatus.fulfilled, (state, action) => {
        state.loading = false;
        const updatedCategory = action.payload?.homeCategory || action.payload;
        const index = state.homeCategories.findIndex(
          (category: any) =>
            (category._id || category.id) === (updatedCategory?._id || updatedCategory?.id),
        );

        if (index !== -1 && updatedCategory) {
          state.homeCategories[index] = updatedCategory;
        }
      })
      .addCase(updateHomeCategoryStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearAdminError } = adminSlice.actions;

export default adminSlice.reducer;
