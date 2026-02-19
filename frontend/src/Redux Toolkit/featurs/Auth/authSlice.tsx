import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "/auth";

export const sendLoginSignupOtp = createAsyncThunk(
  "/auth/sendLoginSignupOtp",
  async ({ email }: { email: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/sent/login-signup-otp`, {
        email,
      });
      console.log(response.data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  },
);

export const signup = createAsyncThunk(
  "/auth/signup",
  async ({ signupRequest }: any, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/signup`, {
        signupRequest,
      });
      console.log(response.data);
      localStorage.setItem("jwt", response.data.token);
      signupRequest.navigate('/');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  },
);


export const signin = createAsyncThunk(
  "/auth/signin",
  async (signinRequest: any, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/signin`, {
        signinRequest,
      });
      console.log(response.data);
      localStorage.setItem("jwt", response.data.token);
      signinRequest.navigate('/');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
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
    },
    reducers:{
        logout:(state)=>{
            state.user=null;
            state.role=null;
            state.otpSent=false;
            localStorage.removeItem("jwt");
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
        })
        .addCase(signin.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload;
        }
        )
    }
});

export const {logout}=authSlice.actions;
export default authSlice.reducer;