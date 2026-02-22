import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../../config/api";

const initialState = {
    orders: [] as any[],
    orderDetails: null,
    loading: false,
    error: null,
    orderItem: null,
    currentOrder: null,
    paymentOrder: null,
    CancelledOrders: [] as any[],
};

const API_URL = "/orders";

export const createOrder = createAsyncThunk<any, any>(
    "order/createOrder",
    async ({address,jwt,paymentGateway}, { rejectWithValue }) => {
        try {
            const response = await api.post(`${API_URL}`, {
                shippingAddress: address,
            }, {
                headers: {
                    Authorization: `Bearer ${jwt}`,
                },
                params: {
                    paymentMethod: paymentGateway,
                }
            });
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || { error: "Failed to create order" });
        }
    }
);

export const fetchUserOrders = createAsyncThunk<any, any>(
    "order/fetchUserOrders",
    async (_, { rejectWithValue }) => {
        try {   
            const response = await api.get(`${API_URL}/user/history`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("jwt")}`,
                },
            });
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || { error: "Failed to fetch orders" });
        }
    }
);

export const fetchOrderDetails = createAsyncThunk<any, any>(
    "order/fetchOrderDetails",
    async (orderId, { rejectWithValue }) => {   
        try {
            const response = await api.get(`${API_URL}/${orderId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("jwt")}`,
                },
            });
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || { error: "Failed to fetch order details" });
        }   
    }
);

export const cancelOrder = createAsyncThunk<any, any>(
    "order/cancelOrder",
    async (orderId, { rejectWithValue }) => {
        try {
            const response = await api.put(`${API_URL}/${orderId}/cancel`, {}, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("jwt")}`,
                },
            });
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || { error: "Failed to cancel order" });
        }
    }
);

const orderSlice = createSlice({
    name: "order",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        // Create Order
        builder.addCase(createOrder.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(createOrder.fulfilled, (state, action) => {
            state.loading = false;
            state.currentOrder = action.payload.order;
            state.paymentOrder = action.payload.paymentDetails;
        });
        builder.addCase(createOrder.rejected, (state, action: any) => {
            state.loading = false;
            state.error = action.payload || null;
        });

        // Fetch User Orders
        builder.addCase(fetchUserOrders.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(fetchUserOrders.fulfilled, (state, action) => {
            state.loading = false;
            state.orders = action.payload.orders || action.payload;
        });
        builder.addCase(fetchUserOrders.rejected, (state, action: any) => {
            state.loading = false;
            state.error = action.payload || null;
        });

        // Fetch Order Details
        builder.addCase(fetchOrderDetails.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(fetchOrderDetails.fulfilled, (state, action) => {
            state.loading = false;
            state.orderDetails = action.payload.order || action.payload;
        });
        builder.addCase(fetchOrderDetails.rejected, (state, action: any) => {
            state.loading = false;
            state.error = action.payload || null;
        });

        // Cancel Order
        builder.addCase(cancelOrder.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(cancelOrder.fulfilled, (state, action) => {
            state.loading = false;
            const cancelledOrder = action.payload.order || action.payload;
            state.CancelledOrders.push(cancelledOrder);
            // Remove from active orders
            state.orders = state.orders.filter((order: any) => order._id !== cancelledOrder._id);
        });
        builder.addCase(cancelOrder.rejected, (state, action: any) => {
            state.loading = false;
            state.error = action.payload || null;
        });
    }
});

export default orderSlice.reducer;
