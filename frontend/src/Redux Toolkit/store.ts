import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { thunk } from 'redux-thunk';
import {useDispatch, useSelector, type TypedUseSelectorHook} from "react-redux"
import authSlice from './featurs/Auth/authSlice';
import userSlice from './featurs/coustomer/userSlice';

const rootReducer = combineReducers({
    auth:authSlice,
    user:userSlice
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