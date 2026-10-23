import { CalendarCheck, CalendarX, PlaneTakeoff } from "lucide-react";
import StatCard from "../../shared/components/StatCard";

const AttendanceSummary = ({ records, loading }) => {
  const count = (status) => records.filter((r) => r.status === status).length;

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <StatCard label="Present" value={count("present")} icon={CalendarCheck} loading={loading} />
      <StatCard label="Absent" value={count("absent")} icon={CalendarX} loading={loading} />
      <StatCard label="On leave" value={count("leave")} icon={PlaneTakeoff} loading={loading} />
    </div>
  );
};

export default AttendanceSummary;