function DriverList({ drivers, onEdit, onDelete }) {
  if (drivers.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">👤</div>
        <div className="empty-state-title">No drivers found</div>
        <p>Add your first driver to get started</p>
      </div>
    )
  }

  return (
    <div className="card">
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>License Number</th>
            <th>Phone</th>
            <th>Email</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {drivers.map((driver) => (
            <tr key={driver.id}>
              <td>{driver.firstName} {driver.lastName}</td>
              <td>{driver.licenseNumber}</td>
              <td>{driver.phone}</td>
              <td>{driver.email}</td>
              <td>{driver.status}</td>
              <td>
                <button
                  className="btn btn-secondary"
                  onClick={() => onEdit(driver)}
                  style={{ marginRight: '5px' }}
                >
                  Edit
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => onDelete(driver.id)}
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

export default DriverList
