import Card from "./Card";
import Skeleton from "./Skeleton";
import EmptyState from "./EmptyState";

// Data table rendered inside an unpadded card with horizontal scroll and skeleton state
const Table = ({
  columns = [],
  rows = [],
  rowKey = "_id",
  emptyMessage = "No records found",
  loading = false,
  className = "",
}) => {
  const hasRows = Array.isArray(rows) && rows.length > 0;

  return (
    <Card padding={false} className={className}>
      {!loading && !hasRows ? (
        <EmptyState title={emptyMessage} />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-line text-xs font-medium text-ink-muted">
                {columns.map((column, index) => (
                  <th
                    key={column.key || index}
                    scope="col"
                    className={`px-4 py-3 sm:px-6 font-medium ${column.className || ""}`}
                  >
                    {column.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="text-sm text-ink">
              {loading
                ? Array.from({ length: 5 }).map((_, rowIndex) => (
                    <tr
                      key={`skeleton-${rowIndex}`}
                      className="border-t border-line"
                    >
                      {columns.map((column, colIndex) => (
                        <td
                          key={column.key || colIndex}
                          className={`px-4 py-3.5 sm:px-6 ${column.className || ""}`}
                        >
                          <Skeleton className="h-4 w-3/4 max-w-[120px]" />
                        </td>
                      ))}
                    </tr>
                  ))
                : rows.map((row, rowIndex) => {
                    const key =
                      row && row[rowKey] != null ? row[rowKey] : rowIndex;
                    return (
                      <tr
                        key={key}
                        className="border-t border-line transition-colors hover:bg-soft/50"
                      >
                        {columns.map((column, colIndex) => (
                          <td
                            key={column.key || colIndex}
                            className={`px-4 py-3.5 sm:px-6 ${column.className || ""}`}
                          >
                            {column.render
                              ? column.render(row)
                              : row[column.key]}
                          </td>
                        ))}
                      </tr>
                    );
                  })}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
};

export default Table;
