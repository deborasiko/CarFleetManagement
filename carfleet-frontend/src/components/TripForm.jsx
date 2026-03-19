import { useState, useEffect } from 'react'

function TripForm({ trip, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    vehicleId: 0,
    driverId: 0,
    origin: '',
    destination: '',
    startDate: '',
    endDate: '',
    distance: 0,
    status: 'Planned',
  })

  useEffect(() => {
    if (trip) {
      setFormData({
        ...trip,
        startDate: trip.startDate?.split('T')[0] || '',
        endDate: trip.endDate?.split('T')[0] || '',
      })
    }
  }, [trip])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'vehicleId' || name === 'driverId' || name === 'distance'
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
      <div className="card-title">{trip ? 'Edit Trip' : 'Add New Trip'}</div>
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
            <label>Origin *</label>
            <input
              type="text"
              name="origin"
              value={formData.origin}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Destination *</label>
            <input
              type="text"
              name="destination"
              value={formData.destination}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Start Date *</label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>End Date</label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Distance (km)</label>
            <input
              type="number"
              name="distance"
              value={formData.distance}
              onChange={handleChange}
              min="0"
            />
          </div>
          <div className="form-group">
            <label>Status</label>
            <select name="status" value={formData.status} onChange={handleChange}>
              <option value="Planned">Planned</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>
        <div style={{ marginTop: '20px' }}>
          <button type="submit" className="btn btn-success" style={{ marginRight: '10px' }}>
            {trip ? 'Update' : 'Create'} Trip
          </button>
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

export default TripForm
