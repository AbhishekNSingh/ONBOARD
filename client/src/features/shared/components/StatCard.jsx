import { isValidElement } from "react";
import Card from "./Card";
import Skeleton from "./Skeleton";

// Metric card displaying a single statistic with optional icon, hint, and loading state
const StatCard = ({
  label,
  value,
  icon: Icon,
  hint,
  loading = false,
  className = "",
}) => {
  return (
    <Card className={className}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <span className="text-sm text-ink-muted">{label}</span>
          {loading ? (
            <Skeleton className="my-0.5 h-8 w-28" />
          ) : (
            <span className="text-2xl font-semibold text-ink">{value}</span>
          )}
        </div>

        {Icon && (
          <div
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-soft text-primary"
            aria-hidden="true"
          >
            {isValidElement(Icon) ? Icon : <Icon className="h-5 w-5" />}
          </div>
        )}
      </div>

      {hint && <p className="mt-3 text-xs text-ink-muted">{hint}</p>}
    </Card>
  );
};

export default StatCard;
