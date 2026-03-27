import { createAsyncThunk, createSelector, createSlice } from "@reduxjs/toolkit";
import { api } from "../../../config/api";
import type { RootState } from "../../store";

const HOME_CATEGORY_CACHE_TTL_MS = 5 * 60 * 1000;

type HomeCategoryState = {
    homeCategories: any[];
    loading: boolean;
    error: string | null;
    homeCategoryCreated: boolean;
    lastFetchedAt: number | null;
};

const createInitialState = (): HomeCategoryState => ({
    homeCategories: [],
    loading: false,
    error: null,
    homeCategoryCreated: false,
    lastFetchedAt: null,
});

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
    },
    {
        condition: (_, { getState }) => {
            const state = getState() as RootState;
            const { homeCategory } = state;

            if (homeCategory.loading) {
                return false;
            }

            const hasFreshCache =
                Boolean(homeCategory.homeCategories.length) &&
                Boolean(homeCategory.lastFetchedAt) &&
                Date.now() - Number(homeCategory.lastFetchedAt) < HOME_CATEGORY_CACHE_TTL_MS;

            return !hasFreshCache;
        },
    },
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
    initialState: createInitialState(),
    reducers:{},
    extraReducers:(builder)=>{
        builder.addCase(fetchHomeCategories.pending,(state)=>{
            state.loading=true;
            state.error=null;
        });
        builder.addCase(fetchHomeCategories.fulfilled,(state,action)=>{
            state.loading=false;
            state.homeCategories = Array.isArray(action.payload) ? action.payload : [];
            state.lastFetchedAt = Date.now();
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
            state.lastFetchedAt = Date.now();
        });
        builder.addCase(createHomeCategory.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload as string;
            state.homeCategoryCreated=false;
        });
    }
});

const selectHomeCategoryState = (state: RootState) => state.homeCategory;

export const selectHomeCategories = createSelector(
    [selectHomeCategoryState],
    (homeCategory) => homeCategory.homeCategories,
);

export const selectGridHomeCategories = createSelector(
    [selectHomeCategories],
    (items) => items.filter((item: any) => item.section === "GRID"),
);

export const selectElectronicHomeCategories = createSelector(
    [selectHomeCategories],
    (items) => items.filter((item: any) => item.section === "ELECTRIC_CATEGORIES"),
);

export const selectShopByCategoryHomeCategories = createSelector(
    [selectHomeCategories],
    (items) => items.filter((item: any) => item.section === "SHOP_BY_CATEGORY"),
);

export default HomeCategorySlice.reducer;
