import { useEffect } from "react";
import { Check, X } from "lucide-react";
import { useLeaves } from "../hooks/useLeaves";
import PageHeader from "../../shared/components/PageHeader";
import Table from "../../shared/components/Table";
import Button from "../../shared/components/Button";
import ErrorMessage from "../../shared/components/ErrorMessage";
import { formatDate, daysBetween } from "../../shared/utils/format";

const LeaveInbox = ({ title, subtitle }) => {
  const {
    pendingLeaves,
    pendingLoading,
    pendingError,
    decidingId,
    decideError,
    loadPendingLeaves,
    decide,
    resetDecideError,
  } = useLeaves();

  useEffect(() => {
    resetDecideError();
    loadPendingLeaves();
  }, [loadPendingLeaves, resetDecideError]);

  const retry = () => {
    resetDecideError();
    loadPendingLeaves();
  };

  const columns = [
    {
      key: "requester",
      header: "Employee",
      render: (leave) => (
        <div>
          <p className="font-medium text-ink">{leave.requester?.name}</p>
          <p className="text-xs text-ink-muted">{leave.requester?.email}</p>
        </div>
      ),
    },
    {
      key: "dates",
      header: "Dates",
      render: (leave) => (
        <span className="whitespace-nowrap">
          {formatDate(leave.fromDate)}
          {leave.toDate !== leave.fromDate && ` – ${formatDate(leave.toDate)}`}
        </span>
      ),
    },
    {
      key: "days",
      header: "Days",
      render: (leave) => daysBetween(leave.fromDate, leave.toDate),
    },
    { key: "reason", header: "Reason", className: "min-w-[180px]" },
    {
      key: "actions",
      header: "Decision",
      render: (leave) => {
        const busy = decidingId === leave._id;
        return (
          <div className="flex gap-2">
            <div className="w-28">
              <Button
                loading={busy}
                disabled={busy}
                onClick={() => decide(leave._id, "approved")}
                className="flex items-center justify-center gap-1.5 !py-2"
              >
                <Check size={15} aria-hidden="true" />
                Approve
              </Button>
            </div>
            <div className="w-28">
              <Button
                variant="ghost"
                disabled={busy}
                onClick={() => decide(leave._id, "rejected")}
                className="flex items-center justify-center gap-1.5 !py-2"
              >
                <X size={15} aria-hidden="true" />
                Reject
              </Button>
            </div>
          </div>
        );
      },
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title={title} subtitle={subtitle} />

      { pendingError && <ErrorMessage message={pendingError} onRetry={loadPendingLeaves} />}
      {decideError && <ErrorMessage message={decideError} onRetry={retry} />}

      <Table
        columns={columns}
        rows={pendingLeaves}
        loading={pendingLoading && pendingLeaves.length === 0}
        emptyMessage="You're all caught up. No requests are waiting."
      />
    </div>
  );
};

export default LeaveInbox;