import { useState, useEffect } from 'react'
import VehicleSelector from './VehicleSelector'
import { getTodayDateString } from '../utils/dateUtils'

function ServiceRecordForm({ record, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    vehicleId: 0,
    serviceType: 0,
    serviceDate: getTodayDateString(),
    odometer: '',
    cost: 0,
    description: '',
    serviceProvider: '',
  })

  useEffect(() => {
    if (record) {
      setFormData({
        vehicleId: record.vehicleId || 0,
        serviceType: record.serviceType || 0,
        serviceDate: record.serviceDate?.split('T')[0] || record.date?.split('T')[0] || '',
        odometer: record.odometer || record.mileage || '',
        cost: record.cost || 0,
        description: record.description || '',
        serviceProvider: record.serviceProvider || '',
      })
    }
  }, [record])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'vehicleId' || name === 'serviceType'
        ? parseInt(value) || 0
        : name === 'odometer'
        ? value ? parseInt(value) : ''
        : name === 'cost'
        ? parseFloat(value) || 0
        : value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Convert date to ISO 8601 datetime format
    const serviceDateTime = formData.serviceDate ? `${formData.serviceDate}T00:00:00Z` : new Date().toISOString()
    
    // Prepare data for submission
    const submitData = {
      vehicleId: parseInt(formData.vehicleId),
      serviceType: parseInt(formData.serviceType),
      serviceDate: serviceDateTime, // ISO 8601 format with time
      cost: parseFloat(formData.cost),
      description: formData.description || '',
      serviceProvider: formData.serviceProvider || '',
    }
    
    // Add optional odometer if provided
    if (formData.odometer && formData.odometer !== '') {
      submitData.odometer = parseInt(formData.odometer)
    }
    
    console.log('Submitting service record data:', submitData)
    onSave(submitData)
  }

  return (
    <div className="card" style={{ marginBottom: '20px' }}>
      <div className="card-title">{record ? 'Edit Service Record' : 'Add New Service Record'}</div>
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
            <label>Service Type *</label>
            <select
              name="serviceType"
              value={formData.serviceType}
              onChange={handleChange}
              required
            >
              <option value="">Select type...</option>
              <option value="0">Maintenance</option>
              <option value="1">Repair</option>
              <option value="2">Inspection</option>
              <option value="3">Tire</option>
              <option value="4">Oil</option>
              <option value="5">Transmission</option>
              <option value="6">Engine</option>
              <option value="7">Other</option>
            </select>
          </div>
          <div className="form-group">
            <label>Service Date *</label>
            <input
              type="date"
              name="serviceDate"
              value={formData.serviceDate}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Odometer (km)</label>
            <input
              type="number"
              name="odometer"
              value={formData.odometer}
              onChange={handleChange}
              min="0"
              placeholder="Optional"
            />
          </div>
          <div className="form-group">
            <label>Cost ($) *</label>
            <input
              type="number"
              name="cost"
              value={formData.cost}
              onChange={handleChange}
              required
              step="0.01"
              min="0"
            />
          </div>
          <div className="form-group">
            <label>Service Provider</label>
            <input
              type="text"
              name="serviceProvider"
              value={formData.serviceProvider}
              onChange={handleChange}
              placeholder="e.g., ABC Automotive"
            />
          </div>
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Additional notes about the service"
          />
        </div>
        <div style={{ marginTop: '20px' }}>
          <button type="submit" className="btn btn-success" style={{ marginRight: '10px' }}>
            {record ? 'Update' : 'Create'} Service Record
          </button>
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

export default ServiceRecordForm
