import { useAuth } from "../../auth/hooks/useAuth";
import ThemeToggle from "./ThemeToggle";

const getInitials = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

const TopBar = () => {
  const { user } = useAuth();

  return (
    <header className="flex h-16 shrink-0 items-center justify-end gap-3 border-b border-line px-8">
      <ThemeToggle />
      <div
        className="flex h-9 w-9 items-center justify-center rounded-full bg-soft text-xs font-semibold text-primary"
        title={user?.name}
      >
        {getInitials(user?.name)}
      </div>
    </header>
  );
};

export default TopBar;