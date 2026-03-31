import { useState, useEffect } from 'react'
import VehicleSelector from './VehicleSelector'
import DriverSelector from './DriverSelector'
import { getTodayDateString } from '../utils/dateUtils'

function VehicleAssignmentForm({ assignment, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    vehicleId: 0,
    driverId: 0,
    startDate: getTodayDateString(),
    assignedBy: '',
    notes: '',
  })

  useEffect(() => {
    if (assignment) {
      setFormData({
        vehicleId: assignment.vehicleId || 0,
        driverId: assignment.driverId || 0,
        startDate: assignment.startDate?.split('T')[0] || assignment.assignedDate?.split('T')[0] || '',
        assignedBy: assignment.assignedBy || '',
        notes: assignment.notes || '',
      })
    }
  }, [assignment])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Convert date to ISO 8601 datetime format
    const startDateTime = formData.startDate ? `${formData.startDate}T00:00:00Z` : new Date().toISOString()
    
    // Prepare data for submission - match VehicleAssignmentCreateDto
    const submitData = {
      vehicleId: parseInt(formData.vehicleId),
      driverId: parseInt(formData.driverId),
      startDate: startDateTime, // ISO 8601 format with time
      assignedBy: formData.assignedBy || '',
      notes: formData.notes || '',
    }
    
    console.log('Submitting vehicle assignment data:', submitData)
    onSave(submitData)
  }

  return (
    <div className="card" style={{ marginBottom: '20px' }}>
      <div className="card-title">{assignment ? 'Edit Assignment' : 'Add New Assignment'}</div>
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
          <div className="form-group">
            <label>Vehicle *</label>
            <VehicleSelector
              value={formData.vehicleId}
              onChange={(vehicleId) => setFormData(prev => ({ ...prev, vehicleId }))}
              required
            />
          </div>
          <div className="form-group">
            <label>Driver *</label>
            <DriverSelector
              value={formData.driverId}
              onChange={(driverId) => setFormData(prev => ({ ...prev, driverId }))}
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
            <label>Assigned By</label>
            <input
              type="text"
              name="assignedBy"
              value={formData.assignedBy}
              onChange={handleChange}
              placeholder="e.g., admin, manager name"
            />
          </div>
          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label>Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Additional notes about this assignment"
            />
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
