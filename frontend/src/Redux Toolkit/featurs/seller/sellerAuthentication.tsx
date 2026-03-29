import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../../config/api";
import { clearSellerSession, getValidSellerJwt } from "../../../util/sellerSession";

interface SellerAuthState {
  otpSent: boolean;
  jwt: string | null;
  role: string | null;
  error: unknown;
  loading: boolean;
}

const initialState: SellerAuthState = {
  otpSent: false,
  jwt: getValidSellerJwt(),
  role: null,
  error: null,
  loading: false,
};

const API_URL = "/sellers";

export const signinSeller = createAsyncThunk<any, any>(
  "/seller/signin",
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.post(`${API_URL}/signin`, {
        email: data.email,
        password: data.password,
      });

      if (response.data?.jwt) {
        localStorage.setItem("sellerJwt", response.data.jwt);
      }

      if (typeof data.navigate === "function") {
        data.navigate("/seller/account");
      }

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error?.response?.data || { error: "Seller login failed" });
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

export const signinSellerWithGoogle = createAsyncThunk<any, any>(
  "/seller/google-signin",
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.post(`${API_URL}/google-signin`, {
        credential: data.credential,
      });

      if (response.data?.jwt) {
        localStorage.setItem("sellerJwt", response.data.jwt);
      }

      if (typeof data.navigate === "function") {
        data.navigate("/seller/account");
      }

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error?.response?.data || { error: "Google sign-in failed" });
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
      clearSellerSession();
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signinSeller.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signinSeller.fulfilled, (state, action) => {
        state.loading = false;
        state.jwt = action.payload?.jwt ?? null;
        state.role = action.payload?.role ?? null;
        state.error = null;
      })
      .addCase(signinSeller.rejected, (state, action) => {
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
      .addCase(signinSellerWithGoogle.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signinSellerWithGoogle.fulfilled, (state, action) => {
        state.loading = false;
        state.jwt = action.payload?.jwt ?? null;
        state.role = action.payload?.role ?? null;
        state.error = null;
      })
      .addCase(signinSellerWithGoogle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as any;
      });
  },
});

export const { resetSellerAuth, clearSellerError, logoutSeller } = sellerSlice.actions;
export default sellerSlice.reducer;
