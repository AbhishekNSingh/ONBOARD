import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  getTeam,
  postAttendance,
  getMyRecords,
  getEmployeeRecords,
} from "../services/attendance.api";
import { logout } from "../../auth/state/auth.slice";
import { getErrorMessage } from "../../shared/utils/getErrorMessage";

export const fetchTeam = createAsyncThunk(
  "attendance/fetchTeam",
  async (_, { rejectWithValue }) => {
    try {
      const data = await getTeam();
      return data.team;
    } catch (err) {
      return rejectWithValue(getErrorMessage(err));
    }
  }
);

export const markAttendance = createAsyncThunk(
  "attendance/markAttendance",
  async ({ employeeId, date, status }, { rejectWithValue }) => {
    try {
      await postAttendance({ employeeId, date, status });
      return { employeeId, status };
    } catch (err) {
      return rejectWithValue(getErrorMessage(err));
    }
  }
);

export const fetchMyRecords = createAsyncThunk(
  "attendance/fetchMyRecords",
  async (_, { rejectWithValue }) => {
    try {
      const data = await getMyRecords();
      return data.records ?? data.record ?? [];
    } catch (err) {
      return rejectWithValue(getErrorMessage(err));
    }
  }
);

export const fetchEmployeeRecords = createAsyncThunk(
  "attendance/fetchEmployeeRecords",
  async ({ id, month }, { rejectWithValue }) => {
    try {
      const data = await getEmployeeRecords(id, month);
      return data.records ?? [];
    } catch (err) {
      return rejectWithValue(getErrorMessage(err));
    }
  }
);

const initialState = {
  team: [],
  teamLoading: false,
  teamError: null,

  marked: {}, // { [employeeId]: status } for the date being marked
  markingId: null,
  markError: null,

  myRecords: [],
  myLoading: false,
  myError: null,

  employeeRecords: [],
  employeeLoading: false,
  employeeError: null,
};

const attendanceSlice = createSlice({
  name: "attendance",
  initialState,
  reducers: {
    clearMarks: (state) => {
      state.marked = {};
      state.markError = null;
    },
    clearMarkError: (state) => {
      state.markError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTeam.pending, (state) => {
        state.teamLoading = true;
        state.teamError = null;
      })
      .addCase(fetchTeam.fulfilled, (state, action) => {
        state.teamLoading = false;
        state.team = action.payload;
      })
      .addCase(fetchTeam.rejected, (state, action) => {
        state.teamLoading = false;
        state.teamError = action.payload;
      })

      .addCase(markAttendance.pending, (state, action) => {
        state.markingId = action.meta.arg.employeeId;
        state.markError = null;
      })
      .addCase(markAttendance.fulfilled, (state, action) => {
        state.markingId = null;
        state.marked[action.payload.employeeId] = action.payload.status;
      })
      .addCase(markAttendance.rejected, (state, action) => {
        state.markingId = null;
        state.markError = action.payload;
      })

      .addCase(fetchMyRecords.pending, (state) => {
        state.myLoading = true;
        state.myError = null;
      })
      .addCase(fetchMyRecords.fulfilled, (state, action) => {
        state.myLoading = false;
        state.myRecords = action.payload;
      })
      .addCase(fetchMyRecords.rejected, (state, action) => {
        state.myLoading = false;
        state.myError = action.payload;
      })

      .addCase(fetchEmployeeRecords.pending, (state) => {
        state.employeeLoading = true;
        state.employeeError = null;
        state.employeeRecords = []; // never show the previous person's records
      })
      .addCase(fetchEmployeeRecords.fulfilled, (state, action) => {
        state.employeeLoading = false;
        state.employeeRecords = action.payload;
      })
      .addCase(fetchEmployeeRecords.rejected, (state, action) => {
        state.employeeLoading = false;
        state.employeeError = action.payload;
      })

      .addCase(logout.fulfilled, () => initialState)
      .addCase(logout.rejected, () => initialState);
  },
});

export const { clearMarks, clearMarkError } = attendanceSlice.actions;
export default attendanceSlice.reducer;