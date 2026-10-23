import { useEffect, useState } from "react";
import { useAttendance } from "../../attendance/hooks/useAttendance";
import { usePerformance } from "../hooks/usePerformance";
import PageHeader from "../../shared/components/PageHeader";
import Card from "../../shared/components/Card";
import Select from "../../shared/components/Select";
import Input from "../../shared/components/Input";
import Textarea from "../../shared/components/Textarea";
import Button from "../../shared/components/Button";
import ErrorMessage from "../../shared/components/ErrorMessage";
import { currentMonthString } from "../../shared/utils/format";

const emptyForm = {
  employeeId: "",
  month: currentMonthString(),
  rating: "",
  remarks: "",
};

const ManagerPerformance = () => {
  const { team, teamError, loadTeam } = useAttendance();
  const { giveRating } = usePerformance();

  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    loadTeam();
  }, [loadTeam]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
    setNotice("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      await giveRating({
        employeeId: form.employeeId,
        month: form.month,
        rating: Number(form.rating),
        remarks: form.remarks.trim(),
      });
      setNotice("Rating saved. Your employee can see it now.");
      setForm({ ...emptyForm, month: form.month, employeeId: form.employeeId });
    } catch (message) {
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Performance"
        subtitle="Give your team a monthly rating. One rating per person per month."
      />

      {teamError && <ErrorMessage message={teamError} onRetry={loadTeam} />}

      <Card className="max-w-xl">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <Select
            id="perf-employee"
            label="Employee"
            name="employeeId"
            value={form.employeeId}
            onChange={handleChange}
            required
          >
            <option value="" disabled>
              {team.length === 0 ? "No one reports to you yet" : "Select employee"}
            </option>
            {team.map((member) => (
              <option key={member._id} value={member._id}>
                {member.name}
              </option>
            ))}
          </Select>

          <div className="grid gap-5 sm:grid-cols-2">
            <Input
              id="perf-month"
              label="Month"
              type="month"
              name="month"
              value={form.month}
              max={currentMonthString()}
              onChange={handleChange}
              required
            />
            <Select
              id="perf-rating"
              label="Rating"
              name="rating"
              value={form.rating}
              onChange={handleChange}
              required
            >
              <option value="" disabled>
                Select rating
              </option>
              {[5, 4, 3, 2, 1].map((n) => (
                <option key={n} value={n}>
                  {n} / 5
                </option>
              ))}
            </Select>
          </div>

          <Textarea
            id="perf-remarks"
            label="Remarks"
            name="remarks"
            value={form.remarks}
            onChange={handleChange}
            placeholder="What went well, and what to improve"
            maxLength={500}
            required
          />

          {error && (
            <p className="rounded-lg bg-bad-bg px-3.5 py-2.5 text-sm text-bad">{error}</p>
          )}
          {notice && (
            <p className="rounded-lg bg-ok-bg px-3.5 py-2.5 text-sm text-ok" role="status">
              {notice}
            </p>
          )}

          <div className="sm:w-44">
            <Button type="submit" loading={saving}>
              Save rating
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default ManagerPerformance;