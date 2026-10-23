import Card from "../../shared/components/Card";
import EmptyState from "../../shared/components/EmptyState";
import Skeleton from "../../shared/components/Skeleton";
import { formatCurrency } from "../../shared/utils/format";

const Row = ({ label, value, strong = false }) => (
  <div className="flex items-center justify-between border-t border-line py-3 first:border-t-0">
    <span className="text-sm text-ink-muted">{label}</span>
    <span className={`text-sm ${strong ? "font-semibold text-ink" : "text-ink"}`}>{value}</span>
  </div>
);

const SalaryBreakdown = ({ summary, loading, title = "Salary breakdown" }) => (
  <Card>
    <h2 className="mb-2 text-base font-semibold text-ink">{title}</h2>

    {loading ? (
      <div className="flex flex-col gap-3 py-2">
        {[1, 2, 3, 4, 5].map((n) => (
          <Skeleton key={n} className="h-5 w-full" />
        ))}
      </div>
    ) : summary ? (
      <div>
        <Row label="Base salary" value={formatCurrency(summary.baseSalary)} />
        <Row label="Bonuses" value={`+ ${formatCurrency(summary.bonusTotal)}`} />
        <Row label="Advances" value={`− ${formatCurrency(summary.advanceTotal)}`} />
        <Row label="Already paid" value={`− ${formatCurrency(summary.paid)}`} />
        <Row label="Due" value={formatCurrency(summary.due)} strong />
      </div>
    ) : (
      <EmptyState title="Salary not set" message="An admin needs to set a salary first." />
    )}
  </Card>
);

export default SalaryBreakdown;