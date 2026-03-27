import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../../config/api";


const initialState = {
    product:null,
    products: [],
    totalPages: 0,
    totalElements: 0,
    loading: false,
    error: null,
    searchProducts: [],
};

const isAbortedRequest = (action: any) => action?.meta?.aborted || action?.error?.name === "AbortError";

export const fetchProductById = createAsyncThunk<any,any>(
    "product/fetchProductById",
    async (productId, { rejectWithValue, signal }) => {
        try {
            const response = await api.get(`/products/${productId}`, {
                signal,
            });
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || { error: "Failed to fetch product" });
        }
    }
)

export const SearchProduct = createAsyncThunk<any,any>(
    "product/SearchProduct",
    async (query, { rejectWithValue, signal }) => {
        try {
            const response = await api.get(`/products/search`,{
                params: {
                    q: query
                },
                signal,
            });
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || { error: "Failed to fetch product" });
        }
    }
)

export const getAllProducts = createAsyncThunk<any,any>(
    "product/getAllProducts",
    async (params, { rejectWithValue, signal }) => {
        try {
            const response = await api.get(`/products`,{
                params:{
                    ...params,
                    pageNumber: params?.pageNumber ?? 0,
                },
                signal,
            });
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || { error: "Failed to fetch products" });
        }
    }
)


const productSlice = createSlice({
    name:"product",
    initialState,
    reducers:{},
    extraReducers:(builder)=>{
        builder.addCase(fetchProductById.pending,(state)=>{
            state.loading=true;
            state.error=null;
        });
        builder.addCase(fetchProductById.fulfilled,(state,action)=>{
            state.loading=false;
            state.product=action.payload;
        });
        builder.addCase(fetchProductById.rejected,(state,action:any)=>{
            state.loading=false;
            if (!isAbortedRequest(action)) {
                state.error=action.payload || null;
            }
        });
        builder.addCase(SearchProduct.pending,(state)=>{
            state.loading=true;
            state.error=null;
        });
        builder.addCase(SearchProduct.fulfilled,(state,action)=>{
            state.loading=false;
            state.searchProducts=action.payload;
        });
        builder.addCase(SearchProduct.rejected,(state,action:any)=>{
            state.loading=false;
            if (!isAbortedRequest(action)) {
                state.error=action.payload || null;
            }
        });
        builder.addCase(getAllProducts.pending,(state)=>{
            state.loading=true;
            state.error=null;
        });
        builder.addCase(getAllProducts.fulfilled,(state,action)=>{
            state.loading=false;
            state.products=action.payload?.content || action.payload || [];
            state.totalPages=action.payload?.totalpages || 0;
            state.totalElements=action.payload?.totalElement || 0;
        });
        builder.addCase(getAllProducts.rejected,(state,action:any)=>{
            state.loading=false;
            if (!isAbortedRequest(action)) {
                state.error=action.payload || null;
            }
        });
    }
})

export default productSlice.reducer;
