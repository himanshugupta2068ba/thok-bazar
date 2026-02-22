import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../../config/api";


const initialState = {
    product:null,
    products: [],
    loading: false,
    error: null,
    searchProducts: [],
};

export const fetchProductById = createAsyncThunk<any,any>(
    "product/fetchProductById",
    async (productId, { rejectWithValue }) => {
        try {
            const response = await api.get(`/products/${productId}`);
            console.log("fetch product",response.data);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || { error: "Failed to fetch product" });
        }
    }
)

export const SearchProduct = createAsyncThunk<any,any>(
    "product/SearchProduct",
    async (query, { rejectWithValue }) => {
        try {
            const response = await api.get(`/products/search`,{
                params: {
                    q: query
                }
            });
            console.log("search product",response.data);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || { error: "Failed to fetch product" });
        }
    }
)

export const getAllProducts = createAsyncThunk<any,any>(
    "product/getAllProducts",
    async (params, { rejectWithValue }) => {
        try {
            const response = await api.get(`/products`,{
                params:{
                    ...params,
                    page: params.pageNumber || 1,
                }
            });
            console.log("get all products",response.data);
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
            state.error=action.payload || null;
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
            state.error=action.payload || null;
        });
        builder.addCase(getAllProducts.pending,(state)=>{
            state.loading=true;
            state.error=null;
        });
        builder.addCase(getAllProducts.fulfilled,(state,action)=>{
            state.loading=false;
            state.products=action.payload?.content || action.payload || [];
        });
        builder.addCase(getAllProducts.rejected,(state,action:any)=>{
            state.loading=false;
            state.error=action.payload || null;
        });
    }
})

export default productSlice.reducer;