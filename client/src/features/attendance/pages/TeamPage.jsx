import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useAttendance } from "../hooks/useAttendance";
import PageHeader from "../../shared/components/PageHeader";
import Table from "../../shared/components/Table";
import ErrorMessage from "../../shared/components/ErrorMessage";

const columns = [
  {
    key: "name",
    header: "Employee",
    render: (row) => (
      <div>
        <p className="font-medium text-ink">{row.name}</p>
        <p className="text-xs text-ink-muted">{row.email}</p>
      </div>
    ),
  },
  { key: "contact", header: "Phone" },
  {
    key: "view",
    header: "",
    render: (row) => (
      <Link
        to={`/manager/team/${row._id}`}
        className="text-sm font-medium text-primary hover:underline"
      >
        View attendance
      </Link>
    ),
  },
];

const TeamPage = () => {
  const { team, teamLoading, teamError, loadTeam } = useAttendance();

  useEffect(() => {
    loadTeam();
  }, [loadTeam]);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="My team" subtitle="People who report to you" />
      {teamError && <ErrorMessage message={teamError} onRetry={loadTeam} />}
      <Table
        columns={columns}
        rows={team}
        loading={teamLoading && team.length === 0}
        emptyMessage="No one reports to you yet"
      />
    </div>
  );
};

export default TeamPage;