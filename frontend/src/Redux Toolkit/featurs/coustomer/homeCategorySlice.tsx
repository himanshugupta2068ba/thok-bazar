import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../../config/api";

export const fetchHomeCategories = createAsyncThunk<any, void>(
    'homeCategory/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/home-categories');
            return response.data;
        } catch (error: any) {
            return rejectWithValue(
                error?.response?.data?.error ||
                error?.response?.data?.message ||
                error.message ||
                'An error occurred while fetching home categories'
            );
        }
    }
);

export const  createHomeCategory=createAsyncThunk<any,any>(
    'homeCategory/create',
    async(homeCategories,{rejectWithValue})=>{    
    try {
        const jwt = localStorage.getItem('jwt');
        const response=await api.post('/home-categories', homeCategories, {
            headers:{
                Authorization:`Bearer ${jwt}`
            }
        });
        return response.data;
    } catch (error:any) {
        return rejectWithValue(error?.response?.data?.error || error?.response?.data?.message || error.message || 'An error occurred while creating home category');
    }
    });


const HomeCategorySlice=createSlice({
    name:'homeCategory',
    initialState:{
        homeCategories:[] as any[],
        loading:false,
        error:null as string|null,
        homeCategoryCreated:false
    },
    reducers:{},
    extraReducers:(builder)=>{
        builder.addCase(fetchHomeCategories.pending,(state)=>{
            state.loading=true;
            state.error=null;
        });
        builder.addCase(fetchHomeCategories.fulfilled,(state,action)=>{
            state.loading=false;
            state.homeCategories = Array.isArray(action.payload) ? action.payload : [];
        });
        builder.addCase(fetchHomeCategories.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload as string;
        });
        builder.addCase(createHomeCategory.pending,(state)=>{
            state.loading=true;
            state.error=null;
            state.homeCategoryCreated=false;
        });
        builder.addCase(createHomeCategory.fulfilled,(state,action)=>{
            state.loading=false;
            state.homeCategoryCreated=true;
            const categories = Array.isArray(action.payload) ? action.payload : [action.payload];
            state.homeCategories = categories;
        });
        builder.addCase(createHomeCategory.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload as string;
            state.homeCategoryCreated=false;
        });
    }
});

export default HomeCategorySlice.reducer;