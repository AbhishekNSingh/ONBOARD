import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useAttendance } from "../hooks/useAttendance";
import PageHeader from "../../shared/components/PageHeader";
import Input from "../../shared/components/Input";
import ErrorMessage from "../../shared/components/ErrorMessage";
import AttendanceSummary from "../components/AttendanceSummary";
import RecordsTable from "../components/RecordsTable";
import { currentMonthString, formatMonth } from "../../shared/utils/format";

const TeamMemberAttendance = () => {
  const { id } = useParams();
  const {
    team,
    employeeRecords,
    employeeLoading,
    employeeError,
    loadTeam,
    loadEmployeeRecords,
  } = useAttendance();

  const [month, setMonth] = useState(currentMonthString());

  useEffect(() => {
    loadTeam();
  }, [loadTeam]);

  useEffect(() => {
    loadEmployeeRecords(id, month);
  }, [loadEmployeeRecords, id, month]);

  const name = team.find((member) => member._id === id)?.name ?? "Team member";

  return (
    <div className="flex flex-col gap-6">
      <Link
        to="/manager/team"
        className="flex items-center gap-1.5 text-sm text-ink-muted hover:text-ink"
      >
        <ArrowLeft size={16} aria-hidden="true" />
        Back to my team
      </Link>

      <PageHeader title={name} subtitle={`Attendance for ${formatMonth(month)}`} />

      <div className="max-w-xs">
        <Input
          id="member-month"
          label="Month"
          type="month"
          value={month}
          max={currentMonthString()}
          onChange={(e) => e.target.value && setMonth(e.target.value)}
        />
      </div>

      {employeeError && (
        <ErrorMessage message={employeeError} onRetry={() => loadEmployeeRecords(id, month)} />
      )}

      <AttendanceSummary records={employeeRecords} loading={employeeLoading} />
      <RecordsTable records={employeeRecords} loading={employeeLoading} />
    </div>
  );
};

export default TeamMemberAttendance;