import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../../config/api";

interface CouponState {
	coupons: any[];
	loading: boolean;
	error: string | null;
	successMessage: string | null;
}

const initialState: CouponState = {
	coupons: [],
	loading: false,
	error: null,
	successMessage: null,
};

const API_URL = "/coupons";

const getErrorMessage = (error: any) =>
	error?.response?.data?.message ||
	error?.response?.data?.error ||
	error?.message ||
	"An error occurred";

export const fetchCoupons = createAsyncThunk<any, any>(
	"adminCoupon/fetchCoupons",
	async (jwt, { rejectWithValue }) => {
		try {
			const response = await api.get(API_URL, {
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

export const createCoupon = createAsyncThunk<any, any>(
	"adminCoupon/createCoupon",
	async ({ couponData, jwt }, { rejectWithValue }) => {
		try {
			const response = await api.post(
				API_URL,
				{
					code: couponData?.couponCode,
					startDate: couponData?.startDate,
					endDate: couponData?.endDate,
					minOrderAmount: Number(couponData?.minOrderAmount),
					discount: Number(couponData?.discount),
				},
				{
					headers: jwt
						? {
								Authorization: `Bearer ${jwt}`,
							}
						: undefined,
				},
			);
			return response.data;
		} catch (error: any) {
			return rejectWithValue(getErrorMessage(error));
		}
	},
);

export const updateCoupon = createAsyncThunk<any, any>(
	"adminCoupon/updateCoupon",
	async ({ couponId, updates, jwt }, { rejectWithValue }) => {
		try {
			const response = await api.put(`${API_URL}/${couponId}`, updates, {
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

export const deleteCoupon = createAsyncThunk<any, any>(
	"adminCoupon/deleteCoupon",
	async ({ couponId, jwt }, { rejectWithValue }) => {
		try {
			const response = await api.delete(`${API_URL}/${couponId}`, {
				headers: jwt
					? {
							Authorization: `Bearer ${jwt}`,
						}
					: undefined,
			});
			return { couponId, response: response.data };
		} catch (error: any) {
			return rejectWithValue(getErrorMessage(error));
		}
	},
);

export const updateCouponStatus = createAsyncThunk<any, any>(
	"adminCoupon/updateCouponStatus",
	async ({ couponId, status, jwt }, { rejectWithValue }) => {
		try {
			const response = await api.patch(
				`${API_URL}/${couponId}/status`,
				{ status },
				{
					headers: jwt
						? {
								Authorization: `Bearer ${jwt}`,
							}
						: undefined,
				},
			);
			return response.data;
		} catch (error: any) {
			return rejectWithValue(getErrorMessage(error));
		}
	},
);

const couponSlice = createSlice({
	name: "adminCoupon",
	initialState,
	reducers: {
		clearCouponError: (state) => {
			state.error = null;
		},
		clearCouponMessage: (state) => {
			state.successMessage = null;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchCoupons.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchCoupons.fulfilled, (state, action) => {
				state.loading = false;
				state.coupons =
					action.payload?.coupons || action.payload?.content || action.payload || [];
			})
			.addCase(fetchCoupons.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload as string;
			})
			.addCase(createCoupon.pending, (state) => {
				state.loading = true;
				state.error = null;
				state.successMessage = null;
			})
			.addCase(createCoupon.fulfilled, (state, action) => {
				state.loading = false;
				const createdCoupon = action.payload?.coupon || action.payload;
				if (createdCoupon) {
					state.coupons.unshift(createdCoupon);
				}
				state.successMessage = "Coupon created successfully";
			})
			.addCase(createCoupon.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload as string;
			})
			.addCase(updateCoupon.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(updateCoupon.fulfilled, (state, action) => {
				state.loading = false;
				const updatedCoupon = action.payload?.coupon || action.payload;
				const index = state.coupons.findIndex(
					(coupon: any) =>
						(coupon._id || coupon.id) === (updatedCoupon?._id || updatedCoupon?.id),
				);
				if (index !== -1 && updatedCoupon) {
					state.coupons[index] = updatedCoupon;
				}
				state.successMessage = "Coupon updated successfully";
			})
			.addCase(updateCoupon.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload as string;
			})
			.addCase(deleteCoupon.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(deleteCoupon.fulfilled, (state, action) => {
				state.loading = false;
				state.coupons = state.coupons.filter(
					(coupon: any) => (coupon._id || coupon.id) !== action.payload?.couponId,
				);
				state.successMessage =
					action.payload?.response?.message || "Coupon deleted successfully";
			})
			.addCase(deleteCoupon.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload as string;
			})
			.addCase(updateCouponStatus.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(updateCouponStatus.fulfilled, (state, action) => {
				state.loading = false;
				const updatedCoupon = action.payload?.coupon || action.payload;
				const index = state.coupons.findIndex(
					(coupon: any) =>
						(coupon._id || coupon.id) === (updatedCoupon?._id || updatedCoupon?.id),
				);
				if (index !== -1 && updatedCoupon) {
					state.coupons[index] = updatedCoupon;
				}
				state.successMessage = "Coupon status updated successfully";
			})
			.addCase(updateCouponStatus.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload as string;
			});
	},
});

export const { clearCouponError, clearCouponMessage } = couponSlice.actions;

export default couponSlice.reducer;
