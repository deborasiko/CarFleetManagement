function FleetLocationList({ locations, onEdit, onDelete }) {
  if (locations.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">📍</div>
        <div className="empty-state-title">No fleet locations found</div>
        <p>Add your first fleet location to get started</p>
      </div>
    )
  }

  return (
    <div className="card">
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Address</th>
            <th>City</th>
            <th>Country</th>
            <th>Capacity</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {locations.map((location) => (
            <tr key={location.id}>
              <td data-label="Name">{location.name}</td>
              <td data-label="Address">{location.address}</td>
              <td data-label="City">{location.city}</td>
              <td data-label="Country">{location.country}</td>
              <td data-label="Capacity">{location.capacity} vehicles</td>
              <td data-label="Actions">
                <button
                  className="btn btn-secondary"
                  onClick={() => onEdit(location)}
                  style={{ marginRight: '5px', marginBottom: '5px' }}
                >
                  Edit
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => onDelete(location.id)}
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

export default FleetLocationList
