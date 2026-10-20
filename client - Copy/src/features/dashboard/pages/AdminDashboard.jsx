import { useAuth } from "../../auth/hooks/useAuth";
import LogoutButton from "../../auth/components/LogoutButton";

const AdminDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="p-8">
      <h1 className="text-3xl font-semibold">Admin dashboard</h1>
      <p className="mt-2 text-ink-muted">Signed in as {user?.name}</p>
      <div className="mt-6">
        <LogoutButton />
      </div>
    </div>
  );
};

export default AdminDashboard;