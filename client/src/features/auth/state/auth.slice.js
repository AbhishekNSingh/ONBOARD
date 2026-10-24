import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  registerUser,
  loginUser,
  googleLoginUser,
  logoutUser,
  getCurrentUser,
} from "../services/auth.api";
import { getErrorMessage } from "../../shared/utils/getErrorMessage";

/* ---------- thunks ---------- */

export const fetchCurrentUser = createAsyncThunk(
  "auth/fetchCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      const data = await getCurrentUser();
      return data.user;
    } catch (err) {
      return rejectWithValue({
        status: err.response?.status ?? null, // null means the server never answered
        message: getErrorMessage(err),
      });
    }
  }
);

export const login = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const data = await loginUser(credentials);
      return data.user;
    } catch (err) {
      return rejectWithValue(getErrorMessage(err));
    }
  }
);

export const googleLogin = createAsyncThunk(
  "auth/googleLogin",
  async (credential, { rejectWithValue }) => {
    try {
      const data = await googleLoginUser(credential);
      return data.user;
    } catch (err) {
      return rejectWithValue(getErrorMessage(err));
    }
  }
);

export const register = createAsyncThunk(
  "auth/register",
  async (formData, { rejectWithValue }) => {
    try {
      const data = await registerUser(formData);
      return data.user;
    } catch (err) {
      return rejectWithValue(getErrorMessage(err));
    }
  }
);

export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await logoutUser();
    } catch (err) {
      return rejectWithValue(getErrorMessage(err));
    }
  }
);

/* ---------- slice ---------- */

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    loading: false,
    isChecking: true,
    error: null,
    serverError: false,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      /* --- who is logged in (runs on page load) --- */
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isChecking = false;
        state.serverError = false;
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.isChecking = false;

        if (action.payload?.status === 401) {
          // the server answered: you are not logged in
          state.user = null;
          state.serverError = false;
        } else {
          // no answer from the server: don't log anyone out
          state.serverError = true;
        }
      })

      /* --- logout --- */
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
      })
      .addCase(logout.rejected, (state) => {
        state.user = null;
      });

    // login, Google login and register all behave the same way
    [login, googleLogin, register].forEach((thunk) => {
      builder
        .addCase(thunk.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(thunk.fulfilled, (state, action) => {
          state.loading = false;
          state.user = action.payload;
          state.serverError = false;
        })
        .addCase(thunk.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        });
    });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;