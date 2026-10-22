import { useEffect, useState } from "react";
import { useLeaves } from "../hooks/useLeaves";
import Card from "../../shared/components/Card";
import Input from "../../shared/components/Input";
import Textarea from "../../shared/components/Textarea";
import Button from "../../shared/components/Button";
import { todayString } from "../../shared/utils/format";

const LeaveForm = ({ onSuccess, onCancel }) => {
  const { submitting, submitError, requestLeave, resetSubmitError } = useLeaves();

  const [form, setForm] = useState({ fromDate: "", toDate: "", reason: "" });
  const [fieldError, setFieldError] = useState("");

  // clear an old server error when the form opens
  useEffect(() => {
    resetSubmitError();
  }, [resetSubmitError]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setFieldError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // checks the browser can do before bothering the server
    if (form.toDate < form.fromDate) {
      setFieldError("End date can't be before the start date");
      return;
    }

    try {
      await requestLeave({
        fromDate: form.fromDate,
        toDate: form.toDate,
        reason: form.reason.trim(),
      });
      onSuccess();
    } catch {
      // the server's message is already in the store and shown below
    }
  };

  return (
    <Card>
      <h2 className="text-base font-semibold text-ink">Request leave</h2>
      <p className="mt-1 text-sm text-ink-muted">
        Your manager will review it and you'll see the decision here.
      </p>

      <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <Input
            id="leave-from"
            label="From"
            type="date"
            name="fromDate"
            value={form.fromDate}
            onChange={handleChange}
            min={todayString()}
            required
          />
          <Input
            id="leave-to"
            label="To"
            type="date"
            name="toDate"
            value={form.toDate}
            onChange={handleChange}
            min={form.fromDate || todayString()}
            error={fieldError}
            required
          />
        </div>

        <Textarea
          id="leave-reason"
          label="Reason"
          name="reason"
          value={form.reason}
          onChange={handleChange}
          placeholder="For example, a family function"
          maxLength={300}
          required
        />

        {submitError && (
          <p className="rounded-lg bg-bad-bg px-3.5 py-2.5 text-sm text-bad">{submitError}</p>
        )}

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <div className="sm:w-32">
            <Button type="button" variant="ghost" onClick={onCancel}>
              Cancel
            </Button>
          </div>
          <div className="sm:w-40">
            <Button type="submit" loading={submitting}>
              Send request
            </Button>
          </div>
        </div>
      </form>
    </Card>
  );
};

export default LeaveForm;