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
              <td data-label="Name">{driver.firstName} {driver.lastName}</td>
              <td data-label="License Number">{driver.licenseNumber}</td>
              <td data-label="Phone">{driver.phone}</td>
              <td data-label="Email">{driver.email}</td>
              <td data-label="Status">{driver.status}</td>
              <td data-label="Actions">
                <button
                  className="btn btn-secondary"
                  onClick={() => onEdit(driver)}
                  style={{ marginRight: '5px', marginBottom: '5px' }}
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
