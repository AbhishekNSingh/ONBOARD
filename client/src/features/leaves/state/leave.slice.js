import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getMyLeaves, createLeave } from "../services/leave.api";
import { logout } from "../../auth/state/auth.slice";
import { getErrorMessage } from "../../shared/utils/getErrorMessage";

/* ---------- thunks ---------- */

export const fetchMyLeaves = createAsyncThunk(
  "leaves/fetchMyLeaves",
  async (_, { rejectWithValue }) => {
    try {
      const data = await getMyLeaves();
      return data.leaves;
    } catch (err) {
      return rejectWithValue(getErrorMessage(err));
    }
  }
);

export const submitLeave = createAsyncThunk(
  "leaves/submitLeave",
  async (leaveData, { rejectWithValue }) => {
    try {
      const data = await createLeave(leaveData);
      return data.leave;
    } catch (err) {
      return rejectWithValue(getErrorMessage(err));
    }
  }
);

/* ---------- slice ---------- */

const initialState = {
  myLeaves: [],
  loading: false,
  error: null,
  submitting: false,
  submitError: null,
};

const leaveSlice = createSlice({
  name: "leaves",
  initialState,
  reducers: {
    clearSubmitError: (state) => {
      state.submitError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      /* --- loading the list --- */
      .addCase(fetchMyLeaves.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyLeaves.fulfilled, (state, action) => {
        state.loading = false;
        state.myLeaves = action.payload;
      })
      .addCase(fetchMyLeaves.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* --- sending a new request --- */
      .addCase(submitLeave.pending, (state) => {
        state.submitting = true;
        state.submitError = null;
      })
      .addCase(submitLeave.fulfilled, (state, action) => {
        state.submitting = false;
        state.myLeaves.unshift(action.payload); // newest on top
      })
      .addCase(submitLeave.rejected, (state, action) => {
        state.submitting = false;
        state.submitError = action.payload;
      })

      /* --- wipe everything when someone logs out --- */
      .addCase(logout.fulfilled, () => initialState)
      .addCase(logout.rejected, () => initialState);
  },
});

export const { clearSubmitError } = leaveSlice.actions;
export default leaveSlice.reducer;