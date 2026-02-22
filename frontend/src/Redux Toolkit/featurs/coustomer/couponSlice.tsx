import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../../config/api";

const API_URL='/coupons';

export const applyCoupon=createAsyncThunk<any,any>(
    'coupon/apply',
    async({code,orderValue,jwt},{rejectWithValue})=>{
    try {
        const response=await api.post(`${API_URL}/apply`, {code,orderValue}, {
            headers:{
                Authorization:`Bearer ${jwt}`
            }
        });
        return response.data;
    } catch (error:any) {
        return rejectWithValue(error?.response?.data?.error || error?.response?.data?.message || error.message || 'An error occurred while applying coupon');
    }
});

const initialState={
    coupon:[],
    cart:null,
    loading:false,
    error:null as string|null,
    couponCreated:false,
    couponApplied:false
};

const couponSlice=createSlice({
    name:'coupon',
    initialState,
    reducers:{},
    extraReducers:(builder)=>{
        builder.addCase(applyCoupon.pending,(state)=>{
            state.loading=true;
            state.error=null;
            state.couponApplied=false;
        });
        builder.addCase(applyCoupon.fulfilled,(state,action)=>{
            state.loading=false;
            state.couponApplied=true;
            state.cart=action.payload?.cart || action.payload;
        });
        builder.addCase(applyCoupon.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload as string;
            state.couponApplied=false;
        });
    }
});

export default couponSlice.reducer;