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
              <td>{vehicle.make}</td>
              <td>{vehicle.model}</td>
              <td>{vehicle.licensePlate}</td>
              <td>{vehicle.year}</td>
              <td>{vehicle.mileage} km</td>
              <td>{vehicle.status}</td>
              <td>
                <button
                  className="btn btn-secondary"
                  onClick={() => onEdit(vehicle)}
                  style={{ marginRight: '5px' }}
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
