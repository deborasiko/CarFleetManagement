function VehicleList({ vehicles, onEdit, onDelete }) {
  if (vehicles.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">🚗</div>
        <div className="empty-state-title">No vehicles found</div>
        <p>Add your first vehicle to get started</p>
      </div>
    )
  }

  return (
    <div className="card">
      <table className="table">
        <thead>
          <tr>
            <th>Make</th>
            <th>Model</th>
            <th>License Plate</th>
            <th>Year</th>
            <th>Mileage</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {vehicles.map((vehicle) => (
            <tr key={vehicle.id}>
              <td data-label="Make">{vehicle.make}</td>
              <td data-label="Model">{vehicle.model}</td>
              <td data-label="License Plate">{vehicle.licensePlate}</td>
              <td data-label="Year">{vehicle.year}</td>
              <td data-label="Mileage">{vehicle.mileage} km</td>
              <td data-label="Status">{vehicle.status}</td>
              <td data-label="Actions">
                <button
                  className="btn btn-secondary"
                  onClick={() => onEdit(vehicle)}
                  style={{ marginRight: '5px', marginBottom: '5px' }}
                >
                  Edit
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => onDelete(vehicle.id)}
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

export default VehicleList
