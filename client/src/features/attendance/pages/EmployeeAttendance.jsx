import { useEffect, useMemo, useState } from "react";
import { useAttendance } from "../hooks/useAttendance";
import PageHeader from "../../shared/components/PageHeader";
import Input from "../../shared/components/Input";
import ErrorMessage from "../../shared/components/ErrorMessage";
import AttendanceSummary from "../components/AttendanceSummary";
import RecordsTable from "../components/RecordsTable";
import { currentMonthString, formatMonth } from "../../shared/utils/format";

const EmployeeAttendance = () => {
  const { myRecords, myLoading, myError, loadMyRecords } = useAttendance();
  const [month, setMonth] = useState(currentMonthString());

  useEffect(() => {
    loadMyRecords();
  }, [loadMyRecords]);

  // the backend sends everything, so we pick the chosen month here
  const records = useMemo(
    () => myRecords.filter((r) => r.date.startsWith(month)),
    [myRecords, month]
  );

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Attendance" subtitle={`Your records for ${formatMonth(month)}`} />

      <div className="max-w-xs">
        <Input
          id="att-month"
          label="Month"
          type="month"
          value={month}
          max={currentMonthString()}
          onChange={(e) => e.target.value && setMonth(e.target.value)}
        />
      </div>

      {myError && <ErrorMessage message={myError} onRetry={loadMyRecords} />}

      <AttendanceSummary records={records} loading={myLoading && myRecords.length === 0} />
      <RecordsTable records={records} loading={myLoading} />
    </div>
  );
};

export default EmployeeAttendance;