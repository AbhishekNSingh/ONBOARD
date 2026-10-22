import { useEffect } from "react";
import { Inbox, Users, Wallet } from "lucide-react";
import { useAuth } from "../../auth/hooks/useAuth";
import { useDashboard } from "../hooks/useDashboard";
import PageHeader from "../../shared/components/PageHeader";
import StatCard from "../../shared/components/StatCard";
import ErrorMessage from "../../shared/components/ErrorMessage";
import { formatCurrency, formatMonth } from "../../shared/utils/format";

const currentMonth = () => new Date().toISOString().slice(0, 7);

const ManagerDashboard = () => {
  const { user } = useAuth();
  const { summary, loading, error, loadDashboard } = useDashboard();

  useEffect(() => {
    loadDashboard("manager");
  }, [loadDashboard]);

  const firstName = user?.name?.split(" ")[0];
  const showSkeleton = loading && !summary;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={`Hello, ${firstName}`}
        subtitle={`Your team overview for ${formatMonth(currentMonth())}`}
      />

      {error && <ErrorMessage message={error} onRetry={() => loadDashboard("manager")} />}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard
          label="Team size"
          value={summary?.teamSize ?? 0}
          hint={summary?.teamSize === 0 ? "No one reports to you yet" : "People reporting to you"}
          icon={Users}
          loading={showSkeleton}
        />
        <StatCard
          label="Pending leave requests"
          value={summary?.pendingLeaves ?? 0}
          hint="Waiting for your decision"
          icon={Inbox}
          loading={showSkeleton}
        />
        <StatCard
          label="Paid this month"
          value={formatCurrency(summary?.paidThisMonth)}
          hint="Payments you have made"
          icon={Wallet}
          loading={showSkeleton}
        />
      </div>
    </div>
  );
};

export default ManagerDashboard;