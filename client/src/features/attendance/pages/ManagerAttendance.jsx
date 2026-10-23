import { useEffect, useState } from "react";
import { useAttendance } from "../hooks/useAttendance";
import PageHeader from "../../shared/components/PageHeader";
import Input from "../../shared/components/Input";
import Table from "../../shared/components/Table";
import Badge, { statusTone } from "../../shared/components/Badge";
import ErrorMessage from "../../shared/components/ErrorMessage";
import { todayString, formatDate } from "../../shared/utils/format";

const choices = [
  { value: "present", label: "Present" },
  { value: "absent", label: "Absent" },
  { value: "leave", label: "Leave" },
];

const ManagerAttendance = () => {
  const {
    team,
    teamLoading,
    teamError,
    marked,
    markingId,
    markError,
    loadTeam,
    mark,
    resetMarks,
  } = useAttendance();

  const [date, setDate] = useState(todayString());

  useEffect(() => {
    resetMarks();
    loadTeam();
  }, [loadTeam, resetMarks]);

  const changeDate = (value) => {
    if (!value) return;
    setDate(value);
    resetMarks(); // the "saved" ticks belong to the old date
  };

  const columns = [
    {
      key: "employee",
      header: "Employee",
      render: (row) => (
        <div>
          <p className="font-medium text-ink">{row.name}</p>
          <p className="text-xs text-ink-muted">{row.email}</p>
        </div>
      ),
    },
    {
      key: "mark",
      header: "Mark attendance",
      render: (row) => {
        const current = marked[row._id];
        const busy = markingId === row._id;
        return (
          <div className="flex flex-wrap items-center gap-2">
            {choices.map((c) => (
              <button
                key={c.value}
                type="button"
                disabled={busy}
                aria-pressed={current === c.value}
                onClick={() => mark(row._id, date, c.value)}
                className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${
                  current === c.value
                    ? "border-primary bg-soft text-primary"
                    : "border-line text-ink-muted hover:bg-soft hover:text-ink"
                }`}
              >
                {c.label}
              </button>
            ))}
            {current && (
              <Badge tone={statusTone(current)} className="capitalize">
                Saved
              </Badge>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Attendance"
        subtitle={`Mark your team for ${formatDate(date)}. Marking a day again updates it.`}
      />

      <div className="max-w-xs">
        <Input
          id="att-date"
          label="Date"
          type="date"
          value={date}
          max={todayString()}
          onChange={(e) => changeDate(e.target.value)}
        />
      </div>

      {teamError && <ErrorMessage message={teamError} onRetry={loadTeam} />}
      {markError && <ErrorMessage message={markError} />}

      <Table
        columns={columns}
        rows={team}
        loading={teamLoading && team.length === 0}
        emptyMessage="No one reports to you yet"
      />
    </div>
  );
};

export default ManagerAttendance;