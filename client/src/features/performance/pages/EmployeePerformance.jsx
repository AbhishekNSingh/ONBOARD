import { useEffect } from "react";
import { Star } from "lucide-react";
import { usePerformance } from "../hooks/usePerformance";
import PageHeader from "../../shared/components/PageHeader";
import StatCard from "../../shared/components/StatCard";
import Table from "../../shared/components/Table";
import ErrorMessage from "../../shared/components/ErrorMessage";
import { formatMonth } from "../../shared/utils/format";

const columns = [
  { key: "month", header: "Month", render: (row) => formatMonth(row.month) },
  {
    key: "rating",
    header: "Rating",
    render: (row) => <span className="font-medium">{row.rating} / 5</span>,
  },
  { key: "remarks", header: "Remarks", className: "min-w-[220px]" },
  { key: "givenBy", header: "From", render: (row) => row.givenBy?.name ?? "—" },
];

const EmployeePerformance = () => {
  const { myRatings, loading, error, loadMyRatings } = usePerformance();

  useEffect(() => {
    loadMyRatings();
  }, [loadMyRatings]);

  const average =
    myRatings.length > 0
      ? (myRatings.reduce((sum, r) => sum + r.rating, 0) / myRatings.length).toFixed(1)
      : null;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Performance" subtitle="Feedback from your manager" />

      {error && <ErrorMessage message={error} onRetry={loadMyRatings} />}

      <div className="grid gap-4 sm:grid-cols-2">
        <StatCard
          label="Average rating"
          value={average ? `${average} / 5` : "None yet"}
          hint={`${myRatings.length} review${myRatings.length === 1 ? "" : "s"}`}
          icon={Star}
          loading={loading && myRatings.length === 0}
        />
      </div>

      <Table
        columns={columns}
        rows={myRatings}
        loading={loading && myRatings.length === 0}
        emptyMessage="No feedback yet"
      />
    </div>
  );
};

export default EmployeePerformance;