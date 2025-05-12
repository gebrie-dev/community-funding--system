import "./AdminTable.css"

const AdminTable = ({ columns, data, loading, emptyMessage = "No data available" }) => {
  if (loading) {
    return (
      <div className="admin-table-loading">
        <div className="loading-spinner"></div>
        <p>Loading data...</p>
      </div>
    )
  }

  if (!data || data.length === 0) {
    return (
      <div className="admin-table-empty">
        <p>{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className="admin-table-container">
      <table className="admin-table">
        <thead>
          <tr>
            {columns.map((column, index) => (
              <th key={index}>{column.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {columns.map((column, colIndex) => (
                <td key={colIndex}>{column.cell ? column.cell(row[column.accessor], row) : row[column.accessor]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default AdminTable
