import { configureStore } from "@reduxjs/toolkit";
import themeReducer from "../features/shared/state/theme.slice";
import authReducer from "../features/auth/state/auth.slice"
import dashboardReducer from "../features/dashboard/state/dashboard.slice";
import leaveReducer from "../features/leaves/state/leave.slice";


export const store = configureStore({
  reducer: {
    theme: themeReducer,
    auth:authReducer,
    dashboard: dashboardReducer,
    leaves: leaveReducer,
    },
});