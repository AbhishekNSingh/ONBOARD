import { createBrowserRouter, Navigate } from "react-router-dom";
import Login from "../features/auth/pages/Login";
import Register from "../features/auth/pages/Register";
import Protected from "../features/auth/components/Protected";
import AppLayout from "./AppLayout";
import ComponentPreview from "../features/shared/pages/ComponentPreview";
import EmployeeDashboard from "../features/dashboard/pages/EmployeeDashboard";
import ManagerDashboard from "../features/dashboard/pages/ManagerDashboard";
import AdminDashboard from "../features/dashboard/pages/AdminDashboard";
import LeavesPage from "../features/leaves/pages/LeavesPage";
import LeaveInbox from "../features/leaves/pages/LeaveInbox";
import UsersPage from "../features/users/pages/UsersPage";


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
          { path: "/employee/leaves", element: <LeavesPage /> },
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
        children: [
          { path: "/manager", element: <ManagerDashboard /> },
          { path: "/manager/my-leaves", element: <LeavesPage /> },
          { path: "/manager/leaves", element: <LeaveInbox title="Leave inbox" subtitle="Requests from your team" /> },
        ],
      },
    ],
  },

  {
    element: <Protected roles={["admin"]} />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { path: "/admin", element: <AdminDashboard /> },
          { path: "/admin/users", element: <UsersPage /> },
          { path: "/admin/leaves", element: <LeaveInbox title="Leave requests" subtitle="Requests from managers" /> },
        ],
      },
    ],
  },

  { path: "*", element: <Navigate to="/" replace /> },
]);