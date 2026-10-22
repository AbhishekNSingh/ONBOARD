import { useEffect } from "react";
import { Inbox, UserCog, UserRound, Users } from "lucide-react";
import { useAuth } from "../../auth/hooks/useAuth";
import { useDashboard } from "../hooks/useDashboard";
import PageHeader from "../../shared/components/PageHeader";
import StatCard from "../../shared/components/StatCard";
import ErrorMessage from "../../shared/components/ErrorMessage";

const AdminDashboard = () => {
  const { user } = useAuth();
  const { summary, loading, error, loadDashboard } = useDashboard();

  useEffect(() => {
    loadDashboard("admin");
  }, [loadDashboard]);

  const firstName = user?.name?.split(" ")[0];
  const showSkeleton = loading && !summary;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={`Hello, ${firstName}`}
        subtitle="Overview of your organisation"
      />

      {error && (
        <ErrorMessage message={error} onRetry={() => loadDashboard("admin")} />
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total users"
          value={summary?.totalUsers ?? 0}
          hint="Everyone with an account"
          icon={Users}
          loading={showSkeleton}
        />
        <StatCard
          label="Managers"
          value={summary?.managers ?? 0}
          hint="People who lead a team"
          icon={UserCog}
          loading={showSkeleton}
        />
        <StatCard
          label="Employees"
          value={summary?.employees ?? 0}
          hint="People on a team"
          icon={UserRound}
          loading={showSkeleton}
        />
        <StatCard
          label="Pending manager requests"
          value={summary?.pendingLeaves ?? 0}
          hint="Leave requests waiting for you"
          icon={Inbox}
          loading={showSkeleton}
        />
      </div>
    </div>
  );
};

export default AdminDashboard;