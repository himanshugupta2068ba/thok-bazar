import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../../config/api";

interface SellerOrderState {
  orders: any[];
  loading: boolean;
  error: string | null;
}

const initialState: SellerOrderState = {
  orders: [],
  loading: false,
  error: null,
};

export const fetchSellerOrders = createAsyncThunk<any, any>(
  "seller/fetchOrders",
  async (jwt, { rejectWithValue }) => {
    try {
      const response = await api.get(`/seller-orders/seller/orders`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || error?.response?.data?.error || error.message || "An error occurred");
    }
  },
);

export const updateOrderStatus = createAsyncThunk<any, any>(
  "seller/updateOrderStatus",
  async ({ orderId, status, jwt }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/seller-orders/seller/order/${orderId}/status`, {
        newStatus: status,
      }, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || error?.response?.data?.error || error.message || "An error occurred");
    }
    },
);

const sellerOrderSlice = createSlice({
    name: "sellerOrders",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchSellerOrders.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(fetchSellerOrders.fulfilled, (state, action) => {
            state.loading = false;
          state.orders = action.payload?.orders || action.payload || [];
        });
        builder.addCase(fetchSellerOrders.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });
        builder.addCase(updateOrderStatus.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(updateOrderStatus.fulfilled, (state, action) => {
            state.loading = false;
          const updatedOrder = action.payload?.order || action.payload;
          const index = state.orders.findIndex((order: any) => (order._id || order.id) === (updatedOrder._id || updatedOrder.id));
            if (index !== -1) {
                state.orders[index] = updatedOrder;
            }
        });
        builder.addCase(updateOrderStatus.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });
    },
});

export default sellerOrderSlice.reducer;