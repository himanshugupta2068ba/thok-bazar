import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../../config/api";

interface SellerState {
    profile: any | null;
    sellers: any[];
    reports: any | null;
    loading: boolean;
    error: string | null;
}

const initialState: SellerState = {
    profile: null,
    sellers: [],
    reports: null,
    loading: false,
    error: null,
};

const getErrorMessage = (error: any) =>
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    "An error occurred";


export const fetchSellerProfile = createAsyncThunk<any, any>(
  "seller/fetchProfile",
  async (jwt, { rejectWithValue }) => {
    try {
            const response = await api.get(`/sellers/profile`, {
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
export const fetchSeller=createAsyncThunk<any, any>(
    "seller/fetchSeller",
    async (status,{rejectWithValue})=>{
        try{
                        const response=await api.get(`/sellers`,{
                params:{
                    status
                }
            });
            return response.data;
        }catch(error:any){
                        return rejectWithValue(getErrorMessage(error));
        }
    }
)

export const updateSellerStatus=createAsyncThunk<any, any>(
    "seller/updateSellerStatus",
        async ({sellerId,status,jwt},{rejectWithValue})=>{
        try{
                        const response=await api.patch(`/admin/seller/${sellerId}/status/${status}`,
                        {},
                        {
                            headers: jwt
                                ? {
                                        Authorization: `Bearer ${jwt}`,
                                    }
                                : undefined,
            });
            return response.data;
        }catch(error:any){
                        return rejectWithValue(getErrorMessage(error));
        }
    }
)

export const fetchSellerReports=createAsyncThunk<any, any>(
    "seller/fetchSellerReports",
    async (jwt,{rejectWithValue})=>{
        try{
                        const response=await api.get(`/seller-reports`,{
                headers:{
                    Authorization:`Bearer ${jwt}`
                }
            });
            return response.data;
        }
        catch(error:any){
                        return rejectWithValue(getErrorMessage(error));
        }
    }
)

const sellerSlice = createSlice({
    name: "sellerData",
    initialState,
    reducers: {
        clearSellerDataError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchSellerProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchSellerProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.profile = action.payload;
            })
            .addCase(fetchSellerProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(fetchSeller.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchSeller.fulfilled, (state, action) => {
                state.loading = false;
                state.sellers = action.payload?.content || action.payload?.sellers || action.payload || [];
            })
            .addCase(fetchSeller.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(updateSellerStatus.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateSellerStatus.fulfilled, (state, action) => {
                state.loading = false;
                const updatedSeller = action.payload?.seller || action.payload;
                const index = state.sellers.findIndex(
                    (seller: any) => (seller._id || seller.id) === (updatedSeller._id || updatedSeller.id),
                );
                if (index !== -1) {
                    state.sellers[index] = updatedSeller;
                }
            })
            .addCase(updateSellerStatus.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(fetchSellerReports.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchSellerReports.fulfilled, (state, action) => {
                state.loading = false;
                state.reports = action.payload;
            })
            .addCase(fetchSellerReports.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearSellerDataError } = sellerSlice.actions;
export default sellerSlice.reducer;