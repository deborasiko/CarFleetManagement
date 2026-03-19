function FuelLogList({ fuelLogs, onEdit, onDelete }) {
  if (fuelLogs.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">⛽</div>
        <div className="empty-state-title">No fuel logs found</div>
        <p>Add your first fuel log to get started</p>
      </div>
    )
  }

  return (
    <div className="card">
      <table className="table">
        <thead>
          <tr>
            <th>Vehicle</th>
            <th>Date</th>
            <th>Liters</th>
            <th>Cost</th>
            <th>Mileage</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {fuelLogs.map((log) => (
            <tr key={log.id}>
              <td>{log.vehicleId}</td>
              <td>{new Date(log.date).toLocaleDateString()}</td>
              <td>{log.liters} L</td>
              <td>${log.cost.toFixed(2)}</td>
              <td>{log.mileage} km</td>
              <td>
                <button
                  className="btn btn-secondary"
                  onClick={() => onEdit(log)}
                  style={{ marginRight: '5px' }}
                >
                  Edit
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => onDelete(log.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default FuelLogList
