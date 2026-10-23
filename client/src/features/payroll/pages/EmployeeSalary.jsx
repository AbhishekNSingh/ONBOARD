import { useEffect, useState } from "react";
import { usePayroll } from "../hooks/usePayroll";
import PageHeader from "../../shared/components/PageHeader";
import Input from "../../shared/components/Input";
import Table from "../../shared/components/Table";
import ErrorMessage from "../../shared/components/ErrorMessage";
import SalaryBreakdown from "../components/SalaryBreakdown";
import PaymentsTable from "../components/PaymentsTable";
import { currentMonthString, formatCurrency, formatISODate, formatMonth } from "../../shared/utils/format";

const moneyColumns = (noteHeader) => [
  { key: "createdAt", header: "Date", render: (row) => formatISODate(row.createdAt) },
  { key: "amount", header: "Amount", render: (row) => formatCurrency(row.amount) },
  { key: "reason", header: noteHeader, render: (row) => row.reason || "—" },
  { key: "givenBy", header: "From", render: (row) => row.givenBy?.name ?? "—" },
];

const bonusColumns = moneyColumns("Reason");
const advanceColumns = moneyColumns("Reason");

const EmployeeSalary = () => {
  const { mine, mineLoading, mineError, loadMyPayroll } = usePayroll();
  const [month, setMonth] = useState(currentMonthString());

  useEffect(() => {
    loadMyPayroll(month);
  }, [loadMyPayroll, month]);

  const first = mineLoading && !mine.summary && mine.payments.length === 0;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Salary" subtitle={`Your pay for ${formatMonth(month)}`} />

      <div className="max-w-xs">
        <Input
          id="salary-month"
          label="Month"
          type="month"
          value={month}
          onChange={(e) => e.target.value && setMonth(e.target.value)}
        />
      </div>

      {mineError && <ErrorMessage message={mineError} onRetry={() => loadMyPayroll(month)} />}

      <SalaryBreakdown summary={mine.summary} loading={first} />

      <section className="flex flex-col gap-3">
        <h2 className="text-base font-semibold text-ink">Payments</h2>
        <PaymentsTable payments={mine.payments} loading={mineLoading} />
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-base font-semibold text-ink">Bonuses</h2>
        <Table
          columns={bonusColumns}
          rows={mine.bonuses}
          loading={mineLoading && mine.bonuses.length === 0}
          emptyMessage="No bonuses this month"
        />
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-base font-semibold text-ink">Advances</h2>
        <Table
          columns={advanceColumns}
          rows={mine.advances}
          loading={mineLoading && mine.advances.length === 0}
          emptyMessage="No advances this month"
        />
      </section>
    </div>
  );
};

export default EmployeeSalary;