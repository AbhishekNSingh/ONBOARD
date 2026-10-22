import { useEffect } from "react";
import { CalendarClock, Hourglass, PlaneTakeoff, Wallet } from "lucide-react";
import { useAuth } from "../../auth/hooks/useAuth";
import { useDashboard } from "../hooks/useDashboard";
import PageHeader from "../../shared/components/PageHeader";
import StatCard from "../../shared/components/StatCard";
import Card from "../../shared/components/Card";
import ErrorMessage from "../../shared/components/ErrorMessage";
import EmptyState from "../../shared/components/EmptyState";
import { formatCurrency, formatMonth } from "../../shared/utils/format";

const SalaryRow = ({ label, value, strong = false }) => (
  <div className="flex items-center justify-between border-t border-line py-3 first:border-t-0">
    <span className="text-sm text-ink-muted">{label}</span>
    <span className={`text-sm ${strong ? "font-semibold text-ink" : "text-ink"}`}>
      {value}
    </span>
  </div>
);

const EmployeeDashboard = () => {
  const { user } = useAuth();
  const { summary, loading, error, loadDashboard } = useDashboard();

  useEffect(() => {
    loadDashboard("employee");
  }, [loadDashboard]);

  const firstName = user?.name?.split(" ")[0];
  const salary = summary?.salary;
  const rating = summary?.latestRating;
  const showSkeleton = loading && !summary;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={`Hello, ${firstName}`}
        subtitle={summary ? `Your overview for ${formatMonth(summary.month)}` : "Your overview"}
      />

      {error && <ErrorMessage message={error} onRetry={() => loadDashboard("employee")} />}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Due this month"
          value={salary ? formatCurrency(salary.due) : "Not set"}
          hint={salary ? "After bonuses, advances and payments" : "Ask your admin to set your salary"}
          icon={Wallet}
          loading={showSkeleton}
        />
        <StatCard
          label="Leave days taken"
          value={summary?.leavesTaken ?? 0}
          hint="Approved leave this year"
          icon={PlaneTakeoff}
          loading={showSkeleton}
        />
        <StatCard
          label="Pending requests"
          value={summary?.pendingLeaves ?? 0}
          hint="Waiting for a decision"
          icon={Hourglass}
          loading={showSkeleton}
        />
        <StatCard
          label="Latest rating"
          value={rating ? `${rating.rating} / 5` : "None yet"}
          hint={rating ? formatMonth(rating.month) : "No feedback received"}
          icon={CalendarClock}
          loading={showSkeleton}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <h2 className="mb-2 text-base font-semibold text-ink">Salary breakdown</h2>
          {salary ? (
            <div>
              <SalaryRow label="Base salary" value={formatCurrency(salary.baseSalary)} />
              <SalaryRow label="Bonuses" value={`+ ${formatCurrency(salary.bonusTotal)}`} />
              <SalaryRow label="Advances" value={`− ${formatCurrency(salary.advanceTotal)}`} />
              <SalaryRow label="Already paid" value={`− ${formatCurrency(salary.paid)}`} />
              <SalaryRow label="Due" value={formatCurrency(salary.due)} strong />
            </div>
          ) : (
            <EmptyState title="Salary not set" message="Your admin hasn't set your salary yet." />
          )}
        </Card>

        <Card>
          <h2 className="mb-2 text-base font-semibold text-ink">Latest feedback</h2>
          {rating ? (
            <div className="pt-2">
              <p className="text-3xl font-semibold text-ink">{rating.rating} / 5</p>
              <p className="mt-1 text-xs text-ink-muted">{formatMonth(rating.month)}</p>
              <p className="mt-4 text-sm leading-relaxed text-ink">{rating.remarks}</p>
            </div>
          ) : (
            <EmptyState title="No feedback yet" message="Your manager's ratings will appear here." />
          )}
        </Card>
      </div>
    </div>
  );
};

export default EmployeeDashboard;