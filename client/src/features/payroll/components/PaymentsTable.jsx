import Table from "../../shared/components/Table";
import Badge, { statusTone } from "../../shared/components/Badge";
import { formatCurrency, formatISODate } from "../../shared/utils/format";

const columns = [
  { key: "createdAt", header: "Date", render: (row) => formatISODate(row.createdAt) },
  { key: "amount", header: "Amount", render: (row) => formatCurrency(row.amount) },
  {
    key: "status",
    header: "Status",
    render: (row) => (
      <Badge tone={statusTone(row.status)} className="capitalize">
        {row.status}
      </Badge>
    ),
  },
  { key: "paidBy", header: "Paid by", render: (row) => row.paidBy?.name ?? "—" },
  { key: "note", header: "Note", render: (row) => row.note || "—" },
];

const PaymentsTable = ({ payments, loading }) => (
  <Table
    columns={columns}
    rows={payments}
    loading={loading && payments.length === 0}
    emptyMessage="No payments this month"
  />
);

export default PaymentsTable;