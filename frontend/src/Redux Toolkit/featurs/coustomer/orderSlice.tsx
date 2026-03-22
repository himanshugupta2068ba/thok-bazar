import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../../config/api";

const createInitialState = () => ({
    orders: [] as any[],
    orderDetails: null,
    loading: false,
    error: null,
    orderItem: null,
    currentOrder: null,
    paymentOrder: null,
    CancelledOrders: [] as any[],
});

const initialState = createInitialState();

const API_URL = "/orders";

const upsertOrder = (orders: any[], nextOrder: any) => {
    if (!nextOrder?._id) return orders;

    const existingIndex = orders.findIndex(
        (order: any) => String(order?._id) === String(nextOrder._id),
    );

    if (existingIndex === -1) {
        return [nextOrder, ...orders].sort(
            (left: any, right: any) =>
                new Date(right?.createdAt || 0).getTime() -
                new Date(left?.createdAt || 0).getTime(),
        );
    }

    const nextOrders = [...orders];
    nextOrders[existingIndex] = nextOrder;
    return nextOrders;
};

export const createOrder = createAsyncThunk<any, any>(
    "order/createOrder",
    async ({address,jwt,paymentGateway}, { rejectWithValue }) => {
        try {
            const response = await api.post(`${API_URL}`, {
                shippingAddress: address,
                paymentMethod: paymentGateway,
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

export const deleteOrder = createAsyncThunk<any, any>(
    "order/deleteOrder",
    async (orderId, { rejectWithValue }) => {
        try {
            const response = await api.delete(`${API_URL}/${orderId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("jwt")}`,
                },
            });
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || { error: "Failed to delete order" });
        }
    }
);

const orderSlice = createSlice({
    name: "order",
    initialState,
    reducers: {
        resetOrderState: () => createInitialState(),
    },
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
            state.CancelledOrders = upsertOrder(state.CancelledOrders, cancelledOrder);
            state.orders = upsertOrder(state.orders, cancelledOrder);
            if (state.orderDetails && (state.orderDetails as any)._id === cancelledOrder._id) {
                state.orderDetails = cancelledOrder;
            }
            if (state.currentOrder && (state.currentOrder as any)._id === cancelledOrder._id) {
                state.currentOrder = cancelledOrder;
            }
        });
        builder.addCase(cancelOrder.rejected, (state, action: any) => {
            state.loading = false;
            state.error = action.payload || null;
        });

        // Delete Order
        builder.addCase(deleteOrder.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(deleteOrder.fulfilled, (state, action) => {
            state.loading = false;
            const deletedOrder = action.payload.order || action.payload;
            state.orders = state.orders.filter((order: any) => order._id !== deletedOrder._id);
            state.CancelledOrders = state.CancelledOrders.filter(
                (order: any) => order._id !== deletedOrder._id,
            );
            if (state.orderDetails && (state.orderDetails as any)._id === deletedOrder._id) {
                state.orderDetails = null;
            }
            if (state.currentOrder && (state.currentOrder as any)._id === deletedOrder._id) {
                state.currentOrder = null;
            }
        });
        builder.addCase(deleteOrder.rejected, (state, action: any) => {
            state.loading = false;
            state.error = action.payload || null;
        });
    }
});

export const { resetOrderState } = orderSlice.actions;
export default orderSlice.reducer;
