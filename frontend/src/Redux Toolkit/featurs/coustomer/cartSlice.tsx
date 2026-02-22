import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../../config/api";

interface CartItem {
    productId: string;
    quantity: number;
    [key: string]: any;
}

interface Cart {
    items: CartItem[];
    [key: string]: any;
}

interface CartState {
    cart: Cart | null;
    loading: boolean;
    error: string;
}

const initialState: CartState = {
    cart:null,
    loading:false,
    error:"",
};

const API_URL="/cart";

const normalizeCartPayload = (payload: any): Cart => {
    if (!payload) return { items: [] };
    if (Array.isArray(payload)) return { items: payload };
    if (Array.isArray(payload.items)) return payload;
    if (Array.isArray(payload.cartItems)) return { ...payload, items: payload.cartItems };
    if (payload._id || payload.product) return { items: [payload] };
    return { ...payload, items: [] };
};

export const fetchCart = createAsyncThunk<any, any>(
    "cart/fetchCart",
    async (jwt , { rejectWithValue }) => {
        try {
            const response = await api.get(API_URL, {
                headers: {
                    Authorization: `Bearer ${jwt}`,
                }
            });
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error?.response?.data?.error || error?.response?.data?.message || "Failed to fetch cart");
        }
    }
);

export const addItemTocart=createAsyncThunk<any, any>(
    "cart/addItemTocart",
    async ({productId,quantity,jwt}:{productId:string,quantity:number,jwt:string} , { rejectWithValue }) => {
        try {
            const response = await api.post(`${API_URL}/add-item`, { productId, quantity }, {
                headers: {
                    Authorization: `Bearer ${jwt}`,
                }
            });
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error?.response?.data?.error || error?.response?.data?.message || "Failed to add item to cart");
        }
    }
);

export const removeItemFromCart=createAsyncThunk<any, any>(
    "cart/removeItemFromCart",
    async ({cartItemId,productId,jwt}:{cartItemId?:string,productId?:string,jwt:string} , { rejectWithValue }) => {
        try {
            const id = cartItemId || productId;
            const response = await api.delete(`${API_URL}/item/${id}`, {
                headers: {  
                    Authorization: `Bearer ${jwt}`,
                }
            });
            return { ...response.data, cartItemId: id };
        }
        catch (error: any) {
            return rejectWithValue(error?.response?.data?.error || error?.response?.data?.message || "Failed to remove item from cart");
        }
    }
);

export const updateCartItemQuantity=createAsyncThunk<any, any>(
    "cart/updateCartItemQuantity",
    async ({cartItemId,productId,quantity,jwt}:{cartItemId?:string,productId?:string,quantity:number,jwt:string} , { rejectWithValue }) => {
        try {
            const id = cartItemId || productId;
            const response = await api.put(`${API_URL}/item/${id}`, { quantity }, {
                headers: {
                    Authorization: `Bearer ${jwt}`,
                }
            });
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error?.response?.data?.error || error?.response?.data?.message || "Failed to update cart item quantity");
        }
    }
);


const cartSlice = createSlice({
    name:"cart",
    initialState,
    reducers:{},
    extraReducers:(builder)=>{
        builder.addCase(fetchCart.pending,(state)=>{
            state.loading=true;
            state.error="";
        });
        builder.addCase(fetchCart.fulfilled,(state,action)=>{
            state.loading=false;
            state.cart=normalizeCartPayload(action.payload);
        });
        builder.addCase(fetchCart.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload as string;
        }
        );
        builder.addCase(addItemTocart.pending,(state)=>{
            state.loading=true;
            state.error="";
        }); 
        builder.addCase(addItemTocart.fulfilled,(state,action)=>{
            state.loading=false;
            const incomingItem = action.payload;
            const currentItems = state.cart?.items || [];
            const existingIndex = currentItems.findIndex((item: any) => item._id === incomingItem?._id);
            if (existingIndex >= 0) {
                currentItems[existingIndex] = incomingItem;
            } else {
                currentItems.push(incomingItem);
            }
            state.cart = { ...(state.cart || {}), items: currentItems };
        });
        builder.addCase(addItemTocart.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload as string;
        });
        builder.addCase(removeItemFromCart.pending,(state)=>{
            state.loading=true;
            state.error="";
        });
        builder.addCase(removeItemFromCart.fulfilled,(state,action)=>{
            state.loading=false;
            if(state.cart?.items){
                state.cart.items = state.cart.items.filter((item:any)=>item._id!==action.payload.cartItemId && item.productId!==action.payload.cartItemId);
            }
        }); 
        builder.addCase(removeItemFromCart.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload as string;
        });
        builder.addCase(updateCartItemQuantity.pending,(state)=>{
            state.loading=true;
            state.error="";
        });
        builder.addCase(updateCartItemQuantity.fulfilled,(state,action)=>{
            state.loading=false;
            if(state.cart && state.cart.items){
                const index=state.cart.items.findIndex((item:any)=>item._id===action.payload._id || item.productId===action.payload.productId);
                if(index!==-1){
                    state.cart.items[index]=action.payload;
                }
            }
        });
        builder.addCase(updateCartItemQuantity.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload as string;
        });

    }
});

export default cartSlice.reducer;