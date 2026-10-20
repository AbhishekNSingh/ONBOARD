import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getDashboard } from "../services/dashboard.api";
import { logout } from "../../auth/state/auth.slice";
import { getErrorMessage } from "../../shared/utils/getErrorMessage";

export const fetchDashboard = createAsyncThunk(
  "dashboard/fetchDashboard",
  async (role, { rejectWithValue }) => {
    try {
      const data = await getDashboard(role);
      return data.summary;
    } catch (err) {
      return rejectWithValue(getErrorMessage(err));
    }
  }
);

const initialState = {
  summary: null,
  loading: false,
  error: null,
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.summary = action.payload;
      })
      .addCase(fetchDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // when anyone logs out, wipe the saved dashboard
      .addCase(logout.fulfilled, () => initialState)
      .addCase(logout.rejected, () => initialState);
  },
});

export default dashboardSlice.reducer;