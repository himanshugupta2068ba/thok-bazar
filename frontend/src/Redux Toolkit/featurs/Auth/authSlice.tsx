import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../../config/api.ts";
import { fetchUserProfile } from "../coustomer/userSlice.tsx";
import { clearCustomerSession, getValidCustomerJwt } from "../../../util/customerSession.ts";

export const signup = createAsyncThunk(
  "/users/signup",
  async ({ signupRequest }: any, { rejectWithValue }) => {
    try {
      const response = await api.post(`/users/signup`, signupRequest);
      if (response.data?.jwt) {
        localStorage.setItem("jwt", response.data.jwt);
      }
      if (response.data?.role) {
        localStorage.setItem("role", response.data.role);
      }
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error?.response?.data || { error: "Signup failed" });
    }
  },
);

export const signin = createAsyncThunk(
  "/users/signin",
  async (signinRequest: any, { rejectWithValue }) => {
    try {
      const response = await api.post(`/users/signin`, signinRequest);
      if (response.data?.jwt) {
        localStorage.setItem("jwt", response.data.jwt);
      }
      if (response.data?.role) {
        localStorage.setItem("role", response.data.role);
      }
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error?.response?.data || { error: "Signin failed" });
    }
  }
);

export const signinWithGoogle = createAsyncThunk(
  "/users/google-signin",
  async ({ credential }: { credential: string }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/users/google-signin`, { credential });
      if (response.data?.jwt) {
        localStorage.setItem("jwt", response.data.jwt);
      }
      if (response.data?.role) {
        localStorage.setItem("role", response.data.role);
      }
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error?.response?.data || { error: "Google sign-in failed" });
    }
  },
);

const authSlice = createSlice({
    name:'auth',
    initialState:{
        user:null,
        loading:false,
        error:null as unknown,
        role:null,
        otpSent:false,
      jwt:getValidCustomerJwt() || ""
    },
    reducers:{
        logout:(state)=>{
            state.user=null;
            state.role=null;
            state.otpSent=false;
            state.jwt="";
            state.error=null;
            clearCustomerSession();
        },
        clearError:(state)=>{
            state.error=null;
        },
        resetAuthFlow:(state)=>{
            state.loading=false;
            state.error=null;
            state.otpSent=false;
        }
    },
    extraReducers:(builder)=>{
        builder
        .addCase(signup.pending,(state)=>{
            state.loading=true;
            state.error=null;
        })
        .addCase(signup.fulfilled,(state,action)=>{
            state.loading=false;
            state.user=action.payload;
            state.role=action.payload?.role || null;
            state.otpSent=false;
            state.jwt=action.payload?.jwt || "";
        }
        )
        .addCase(signup.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload;
        })
        .addCase(signin.pending,(state)=>{
            state.loading=true;
            state.error=null;
        })
        .addCase(signin.fulfilled,(state,action)=>{
            state.loading=false;
            state.user=action.payload;
            state.role=action.payload?.role || null;
            state.jwt=action.payload?.jwt || "";
        })
        .addCase(signin.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload;
        })
        .addCase(signinWithGoogle.pending,(state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(signinWithGoogle.fulfilled, (state, action) => {
            state.loading = false;
            state.user = action.payload;
            state.role = action.payload?.role || null;
            state.jwt = action.payload?.jwt || "";
        })
        .addCase(signinWithGoogle.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        .addCase(fetchUserProfile.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchUserProfile.fulfilled, (state, action) => {
            state.loading = false;
            state.user = {...action.payload, fullName: action.payload.name};
            state.role=action.payload.role;
            state.jwt=localStorage.getItem("jwt") || "";
        })
        .addCase(fetchUserProfile.rejected, (state, action: any) => {
            state.loading = false;
            state.error = action.payload || null;
            state.user = null;
            state.role = null;
            state.jwt = "";
            clearCustomerSession();
          });
    }
});

export const {logout, clearError, resetAuthFlow}=authSlice.actions;
export default authSlice.reducer;
