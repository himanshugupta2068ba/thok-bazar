import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../../config/api";
import { applyCouponToCart, removeCouponFromCart } from "./couponSlice";

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

const normalizeCartItem = (item: any): CartItem | null => {
    if (!item) return null;

    const product = item.product || item.productId || null;
    const productId =
        (typeof item.productId === "string" ? item.productId : null) ||
        item.product?._id ||
        item.productId?._id ||
        item._id ||
        item.id;

    if (!productId) return null;

    return {
        ...item,
        product,
        productId,
        quantity: Number(item.quantity || 1),
        mrpPrice: Number(item.mrpPrice || product?.mrpPrice || 0),
        sellingPrice: Number(item.sellingPrice || product?.sellingPrice || 0),
    };
};

const calculateCartTotals = (items: CartItem[]) => {
    const totalMrpPrice = items.reduce((total, item: any) => total + Number(item.mrpPrice || 0), 0);
    const totalSellingPrice = items.reduce((total, item: any) => total + Number(item.sellingPrice || 0), 0);
    const totalItems = items.reduce((total, item: any) => total + Number(item.quantity || 0), 0);

    return {
        totalMrpPrice,
        totalSellingPrice,
        totalItems,
        discount:
            totalMrpPrice > 0
                ? Math.round(((totalMrpPrice - totalSellingPrice) / totalMrpPrice) * 100)
                : 0,
    };
};

const syncCartState = (cart: Cart | null, items: CartItem[]): Cart => ({
    ...(cart || {}),
    items,
    cartItems: items,
    ...calculateCartTotals(items),
});

const normalizeCartPayload = (payload: any): Cart => {
    if (!payload) return { items: [] };

    if (Array.isArray(payload)) {
        const items = payload.map(normalizeCartItem).filter(Boolean) as CartItem[];
        return syncCartState(null, items);
    }

    const rawItems = payload.items || payload.cartItems;
    if (Array.isArray(rawItems)) {
        const items = rawItems.map(normalizeCartItem).filter(Boolean) as CartItem[];
        return syncCartState(payload, items);
    }

    const singleItem = normalizeCartItem(payload);
    if (singleItem) {
        return syncCartState(null, [singleItem]);
    }

    return syncCartState(payload, []);
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
    reducers:{
        clearCartState:(state)=>{
            state.cart = null;
            state.loading = false;
            state.error = "";
        },
    },
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

            if (Array.isArray(action.payload?.items) || Array.isArray(action.payload?.cartItems)) {
                state.cart = normalizeCartPayload(action.payload);
                return;
            }

            const incomingItem = normalizeCartItem(action.payload);
            if (!incomingItem) {
                state.error = "Unable to add item to cart";
                return;
            }

            const currentItems = [...(state.cart?.items || [])];
            const existingIndex = currentItems.findIndex(
                (item: any) =>
                    item._id === incomingItem._id ||
                    item.productId === incomingItem.productId ||
                    item.product?._id === incomingItem.product?._id,
            );

            if (existingIndex >= 0) {
                currentItems[existingIndex] = incomingItem;
            } else {
                currentItems.push(incomingItem);
            }

            state.cart = syncCartState(state.cart, currentItems);
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
                const filteredItems = state.cart.items.filter((item:any)=>
                    item._id!==action.payload.cartItemId &&
                    item.productId!==action.payload.cartItemId &&
                    item.product?._id!==action.payload.cartItemId
                );
                state.cart = syncCartState(state.cart, filteredItems);
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

            if (Array.isArray(action.payload?.items) || Array.isArray(action.payload?.cartItems)) {
                state.cart = normalizeCartPayload(action.payload);
                return;
            }

            const updatedItem = normalizeCartItem(action.payload);
            if (!updatedItem) {
                state.error = "Unable to update cart quantity";
                return;
            }

            if(state.cart && state.cart.items){
                const nextItems = [...state.cart.items];
                const index=nextItems.findIndex((item:any)=>
                    item._id===updatedItem._id ||
                    item.productId===updatedItem.productId ||
                    item.product?._id===updatedItem.product?._id
                );
                if(index!==-1){
                    nextItems[index]=updatedItem;
                    state.cart = syncCartState(state.cart, nextItems);
                }
            }
        });
        builder.addCase(updateCartItemQuantity.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload as string;
        });
        builder.addCase(applyCouponToCart.pending,(state)=>{
            state.loading=true;
            state.error="";
        });
        builder.addCase(applyCouponToCart.fulfilled,(state,action)=>{
            state.loading=false;
            state.cart=normalizeCartPayload(action.payload);
        });
        builder.addCase(applyCouponToCart.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload as string;
        });
        builder.addCase(removeCouponFromCart.pending,(state)=>{
            state.loading=true;
            state.error="";
        });
        builder.addCase(removeCouponFromCart.fulfilled,(state,action)=>{
            state.loading=false;
            state.cart=normalizeCartPayload(action.payload);
        });
        builder.addCase(removeCouponFromCart.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload as string;
        });

    }
});

export const { clearCartState } = cartSlice.actions;
export default cartSlice.reducer;
