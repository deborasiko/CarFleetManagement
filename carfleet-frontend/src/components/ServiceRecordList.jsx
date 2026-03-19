function ServiceRecordList({ records, onEdit, onDelete }) {
  if (records.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">🔧</div>
        <div className="empty-state-title">No service records found</div>
        <p>Add your first service record to get started</p>
      </div>
    )
  }

  return (
    <div className="card">
      <table className="table">
        <thead>
          <tr>
            <th>Vehicle</th>
            <th>Service Type</th>
            <th>Date</th>
            <th>Mileage</th>
            <th>Cost</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {records.map((record) => (
            <tr key={record.id}>
              <td>{record.vehicleId}</td>
              <td>{record.serviceType}</td>
              <td>{new Date(record.date).toLocaleDateString()}</td>
              <td>{record.mileage} km</td>
              <td>${record.cost.toFixed(2)}</td>
              <td>{record.description}</td>
              <td>
                <button
                  className="btn btn-secondary"
                  onClick={() => onEdit(record)}
                  style={{ marginRight: '5px' }}
                >
                  Edit
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => onDelete(record.id)}
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

export default ServiceRecordList
