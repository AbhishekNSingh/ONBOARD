import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
} from "../services/auth.api";

const getErrorMessage = (err) => {
  if (!err.response) {
    return "Can't reach the server. Check your connection and try again.";
  }

  const data = err.response.data;

  if (data?.message) return data.message;
  if (Array.isArray(data?.errors) && data.errors.length > 0)
    return data.errors[0].msg;

  return "Something went wrong. Please try again.";
};

export const fetchCurrentUser = createAsyncThunk(
  "auth/fetchCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      const data = await getCurrentUser();
      return data.user;
    } catch (err) {
      return rejectWithValue({
        status: err.response?.status ?? null, // null means no response at all
        message: getErrorMessage(err),
      });
    }
  },
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
  },
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
  },
);

export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await logoutUser();
    } catch (err) {
      return rejectWithValue(getErrorMessage(err));
    }
  },
);

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
      /* --- check who is logged in (runs on page load) --- */
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isChecking = false;
        state.serverError = false;
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.isChecking = false;

        if (action.payload?.status === 401) {
           
          state.user = null;
          state.serverError = false;
        } else {
          state.serverError = true;
        }
      })

      /* --- login --- */
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* --- register --- */
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* --- logout --- */
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
