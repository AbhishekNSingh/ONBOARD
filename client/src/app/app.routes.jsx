import { createBrowserRouter, Navigate  } from "react-router-dom";
import Login from "../features/auth/pages/Login";
import EmployeeDashboard from "../features/dashboard/pages/EmployeeDashboard";
import ManagerDashboard from "../features/dashboard/pages/ManagerDashboard";
import AdminDashboard from "../features/dashboard/pages/AdminDashboard";

export const router = createBrowserRouter([
  { path: "/", element: <Navigate to="/login" replace /> },
  { path: "/login", element: <Login /> },
  { path: "/employee", element: <EmployeeDashboard /> },
  { path: "/manager", element: <ManagerDashboard /> },
  { path: "/admin", element: <AdminDashboard /> },
]);