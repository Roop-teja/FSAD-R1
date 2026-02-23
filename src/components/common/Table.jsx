import './Table.css';

const Table = ({
  columns,
  data,
  onRowClick,
  emptyMessage = 'No data available',
  loading = false,
  className = ''
}) => {
  const classes = [
    'table-wrapper',
    className
  ].filter(Boolean).join(' ');

  if (loading) {
    return (
      <div className={classes}>
        <div className="table-loading">
          <div className="table-spinner"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={classes}>
      <table className="table">
        <thead>
          <tr>
            {columns.map((column, index) => (
              <th
                key={index}
                style={{ width: column.width, textAlign: column.align || 'left' }}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="table-empty">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => (
              <tr
                key={row.id || rowIndex}
                onClick={() => onRowClick && onRowClick(row)}
                className={onRowClick ? 'clickable' : ''}
              >
                {columns.map((column, colIndex) => (
                  <td
                    key={colIndex}
                    style={{ textAlign: column.align || 'left' }}
                  >
                    {column.render ? column.render(row) : row[column.accessor]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;