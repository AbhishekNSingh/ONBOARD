import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  getMyLeaves,
  createLeave,
  getPendingLeaves,
  decideLeaveRequest,
} from "../services/leave.api";
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
  },
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
  },
);

export const fetchPendingLeaves = createAsyncThunk(
  "leaves/fetchPendingLeaves",
  async (_, { rejectWithValue }) => {
    try {
      const data = await getPendingLeaves();
      return data.leaves;
    } catch (err) {
      return rejectWithValue(getErrorMessage(err));
    }
  },
);

export const decideLeave = createAsyncThunk(
  "leaves/decideLeave",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      await decideLeaveRequest(id, status);
      return id; // the page only needs to know which row to remove
    } catch (err) {
      return rejectWithValue(getErrorMessage(err));
    }
  },
);

/* ---------- slice ---------- */

const initialState = {
  myLeaves: [],
  loading: false,
  error: null,
  submitting: false,
  submitError: null,

  pendingLeaves: [],
  pendingLoading: false,
  pendingError: null,
  decidingId: null,
  decideError: null,
};

const leaveSlice = createSlice({
  name: "leaves",
  initialState,
  reducers: {
    clearSubmitError: (state) => {
      state.submitError = null;
    },
    clearDecideError: (state) => {
      state.decideError = null;
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
      /* --- the inbox list --- */
      .addCase(fetchPendingLeaves.pending, (state) => {
        state.pendingLoading = true;
        state.pendingError = null;
      })
      .addCase(fetchPendingLeaves.fulfilled, (state, action) => {
        state.pendingLoading = false;
        state.pendingLeaves = action.payload;
      })
      .addCase(fetchPendingLeaves.rejected, (state, action) => {
        state.pendingLoading = false;
        state.pendingError = action.payload;
      })

      /* --- approving or rejecting one request --- */
      .addCase(decideLeave.pending, (state, action) => {
        state.decidingId = action.meta.arg.id; // which row is busy
        state.decideError = null;
      })
      .addCase(decideLeave.fulfilled, (state, action) => {
        state.decidingId = null;
        state.pendingLeaves = state.pendingLeaves.filter(
          (leave) => leave._id !== action.payload,
        );
      })
      .addCase(decideLeave.rejected, (state, action) => {
        state.decidingId = null;
        state.decideError = action.payload;
      })

      /* --- wipe everything when someone logs out --- */
      .addCase(logout.fulfilled, () => initialState)
      .addCase(logout.rejected, () => initialState);
  },
});

export const { clearSubmitError, clearDecideError } = leaveSlice.actions;
export default leaveSlice.reducer;
