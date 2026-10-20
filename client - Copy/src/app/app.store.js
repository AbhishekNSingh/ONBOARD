import { configureStore } from "@reduxjs/toolkit";
import themeReducer from "../features/shared/state/theme.slice";
import authReducer from "../features/auth/state/auth.slice"

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    auth:authReducer
    },
});