import { useState, useEffect } from 'react'

function VehicleAssignmentForm({ assignment, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    vehicleId: 0,
    driverId: 0,
    assignedDate: '',
    unassignedDate: '',
    status: 'Active',
  })

  useEffect(() => {
    if (assignment) {
      setFormData({
        ...assignment,
        assignedDate: assignment.assignedDate?.split('T')[0] || '',
        unassignedDate: assignment.unassignedDate?.split('T')[0] || '',
      })
    }
  }, [assignment])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'vehicleId' || name === 'driverId'
        ? parseInt(value) || 0
        : value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <div className="card" style={{ marginBottom: '20px' }}>
      <div className="card-title">{assignment ? 'Edit Assignment' : 'Add New Assignment'}</div>
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
          <div className="form-group">
            <label>Vehicle ID *</label>
            <input
              type="number"
              name="vehicleId"
              value={formData.vehicleId}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Driver ID *</label>
            <input
              type="number"
              name="driverId"
              value={formData.driverId}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Assigned Date *</label>
            <input
              type="date"
              name="assignedDate"
              value={formData.assignedDate}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Unassigned Date</label>
            <input
              type="date"
              name="unassignedDate"
              value={formData.unassignedDate}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Status</label>
            <select name="status" value={formData.status} onChange={handleChange}>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>
        <div style={{ marginTop: '20px' }}>
          <button type="submit" className="btn btn-success" style={{ marginRight: '10px' }}>
            {assignment ? 'Update' : 'Create'} Assignment
          </button>
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

export default VehicleAssignmentForm
