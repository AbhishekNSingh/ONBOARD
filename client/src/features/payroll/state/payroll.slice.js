import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  getMySummary,
  getMyBonuses,
  getMyAdvances,
  getMyPayments,
  getEmployeeSummary,
  getEmployeePayments,
  postBonus,
  postAdvance,
  postPayment,
} from "../services/payroll.api";
import { logout } from "../../auth/state/auth.slice";
import { getErrorMessage } from "../../shared/utils/getErrorMessage";

// a 400 from the summary means "salary not set", which is a normal state, not a failure
const summaryOrNull = async (request) => {
  try {
    const data = await request();
    return data.summary;
  } catch (err) {
    if (err.response?.status === 400) return null;
    throw err;
  }
};

/* ---------- employee side ---------- */

export const fetchMyPayroll = createAsyncThunk(
  "payroll/fetchMyPayroll",
  async (month, { rejectWithValue }) => {
    try {
      const summary = await summaryOrNull(() => getMySummary(month));
      const [bonuses, advances, payments] = await Promise.all([
        getMyBonuses(month),
        getMyAdvances(month),
        getMyPayments(month),
      ]);
      return {
        summary,
        bonuses: bonuses.bonuses,
        advances: advances.advances,
        payments: payments.payments,
      };
    } catch (err) {
      return rejectWithValue(getErrorMessage(err));
    }
  }
);

/* ---------- manager side ---------- */

export const fetchEmployeePayroll = createAsyncThunk(
  "payroll/fetchEmployeePayroll",
  async ({ id, month }, { rejectWithValue }) => {
    try {
      const summary = await summaryOrNull(() => getEmployeeSummary(id, month));
      const payments = await getEmployeePayments(id, month);
      return { summary, payments: payments.payments };
    } catch (err) {
      return rejectWithValue(getErrorMessage(err));
    }
  }
);

// one helper builds the three similar "post, then reload" thunks
const makeAction = (name, request) =>
  createAsyncThunk(
    `payroll/${name}`,
    async ({ employeeId, month, ...rest }, { dispatch, rejectWithValue }) => {
      try {
        const data = await request({ employeeId, month, ...rest });
        dispatch(fetchEmployeePayroll({ id: employeeId, month }));
        return data.message;
      } catch (err) {
        return rejectWithValue(getErrorMessage(err));
      }
    }
  );

export const giveBonus = makeAction("giveBonus", postBonus);
export const giveAdvance = makeAction("giveAdvance", postAdvance);
export const makePayment = makeAction("makePayment", postPayment);

/* ---------- slice ---------- */

const initialState = {
  mine: { summary: null, bonuses: [], advances: [], payments: [] },
  mineLoading: false,
  mineError: null,

  selected: { id: null, month: null, summary: null, payments: [] },
  selectedLoading: false,
  selectedError: null,
};

const payrollSlice = createSlice({
  name: "payroll",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyPayroll.pending, (state) => {
        state.mineLoading = true;
        state.mineError = null;
      })
      .addCase(fetchMyPayroll.fulfilled, (state, action) => {
        state.mineLoading = false;
        state.mine = action.payload;
      })
      .addCase(fetchMyPayroll.rejected, (state, action) => {
        state.mineLoading = false;
        state.mineError = action.payload;
      })

      .addCase(fetchEmployeePayroll.pending, (state, action) => {
        const { id, month } = action.meta.arg;
        // a different person or month: clear. The same one (a refresh): keep what's on screen
        if (state.selected.id !== id || state.selected.month !== month) {
          state.selected = { id, month, summary: null, payments: [] };
        }
        state.selectedLoading = true;
        state.selectedError = null;
      })
      .addCase(fetchEmployeePayroll.fulfilled, (state, action) => {
        state.selectedLoading = false;
        state.selected.summary = action.payload.summary;
        state.selected.payments = action.payload.payments;
      })
      .addCase(fetchEmployeePayroll.rejected, (state, action) => {
        state.selectedLoading = false;
        state.selectedError = action.payload;
      })

      .addCase(logout.fulfilled, () => initialState)
      .addCase(logout.rejected, () => initialState);
  },
});

export default payrollSlice.reducer;