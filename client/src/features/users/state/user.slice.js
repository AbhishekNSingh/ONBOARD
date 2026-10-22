import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getUsers, updateUserRole } from "../services/user.api";
import { logout } from "../../auth/state/auth.slice";
import { getErrorMessage } from "../../shared/utils/getErrorMessage";

/* ---------- thunks ---------- */

export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async (_, { rejectWithValue }) => {
    try {
      const data = await getUsers();
      return data.users;
    } catch (err) {
      return rejectWithValue(getErrorMessage(err));
    }
  }
);

export const changeUserRole = createAsyncThunk(
  "users/changeUserRole",
  async ({ id, role }, { dispatch, rejectWithValue }) => {
    try {
      const data = await updateUserRole(id, role);
      dispatch(fetchUsers()); // other rows may have changed too, so reload
      return data.message;
    } catch (err) {
      return rejectWithValue(getErrorMessage(err));
    }
  }
);

/* ---------- slice ---------- */

const initialState = {
  users: [],
  loading: false,
  error: null,
  updatingId: null,
  actionError: null,
};

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    clearActionError: (state) => {
      state.actionError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(changeUserRole.pending, (state, action) => {
        state.updatingId = action.meta.arg.id;
        state.actionError = null;
      })
      .addCase(changeUserRole.fulfilled, (state) => {
        state.updatingId = null;
      })
      .addCase(changeUserRole.rejected, (state, action) => {
        state.updatingId = null;
        state.actionError = action.payload;
      })

      .addCase(logout.fulfilled, () => initialState)
      .addCase(logout.rejected, () => initialState);
  },
});

export const { clearActionError } = userSlice.actions;
export default userSlice.reducer;