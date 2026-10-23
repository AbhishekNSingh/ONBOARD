import { useEffect, useState } from "react";
import { useAttendance } from "../../attendance/hooks/useAttendance";
import { usePayroll } from "../hooks/usePayroll";
import PageHeader from "../../shared/components/PageHeader";
import Select from "../../shared/components/Select";
import Input from "../../shared/components/Input";
import ErrorMessage from "../../shared/components/ErrorMessage";
import EmptyState from "../../shared/components/EmptyState";
import SalaryBreakdown from "../components/SalaryBreakdown";
import PaymentsTable from "../components/PaymentsTable";
import AmountForm from "../components/AmountForm";
import { currentMonthString, formatCurrency, formatMonth } from "../../shared/utils/format";

const ManagerPayroll = () => {
  const { team, teamError, loadTeam } = useAttendance();
  const {
    selected,
    selectedLoading,
    selectedError,
    loadEmployeePayroll,
    addBonus,
    addAdvance,
    addPayment,
  } = usePayroll();

  const [employeeId, setEmployeeId] = useState("");
  const [month, setMonth] = useState(currentMonthString());

  useEffect(() => {
    loadTeam();
  }, [loadTeam]);

  useEffect(() => {
    if (employeeId) loadEmployeePayroll(employeeId, month);
  }, [loadEmployeePayroll, employeeId, month]);

  const summary = selected.summary;
  const hasSalary = Boolean(summary);
  const firstLoad = selectedLoading && !summary && selected.payments.length === 0;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Payroll"
        subtitle="Give bonuses, record advances and pay your team"
      />

      {teamError && <ErrorMessage message={teamError} onRetry={loadTeam} />}

      <div className="grid max-w-2xl gap-5 sm:grid-cols-2">
        <Select
          id="pay-employee"
          label="Employee"
          value={employeeId}
          onChange={(e) => setEmployeeId(e.target.value)}
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

        <Input
          id="pay-month"
          label="Month"
          type="month"
          value={month}
          onChange={(e) => e.target.value && setMonth(e.target.value)}
        />
      </div>

      {!employeeId && (
        <EmptyState
          title="Choose an employee"
          message="Pick someone from your team to see their pay and take action."
        />
      )}

      {employeeId && (
        <>
          {selectedError && (
            <ErrorMessage
              message={selectedError}
              onRetry={() => loadEmployeePayroll(employeeId, month)}
            />
          )}

          <div className="grid gap-6 lg:grid-cols-2">
            <SalaryBreakdown
              summary={summary}
              loading={firstLoad}
              title={`Pay for ${formatMonth(month)}`}
            />

            <section className="flex flex-col gap-3">
              <h2 className="text-base font-semibold text-ink">Payments this month</h2>
              <PaymentsTable payments={selected.payments} loading={selectedLoading} />
            </section>
          </div>

          {!hasSalary && !firstLoad && (
            <p className="rounded-lg bg-warn-bg px-4 py-3 text-sm text-warn">
              This employee has no salary yet. Ask an admin to set one before paying.
            </p>
          )}

          <div className="grid gap-6 lg:grid-cols-3">
            <AmountForm
              title="Give a bonus"
              description="Adds to this month's pay."
              noteLabel="Reason"
              noteRequired
              submitLabel="Give bonus"
              onSubmit={(amount, note) =>
                addBonus({ employeeId, month, amount, reason: note })
              }
            />
            <AmountForm
              title="Record an advance"
              description="Money given early, deducted from this month's pay."
              noteLabel="Reason (optional)"
              submitLabel="Record advance"
              onSubmit={(amount, note) =>
                addAdvance({ employeeId, month, amount, reason: note })
              }
            />
            <AmountForm
              title="Make a payment"
              description={
                hasSalary
                  ? `Up to ${formatCurrency(summary.due)} is due. To pay more, give a bonus first.`
                  : "Available once a salary is set."
              }
              noteLabel="Note (optional)"
              submitLabel="Pay now"
              disabled={!hasSalary}
              onSubmit={(amount, note) =>
                addPayment({ employeeId, month, amount, note })
              }
            />
          </div>
        </>
      )}
    </div>
  );
};

export default ManagerPayroll;