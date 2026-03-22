import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../../config/api";

const API_URL = "/coupons";

export const fetchActiveCoupons = createAsyncThunk<any, void>(
  "coupon/fetchActive",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(API_URL, {
        params: {
          status: "ACTIVE",
          activeOnly: true,
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.error ||
          error?.response?.data?.message ||
          error?.message ||
          "Unable to load coupons",
      );
    }
  },
);

export const applyCouponToCart = createAsyncThunk<any, any>(
  "coupon/applyToCart",
  async ({ code, jwt }, { rejectWithValue }) => {
    try {
      const response = await api.patch(
        `/cart/coupon`,
        { code },
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        },
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.error ||
          error?.response?.data?.message ||
          error?.message ||
          "An error occurred while applying coupon",
      );
    }
  },
);

export const removeCouponFromCart = createAsyncThunk<any, any>(
  "coupon/removeFromCart",
  async (jwt, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/cart/coupon`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.error ||
          error?.response?.data?.message ||
          error?.message ||
          "Unable to remove coupon",
      );
    }
  },
);

const initialState = {
  coupons: [] as any[],
  cart: null,
  loading: false,
  actionLoading: false,
  error: null as string | null,
  successMessage: null as string | null,
  couponCreated: false,
  couponApplied: false,
};

const couponSlice = createSlice({
  name: "coupon",
  initialState,
  reducers: {
    clearCouponFeedback: (state) => {
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchActiveCoupons.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchActiveCoupons.fulfilled, (state, action) => {
        state.loading = false;
        state.coupons = Array.isArray(action.payload)
          ? action.payload
          : action.payload?.coupons || [];
      })
      .addCase(fetchActiveCoupons.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(applyCouponToCart.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
        state.successMessage = null;
        state.couponApplied = false;
      })
      .addCase(applyCouponToCart.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.couponApplied = true;
        state.cart = action.payload?.cart || action.payload;
        const couponCode = action.payload?.couponCode || action.payload?.appliedCoupon?.code || "";
        state.successMessage = couponCode
          ? `Coupon ${couponCode} applied successfully`
          : "Coupon applied successfully";
      })
      .addCase(applyCouponToCart.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload as string;
        state.couponApplied = false;
      })
      .addCase(removeCouponFromCart.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(removeCouponFromCart.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.couponApplied = false;
        state.cart = action.payload?.cart || action.payload;
        state.successMessage = "Coupon removed successfully";
      })
      .addCase(removeCouponFromCart.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearCouponFeedback } = couponSlice.actions;
export default couponSlice.reducer;
