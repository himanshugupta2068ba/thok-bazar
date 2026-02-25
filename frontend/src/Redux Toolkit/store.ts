import { combineReducers, configureStore } from '@reduxjs/toolkit'; 
import {useDispatch, useSelector, type TypedUseSelectorHook} from "react-redux"
import authSlice from './featurs/Auth/authSlice';
import userSlice from './featurs/coustomer/userSlice';
import productSlice from './featurs/coustomer/productSlice';
import orderSlice from './featurs/coustomer/orderSlice';
import cartSlice from './featurs/coustomer/cartSlice';
import couponSlice from './featurs/coustomer/couponSlice';
import HomeCategorySlice from './featurs/coustomer/homeCategorySlice';
//seller reducer
import sellerSlice from './featurs/seller/sellerAuthentication';
import sellerOrderSlice from './featurs/seller/sellerOrderSlice';
import sellerProductSlice from './featurs/seller/sellerProductSlice';
import sellerDataSlice from './featurs/seller/sellerSlice';
import transactionSlice from './featurs/seller/transactionSlice';
import adminSlice from './featurs/admin/adminSlice';
import dealSlice from './featurs/admin/DealSlice';
import adminCouponSlice from './featurs/admin/couponSlice';

const rootReducer = combineReducers({
    auth:authSlice,
    user:userSlice,
    product:productSlice,
    order:orderSlice,
    cart:cartSlice,
    coupon:couponSlice,
    homeCategory:HomeCategorySlice,
    

    //seller reducer
    seller:sellerSlice,
    sellerOrders:sellerOrderSlice,
    sellerProducts:sellerProductSlice,
    sellerData:sellerDataSlice,
    sellerTransactions:transactionSlice,

    //adminreducer
    adminSlice:adminSlice,
    deals:dealSlice,
    adminCoupons:adminCouponSlice
})

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware()
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch=()=>useDispatch<AppDispatch>();

export const useAppSelector:TypedUseSelectorHook<RootState>=useSelector;

export default store;