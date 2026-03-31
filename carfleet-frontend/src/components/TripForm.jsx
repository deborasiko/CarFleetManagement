import { useState, useEffect } from 'react'
import VehicleSelector from './VehicleSelector'
import { driverService } from '../services/apiService'
import { getTodayDateString } from '../utils/dateUtils'

function TripForm({ trip, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    vehicleId: 0,
    driverId: '',
    origin: '',
    destination: '',
    startDate: getTodayDateString(),
    endDate: getTodayDateString(),
    distance: 0,
    status: 'Planned',
  })
  const [driverName, setDriverName] = useState('')

  useEffect(() => {
    if (trip) {
      setFormData({
        ...trip,
        driverId: trip.driverId || '',
        startDate: trip.startDate?.split('T')[0] || '',
        endDate: trip.endDate?.split('T')[0] || '',
      })
      // Fetch driver name if driverId exists
      if (trip.driverId) {
        fetchDriverName(trip.driverId)
      }
    }
  }, [trip])

  const fetchDriverName = async (driverId) => {
    try {
      const response = await driverService.getById(driverId)
      if (response.data) {
        setDriverName(`${response.data.firstName} ${response.data.lastName}`)
      }
    } catch (error) {
      console.error('Error fetching driver:', error)
      setDriverName('')
    }
  }

  const handleDriverAssigned = async (driverId) => {
    setFormData(prev => ({ ...prev, driverId: driverId || '' }))
    if (driverId) {
      await fetchDriverName(driverId)
    } else {
      setDriverName('')
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'distance'
        ? parseInt(value) || 0
        : value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Convert date to ISO 8601 datetime format (required for timestamp with time zone)
    const startDateTime = formData.startDate ? `${formData.startDate}T00:00:00Z` : new Date().toISOString()
    
    // Prepare data for submission - match TripCreateDto
    const submitData = {
      vehicleId: parseInt(formData.vehicleId),
      startTime: startDateTime, // ISO 8601 format with time
      startLocation: formData.origin || '',
      endLocation: formData.destination || '',
      purpose: formData.status || 'Planned',
    }
    
    // Add optional driverId if provided
    if (formData.driverId && formData.driverId !== '') {
      submitData.driverId = parseInt(formData.driverId)
    }
    
    console.log('Submitting trip data:', submitData)
    onSave(submitData)
  }

  return (
    <div className="card" style={{ marginBottom: '20px' }}>
      <div className="card-title">{trip ? 'Edit Trip' : 'Add New Trip'}</div>
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
          <div className="form-group">
            <label>Vehicle *</label>
            <VehicleSelector
              value={formData.vehicleId}
              onChange={(vehicleId) => setFormData(prev => ({ ...prev, vehicleId }))}
              onDriverAssigned={handleDriverAssigned}
              required
            />
          </div>
          <div className="form-group">
            <label>Driver (Auto-assigned)</label>
            <input
              type="text"
              value={driverName || (formData.driverId ? `ID: ${formData.driverId}` : '')}
              placeholder="Auto-assigned from vehicle"
              readOnly
              style={{ backgroundColor: '#f5f5f5' }}
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
