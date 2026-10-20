import {
  LayoutDashboard,
  CalendarCheck,
  PlaneTakeoff,
  Wallet,
  TrendingUp,
  Users,
  Inbox,
  UserCog,
} from "lucide-react";

export const navItems = {
  employee: [
    { label: "Dashboard", to: "/employee", icon: LayoutDashboard },
    { label: "Attendance", to: "/employee/attendance", icon: CalendarCheck },
    { label: "Leaves", to: "/employee/leaves", icon: PlaneTakeoff },
    { label: "Salary", to: "/employee/salary", icon: Wallet },
    { label: "Performance", to: "/employee/performance", icon: TrendingUp },
  ],
  manager: [
    { label: "Dashboard", to: "/manager", icon: LayoutDashboard },
    { label: "My team", to: "/manager/team", icon: Users },
    { label: "Leave inbox", to: "/manager/leaves", icon: Inbox },
    { label: "Payroll", to: "/manager/payroll", icon: Wallet },
    { label: "Performance", to: "/manager/performance", icon: TrendingUp },
  ],
  admin: [
    { label: "Dashboard", to: "/admin", icon: LayoutDashboard },
    { label: "Users", to: "/admin/users", icon: UserCog },
    { label: "Leave requests", to: "/admin/leaves", icon: Inbox },
  ],
};