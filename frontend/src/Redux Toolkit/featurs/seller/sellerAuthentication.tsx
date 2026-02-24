import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../../config/api";

interface SellerAuthState {
  otpSent: boolean;
  jwt: string | null;
  role: string | null;
  error: unknown;
  loading: boolean;
}

const initialState: SellerAuthState = {
  otpSent: false,
  jwt: null,
  role: null,
  error: null,
  loading: false,
};

const API_URL = "/sellers";

export const sendLoginOtp = createAsyncThunk<any, any>(
  "/seller/send-login-otp",
  async (signupRequest: any, { rejectWithValue }) => {
    try {
      const response = await api.post(`${API_URL}/send/login-otp`, {
        email: signupRequest.email,
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error?.response?.data || { error: "Failed to send OTP" });
    }
  }
);

export const createSeller = createAsyncThunk<any, any>(
  "/seller/create-seller",
  async (seller, { rejectWithValue }) => {
    try {
      const response = await api.post(`${API_URL}`, seller);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error?.response?.data || { error: "Signup failed" });
    }
  }
);

export const verifyLoginOtp = createAsyncThunk<any, any>(
  "/seller/verify-login-otp",
  async (data, { rejectWithValue }) => {
    try {
      const payload = {
        email: data.email,
        otp: data.otp,
      };

      const response = await api.post(`${API_URL}/verify/login-otp`, payload);

      if (response.data?.jwt) {
        localStorage.setItem("sellerJwt", response.data.jwt);
      }

      if (typeof data.navigate === "function") {
        data.navigate("/seller/dashboard");
      }

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error?.response?.data || { error: "Failed to verify OTP" });
    }
  }
);

const sellerSlice = createSlice({
  name: "sellerAuth",
  initialState,
  reducers: {
    resetSellerAuth: (state) => {
      state.otpSent = false;
      state.jwt = null;
      state.role = null;
      state.error = null;
      state.loading = false;
    },
    clearSellerError: (state) => {
      state.error = null;
    },
    logoutSeller: (state) => {
      state.jwt = null;
      state.role = null;
      state.otpSent = false;
      state.error = null;
      state.loading = false;
      localStorage.removeItem("sellerJwt");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendLoginOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendLoginOtp.fulfilled, (state) => {
        state.loading = false;
        state.otpSent = true;
        state.error = null;
      })
      .addCase(sendLoginOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as any;
      })
      .addCase(createSeller.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSeller.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(createSeller.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as any;
      })
      .addCase(verifyLoginOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyLoginOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.jwt = action.payload?.jwt ?? null;
        state.role = action.payload?.role ?? null;
        state.error = null;
      })
      .addCase(verifyLoginOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as any;
      });
  },
});

export const { resetSellerAuth, clearSellerError, logoutSeller } = sellerSlice.actions;
export default sellerSlice.reducer;
