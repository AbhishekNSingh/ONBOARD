import { useEffect, useState } from "react";
import { CalendarPlus} from "lucide-react";
import { useLeaves } from "../hooks/useLeaves";
import LeaveForm from "../components/LeaveForm";
import PageHeader from "../../shared/components/PageHeader";
import Table from "../../shared/components/Table";
import Badge, { statusTone } from "../../shared/components/Badge";
import Button from "../../shared/components/Button";
import ErrorMessage from "../../shared/components/ErrorMessage";
import { formatDate, daysBetween } from "../../shared/utils/format";

const columns = [
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
    key: "status",
    header: "Status",
    render: (leave) => (
      <Badge tone={statusTone(leave.status)} className="capitalize">
        {leave.status}
      </Badge>
    ),
  },
  {
    key: "decidedBy",
    header: "Decided by",
    render: (leave) => leave.decidedBy?.name ?? "—",
  },
];

const LeavesPage = () => {
  const { myLeaves, loading, error, loadMyLeaves } = useLeaves();
  const [showForm, setShowForm] = useState(false);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    loadMyLeaves();
  }, [loadMyLeaves]);

  const handleSuccess = () => {
    setShowForm(false);
    setNotice("Leave request sent. You'll see the decision here.");
  };

  const openForm = () => {
    setNotice("");
    setShowForm(true);
  };

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Leaves"
        subtitle="Your leave requests and their status"
        action={
          !showForm && (
            <Button onClick={openForm} className="flex items-center justify-center gap-2">
              <CalendarPlus size={16} aria-hidden="true" />
              Request leave
            </Button>
          )
        }
      />

      {notice && (
        <p className="rounded-lg bg-ok-bg px-4 py-3 text-sm text-ok" role="status">
          {notice}
        </p>
      )}

      {showForm && (
        <LeaveForm onSuccess={handleSuccess} onCancel={() => setShowForm(false)} />
      )}

      {error && <ErrorMessage message={error} onRetry={loadMyLeaves} />}

      <Table
        columns={columns}
        rows={myLeaves}
        loading={loading && myLeaves.length === 0}
        emptyMessage="No leave requests yet"
      />
    </div>
  );
};

export default LeavesPage;