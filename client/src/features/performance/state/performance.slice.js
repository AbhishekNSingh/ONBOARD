import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getMyRatings } from "../services/performance.api";
import { logout } from "../../auth/state/auth.slice";
import { getErrorMessage } from "../../shared/utils/getErrorMessage";

export const fetchMyRatings = createAsyncThunk(
  "performance/fetchMyRatings",
  async (_, { rejectWithValue }) => {
    try {
      const data = await getMyRatings();
      return data.performances;
    } catch (err) {
      return rejectWithValue(getErrorMessage(err));
    }
  }
);

const initialState = { myRatings: [], loading: false, error: null };

const performanceSlice = createSlice({
  name: "performance",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyRatings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyRatings.fulfilled, (state, action) => {
        state.loading = false;
        state.myRatings = action.payload;
      })
      .addCase(fetchMyRatings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(logout.fulfilled, () => initialState)
      .addCase(logout.rejected, () => initialState);
  },
});

export default performanceSlice.reducer;