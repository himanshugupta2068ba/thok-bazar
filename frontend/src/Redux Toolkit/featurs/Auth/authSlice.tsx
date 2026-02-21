import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../../config/api.ts";
import { fetchUserProfile } from "../coustomer/userSlice.tsx";

// export const sendLoginSignupOtp = createAsyncThunk(
//   "/auth/sendLoginSignupOtp",
//   async ({ email }: { email: string }, { rejectWithValue }) => {
//     try {
//       const response = await api.post(`/auth/sent/login-signup-otp`, {
//         email,
//       });
//       console.log(response.data);
//       return response.data;
//     } catch (error: any) {
//       return rejectWithValue(error.response.data);
//     }
//   },
// );

export const sendLoginSignupOtp = createAsyncThunk(
  "/auth/send-login-otp",
  async (signupRequest: any, { rejectWithValue }) => {
    try {
      const response = await api.post(`/auth/send-login-otp`, 
        {email:signupRequest.email,}
      );
      console.log(response.data);
      return response.data;
    } catch (error: any) {
      console.log(error?.response?.data || error?.message);
      return rejectWithValue(error?.response?.data || { error: "Failed to send OTP" });
    }
  },
);

export const signup = createAsyncThunk(
  "/users/signup",
  async ({ signupRequest }: any, { rejectWithValue }) => {
    try {
      const response = await api.post(`/users/signup`, {
        email: signupRequest.email,
        name: signupRequest.fullname,
        otp: signupRequest.otp,
        password: "temp123",
        mobile: signupRequest.email.split('@')[0] || "9999999999"
      });
      console.log(response.data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error?.response?.data || {error: "Signup failed"});
    }
  },
);


// export const signin = createAsyncThunk(
//   "/users/signin",
//   async (signinRequest: any, { rejectWithValue }) => {
//     try {
//       const response = await api.post(`/users/signin`, 
//         signinRequest,
//       );
//       console.log(response.data);
//       localStorage.setItem("jwt", response.data.token);
//       signinRequest.navigate('/');
//       return response.data;
//     } catch (error: any) {
//       return rejectWithValue(error.response.data);
//     }
//   },
// );

export const signin = createAsyncThunk(
  "/users/signin",
  async (signinRequest: any, { rejectWithValue }) => {
    try {
      const response = await api.post(`/users/signin`, signinRequest);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data);
    }
  }
);

const authSlice = createSlice({
    name:'auth',
    initialState:{
        user:null,
        loading:false,
        error:null as unknown,
        role:null,
        otpSent:false,
      jwt:""
    },
    reducers:{
        logout:(state)=>{
            state.user=null;
            state.role=null;
            state.otpSent=false;
          state.jwt="";
            state.error=null;
            // Clear all user-related data from localStorage
            localStorage.removeItem("jwt");
            localStorage.removeItem("role");
            localStorage.removeItem("adminToken"); // if exists
        },
        clearError:(state)=>{
            state.error=null;
        }
    },
    extraReducers:(builder)=>{
        builder
        .addCase(sendLoginSignupOtp.pending,(state)=>{
            state.loading=true;
            state.error=null;
        })
        .addCase(sendLoginSignupOtp.fulfilled,(state,action)=>{
            state.loading=false;
            state.user=action.payload;
            state.otpSent=true;
        })
        .addCase(sendLoginSignupOtp.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload;
        })
        .addCase(signup.pending,(state)=>{
            state.loading=true;
            state.error=null;
        })
        .addCase(signup.fulfilled,(state,action)=>{
            state.loading=false;
            state.user=action.payload;
            state.otpSent=false;
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
          state.jwt=action.payload?.jwt || "";
        })
        .addCase(signin.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload;
        }
        )
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
              localStorage.removeItem("jwt");
          });
    }
});

export const {logout, clearError}=authSlice.actions;
export default authSlice.reducer;