import { createBrowserRouter, Navigate } from "react-router-dom";
import Login from "../features/auth/pages/Login";
import Register from "../features/auth/pages/Register";
import Protected from "../features/auth/components/Protected";
import AppLayout from "./AppLayout";
import ComponentPreview from "../features/shared/pages/ComponentPreview";
import EmployeeDashboard from "../features/dashboard/pages/EmployeeDashboard";
import ManagerDashboard from "../features/dashboard/pages/ManagerDashboard";
import AdminDashboard from "../features/dashboard/pages/AdminDashboard";

export const router = createBrowserRouter([
  { path: "/", element: <Navigate to="/login" replace /> },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },

  {
    element: <Protected roles={["employee"]} />,
    children: [
      {
        element: <AppLayout />,
        children: [{ path: "/employee", element: <EmployeeDashboard /> },
        { path: "/employee/preview", element: <ComponentPreview /> },

        ],
      },
    ],
  },

  {
    element: <Protected roles={["manager"]} />,
    children: [
      {
        element: <AppLayout />,
        children: [{ path: "/manager", element: <ManagerDashboard /> }],
      },
    ],
  },

  {
    element: <Protected roles={["admin"]} />,
    children: [
      {
        element: <AppLayout />,
        children: [{ path: "/admin", element: <AdminDashboard /> }],
      },
    ],
  },

  { path: "*", element: <Navigate to="/" replace /> },
]);