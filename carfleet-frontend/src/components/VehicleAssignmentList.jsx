function VehicleAssignmentList({ assignments, onEdit, onDelete }) {
  if (assignments.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">📋</div>
        <div className="empty-state-title">No assignments found</div>
        <p>Add your first assignment to get started</p>
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
            <th>Assigned Date</th>
            <th>Unassigned Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {assignments.map((assignment) => (
            <tr key={assignment.id}>
              <td>{assignment.vehicleId}</td>
              <td>{assignment.driverId}</td>
              <td>{new Date(assignment.assignedDate).toLocaleDateString()}</td>
              <td>{assignment.unassignedDate ? new Date(assignment.unassignedDate).toLocaleDateString() : '-'}</td>
              <td>{assignment.status}</td>
              <td>
                <button
                  className="btn btn-secondary"
                  onClick={() => onEdit(assignment)}
                  style={{ marginRight: '5px' }}
                >
                  Edit
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => onDelete(assignment.id)}
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

export default VehicleAssignmentList
