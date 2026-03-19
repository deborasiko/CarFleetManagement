import { useState, useEffect } from 'react'

function ServiceRecordForm({ record, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    vehicleId: 0,
    serviceType: '',
    date: '',
    mileage: 0,
    cost: 0,
    description: '',
  })

  useEffect(() => {
    if (record) {
      setFormData({
        ...record,
        date: record.date?.split('T')[0] || '',
      })
    }
  }, [record])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'vehicleId' || name === 'mileage'
        ? parseInt(value) || 0
        : name === 'cost'
        ? parseFloat(value) || 0
        : value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <div className="card" style={{ marginBottom: '20px' }}>
      <div className="card-title">{record ? 'Edit Service Record' : 'Add New Service Record'}</div>
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
            <label>Service Type *</label>
            <input
              type="text"
              name="serviceType"
              value={formData.serviceType}
              onChange={handleChange}
              required
              placeholder="e.g., Oil Change, Tire Rotation"
            />
          </div>
          <div className="form-group">
            <label>Date *</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Mileage (km) *</label>
            <input
              type="number"
              name="mileage"
              value={formData.mileage}
              onChange={handleChange}
              required
              min="0"
            />
          </div>
          <div className="form-group">
            <label>Cost ($)</label>
            <input
              type="number"
              name="cost"
              value={formData.cost}
              onChange={handleChange}
              step="0.01"
              min="0"
            />
          </div>
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
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
