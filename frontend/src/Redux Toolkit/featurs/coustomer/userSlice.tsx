import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../../config/api";

export const fetchUserProfile= createAsyncThunk(
  "/users/fetchUserProfile",
  async (jwt: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/users/profile`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        }
      });

      console.log(response.data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error?.response?.data || {error: "Failed to fetch user profile"});
    }
  },
);


interface UserState {
  user: any | null;
  loading: boolean;
  error: any | null;
}

const initialState: UserState = {
  user: null,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchUserProfile.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(fetchUserProfile.fulfilled, (state, action) => {
            state.loading = false;
            state.user = action.payload;
        });
        builder.addCase(fetchUserProfile.rejected, (state, action: any) => {
            state.loading = false;
            state.error = action.payload || null;
        });
    },
});

export default userSlice.reducer;