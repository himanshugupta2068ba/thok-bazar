import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../../config/api";

interface DealState {
	deals: any[];
	loading: boolean;
	error: string | null;
	successMessage: string | null;
}

const initialState: DealState = {
	deals: [],
	loading: false,
	error: null,
	successMessage: null,
};

const getErrorMessage = (error: any) =>
	error?.response?.data?.message ||
	error?.response?.data?.error ||
	error?.message ||
	"An error occurred";

const API_URL = "/deals";

export const fetchDeals = createAsyncThunk<any, any>(
	"deal/fetchDeals",
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

export const createDeal = createAsyncThunk<any, any>(
	"deal/createDeal",
	async ({ deal, jwt }, { rejectWithValue }) => {
		try {
			const response = await api.post(
				API_URL,
				{
					categoryId: deal?.categoryId,
					discount: Number(deal?.discount),
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

export const updateDeal = createAsyncThunk<any, any>(
	"deal/updateDeal",
	async ({ dealId, discount, jwt }, { rejectWithValue }) => {
		try {
			const response = await api.put(
				`${API_URL}/${dealId}`,
				{
					discount: Number(discount),
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

export const deleteDeal = createAsyncThunk<any, any>(
	"deal/deleteDeal",
	async ({ dealId, jwt }, { rejectWithValue }) => {
		try {
			const response = await api.delete(`${API_URL}/${dealId}`, {
				headers: jwt
					? {
							Authorization: `Bearer ${jwt}`,
						}
					: undefined,
			});
			return { dealId, response: response.data };
		} catch (error: any) {
			return rejectWithValue(getErrorMessage(error));
		}
	},
);

const dealSlice = createSlice({
	name: "deal",
	initialState,
	reducers: {
		clearDealError: (state) => {
			state.error = null;
		},
		clearDealMessage: (state) => {
			state.successMessage = null;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchDeals.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchDeals.fulfilled, (state, action) => {
				state.loading = false;
				state.deals = action.payload?.deals || action.payload?.content || action.payload || [];
			})
			.addCase(fetchDeals.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload as string;
			})
			.addCase(createDeal.pending, (state) => {
				state.loading = true;
				state.error = null;
				state.successMessage = null;
			})
			.addCase(createDeal.fulfilled, (state, action) => {
				state.loading = false;
				const createdDeal = action.payload?.deal || action.payload;
				if (createdDeal) {
					state.deals.unshift(createdDeal);
				}
				state.successMessage = "Deal created successfully";
			})
			.addCase(createDeal.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload as string;
			})
			.addCase(updateDeal.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(updateDeal.fulfilled, (state, action) => {
				state.loading = false;
				const updatedDeal = action.payload?.deal || action.payload;
				const index = state.deals.findIndex(
					(deal: any) => (deal._id || deal.id) === (updatedDeal?._id || updatedDeal?.id),
				);

				if (index !== -1 && updatedDeal) {
					state.deals[index] = updatedDeal;
				}
				state.successMessage = "Deal updated successfully";
			})
			.addCase(updateDeal.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload as string;
			})
			.addCase(deleteDeal.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(deleteDeal.fulfilled, (state, action) => {
				state.loading = false;
				state.deals = state.deals.filter(
					(deal: any) => (deal._id || deal.id) !== action.payload?.dealId,
				);
				state.successMessage =
					action.payload?.response?.message || "Deal deleted successfully";
			})
			.addCase(deleteDeal.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload as string;
			});
	},
});

export const { clearDealError, clearDealMessage } = dealSlice.actions;

export default dealSlice.reducer;
