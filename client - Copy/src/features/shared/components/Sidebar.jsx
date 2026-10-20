import { NavLink } from "react-router-dom";
import { useAuth } from "../../auth/hooks/useAuth";
import LogoutButton from "../../auth/components/LogoutButton";
import Logo from "./Logo";
import { navItems } from "../utils/navItems";

const Sidebar = () => {
  const { user } = useAuth();
  const items = navItems[user.role] || [];

  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-line bg-card px-4 py-6">
      <Logo className="px-3 pb-8" />

      <nav className="flex flex-1 flex-col gap-1">
        {items.map(({ label, to, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                isActive
                  ? "bg-soft font-medium text-primary"
                  : "text-ink-muted hover:bg-soft hover:text-ink"
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-line pt-4">
        <p className="px-3 text-sm font-medium text-ink">{user.name}</p>
        <p className="mb-3 px-3 text-xs capitalize text-ink-muted">{user.role}</p>
        <LogoutButton />
      </div>
    </aside>
  );
};

export default Sidebar;