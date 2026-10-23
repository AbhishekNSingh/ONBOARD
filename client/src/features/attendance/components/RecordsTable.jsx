import Table from "../../shared/components/Table";
import Badge, { statusTone } from "../../shared/components/Badge";
import { formatDate } from "../../shared/utils/format";

const columns = [
  { key: "date", header: "Date", render: (row) => formatDate(row.date) },
  {
    key: "status",
    header: "Status",
    render: (row) => (
      <Badge tone={statusTone(row.status)} className="capitalize">
        {row.status}
      </Badge>
    ),
  },
];

const RecordsTable = ({ records, loading }) => (
  <Table
    columns={columns}
    rows={records}
    loading={loading && records.length === 0}
    emptyMessage="No attendance records for this month"
  />
);

export default RecordsTable;