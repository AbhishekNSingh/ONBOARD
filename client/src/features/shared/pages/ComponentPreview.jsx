import { useState } from "react";
import { Users, IndianRupee, Calendar, Plus, Inbox } from "lucide-react";
import Button from "../components/Button";
import Card from "../components/Card";
import PageHeader from "../components/PageHeader";
import StatCard from "../components/StatCard";
import Badge, { statusTone } from "../components/Badge";
import Table from "../components/Table";
import EmptyState from "../components/EmptyState";
import Skeleton from "../components/Skeleton";
import ErrorMessage from "../components/ErrorMessage";

// Visual demonstration page showcasing all shared design system components
const ComponentPreview = () => {
  const [retryNotice, setRetryNotice] = useState("");

  const handleRetry = () => {
    setRetryNotice("Retry triggered successfully.");
  };

  const employeeColumns = [
    { key: "name", header: "Employee" },
    { key: "role", header: "Role and department" },
    { key: "salary", header: "Monthly stipend" },
    {
      key: "status",
      header: "Leave status",
      render: (row) => (
        <Badge tone={statusTone(row.status)}>{row.statusLabel}</Badge>
      ),
    },
  ];

  const sampleEmployees = [
    {
      _id: "emp-1",
      name: "Aarav Sharma",
      role: "Senior backend developer",
      salary: "₹1,42,000",
      status: "approved",
      statusLabel: "Approved",
    },
    {
      _id: "emp-2",
      name: "Priya Patel",
      role: "Product designer",
      salary: "₹94,500",
      status: "pending",
      statusLabel: "Pending",
    },
    {
      _id: "emp-3",
      name: "Rohan Mehta",
      role: "Quality analyst",
      salary: "₹72,000",
      status: "rejected",
      statusLabel: "Rejected",
    },
    {
      _id: "emp-4",
      name: "Ananya Iyer",
      role: "Frontend engineer",
      salary: "₹85,000",
      status: "leave",
      statusLabel: "On leave",
    },
  ];

  return (
    <div className="min-h-screen bg-canvas p-4 sm:p-6 lg:p-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        {/* Page header with action */}
        <PageHeader
          title="Component preview"
          subtitle="Overview of shared UI design system components"
          action={
            <Button
              variant="primary"
              className="sm:w-auto"
              type="button"
            >
              <span className="inline-flex items-center gap-1.5">
                <Plus className="h-4 w-4" aria-hidden="true" />
                Add employee
              </span>
            </Button>
          }
        />

        {/* Row of 3 StatCards with one in loading state */}
        <section aria-labelledby="section-stats">
          <h2 id="section-stats" className="sr-only">
            Statistics summary
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <StatCard
              label="Active employees"
              value="148"
              icon={Users}
              hint="12 joined this quarter"
              loading={false}
            />
            <StatCard
              label="Monthly payroll"
              value="₹1,42,000"
              icon={IndianRupee}
              hint="Disbursed on 1st of month"
              loading={false}
            />
            <StatCard
              label="Pending requests"
              value="9"
              icon={Calendar}
              hint="Awaiting administrative review"
              loading={true}
            />
          </div>
        </section>

        {/* Table with 4 sample rows and Badge column */}
        <section aria-labelledby="section-table" className="flex flex-col gap-3">
          <div className="flex flex-col gap-0.5">
            <h2 id="section-table" className="text-base font-semibold text-ink">
              Employee directory
            </h2>
            <p className="text-sm text-ink-muted">
              Recent employee records with associated leave status
            </p>
          </div>
          <Table columns={employeeColumns} rows={sampleEmployees} />
        </section>

        {/* Empty Table */}
        <section aria-labelledby="section-empty-table" className="flex flex-col gap-3">
          <div className="flex flex-col gap-0.5">
            <h2
              id="section-empty-table"
              className="text-base font-semibold text-ink"
            >
              Empty table state
            </h2>
            <p className="text-sm text-ink-muted">
              Table display when no data rows are returned
            </p>
          </div>
          <Table
            columns={employeeColumns}
            rows={[]}
            emptyMessage="No pending leave applications"
          />
        </section>

        {/* Standalone EmptyState */}
        <section aria-labelledby="section-empty-state" className="flex flex-col gap-3">
          <div className="flex flex-col gap-0.5">
            <h2
              id="section-empty-state"
              className="text-base font-semibold text-ink"
            >
              Empty state
            </h2>
            <p className="text-sm text-ink-muted">
              Standalone placeholder for zero data views
            </p>
          </div>
          <Card>
            <EmptyState
              icon={Inbox}
              title="No archival records found"
              message="Archived payroll reports and audit trails will appear here once generated."
              action={
                <Button
                  variant="ghost"
                  className="sm:w-auto"
                  type="button"
                >
                  Generate report
                </Button>
              }
            />
          </Card>
        </section>

        {/* Error message with onRetry */}
        <section aria-labelledby="section-errors" className="flex flex-col gap-3">
          <div className="flex flex-col gap-0.5">
            <h2
              id="section-errors"
              className="text-base font-semibold text-ink"
            >
              Error feedback
            </h2>
            <p className="text-sm text-ink-muted">
              Alert notification box with optional action retry
            </p>
          </div>
          <ErrorMessage
            message="Unable to sync attendance records with the biometric server."
            onRetry={handleRetry}
          />
          {retryNotice && (
            <p className="text-xs font-medium text-ok">{retryNotice}</p>
          )}
        </section>

        {/* All Badge tones */}
        <section aria-labelledby="section-badges" className="flex flex-col gap-3">
          <div className="flex flex-col gap-0.5">
            <h2
              id="section-badges"
              className="text-base font-semibold text-ink"
            >
              All badge tones
            </h2>
            <p className="text-sm text-ink-muted">
              Semantic status pills mapped to design system color tones
            </p>
          </div>
          <Card>
            <div className="flex flex-col gap-4">
              <div className="flex flex-wrap items-center gap-2">
                <Badge tone="neutral">Neutral tone</Badge>
                <Badge tone="success">Success tone</Badge>
                <Badge tone="warning">Warning tone</Badge>
                <Badge tone="danger">Danger tone</Badge>
                <Badge tone="info">Info tone</Badge>
              </div>

              <div className="border-t border-line pt-4">
                <span className="text-xs font-medium text-ink-muted">
                  Helper status tone mapping:
                </span>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <Badge tone={statusTone("pending")}>pending</Badge>
                  <Badge tone={statusTone("approved")}>approved</Badge>
                  <Badge tone={statusTone("paid")}>paid</Badge>
                  <Badge tone={statusTone("present")}>present</Badge>
                  <Badge tone={statusTone("rejected")}>rejected</Badge>
                  <Badge tone={statusTone("failed")}>failed</Badge>
                  <Badge tone={statusTone("absent")}>absent</Badge>
                  <Badge tone={statusTone("leave")}>leave</Badge>
                  <Badge tone={statusTone("custom")}>custom</Badge>
                </div>
              </div>
            </div>
          </Card>
        </section>

        {/* Skeleton standalone demo */}
        <section aria-labelledby="section-skeleton" className="flex flex-col gap-3">
          <div className="flex flex-col gap-0.5">
            <h2
              id="section-skeleton"
              className="text-base font-semibold text-ink"
            >
              Skeleton loading blocks
            </h2>
            <p className="text-sm text-ink-muted">
              Placeholder elements displayed while async content is being fetched
            </p>
          </div>
          <Card>
            <div className="flex flex-col gap-3">
              <Skeleton className="h-5 w-48" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </Card>
        </section>
      </div>
    </div>
  );
};

export default ComponentPreview;
