function TripList({ trips, onEdit, onDelete }) {
  if (trips.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">🛣️</div>
        <div className="empty-state-title">No trips found</div>
        <p>Add your first trip to get started</p>
      </div>
    )
  }

  return (
    <div className="card">
      <table className="table">
        <thead>
          <tr>
            <th>Vehicle</th>
            <th>Driver</th>
            <th>Origin</th>
            <th>Destination</th>
            <th>Start Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {trips.map((trip) => (
            <tr key={trip.id}>
              <td>{trip.vehicleId}</td>
              <td>{trip.driverId}</td>
              <td>{trip.origin}</td>
              <td>{trip.destination}</td>
              <td>{new Date(trip.startDate).toLocaleDateString()}</td>
              <td>{trip.status}</td>
              <td>
                <button
                  className="btn btn-secondary"
                  onClick={() => onEdit(trip)}
                  style={{ marginRight: '5px' }}
                >
                  Edit
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => onDelete(trip.id)}
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

export default TripList
