import { configureStore } from "@reduxjs/toolkit";
import themeReducer from "../features/shared/state/theme.slice";
import authReducer from "../features/auth/state/auth.slice";
import dashboardReducer from "../features/dashboard/state/dashboard.slice";
import leaveReducer from "../features/leaves/state/leave.slice";
import userReducer from "../features/users/state/user.slice";
import attendanceReducer from "../features/attendance/state/attendance.slice";
import performanceReducer from "../features/performance/state/performance.slice";
import payrollReducer from "../features/payroll/state/payroll.slice";

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    auth: authReducer,
    dashboard: dashboardReducer,
    leaves: leaveReducer,
    users: userReducer,
    attendance: attendanceReducer,
    performance: performanceReducer,
    payroll: payrollReducer,
  },
});