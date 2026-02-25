import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../../config/api";

interface SellerTransactionState {
	transactions: any[];
	loading: boolean;
	error: string | null;
}

const initialState: SellerTransactionState = {
	transactions: [],
	loading: false,
	error: null,
};

const getErrorMessage = (error: any) =>
	error?.response?.data?.message ||
	error?.response?.data?.error ||
	error?.message ||
	"An error occurred";

export const fetchSellerTransactions = createAsyncThunk<any, any>(
	"sellerTransaction/fetchSellerTransactions",
	async (jwt, { rejectWithValue }) => {
		try {
			const response = await api.get(`/transactions/seller`, {
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

const transactionSlice = createSlice({
	name: "sellerTransactions",
	initialState,
	reducers: {
		clearTransactionError: (state) => {
			state.error = null;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchSellerTransactions.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchSellerTransactions.fulfilled, (state, action) => {
				state.loading = false;
				state.transactions =
					action.payload?.transactions || action.payload?.content || action.payload || [];
			})
			.addCase(fetchSellerTransactions.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload as string;
			});
	},
});

export const { clearTransactionError } = transactionSlice.actions;

export default transactionSlice.reducer;
