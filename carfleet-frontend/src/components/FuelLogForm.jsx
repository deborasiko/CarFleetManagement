import { useState, useEffect } from 'react'

function FuelLogForm({ fuelLog, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    vehicleId: 0,
    date: '',
    liters: 0,
    cost: 0,
    mileage: 0,
  })

  useEffect(() => {
    if (fuelLog) {
      setFormData({
        ...fuelLog,
        date: fuelLog.date?.split('T')[0] || '',
      })
    }
  }, [fuelLog])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'vehicleId' || name === 'mileage'
        ? parseInt(value) || 0
        : parseFloat(value) || 0
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <div className="card" style={{ marginBottom: '20px' }}>
      <div className="card-title">{fuelLog ? 'Edit Fuel Log' : 'Add New Fuel Log'}</div>
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
            <label>Liters *</label>
            <input
              type="number"
              name="liters"
              value={formData.liters}
              onChange={handleChange}
              required
              step="0.01"
              min="0"
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
        </div>
        <div style={{ marginTop: '20px' }}>
          <button type="submit" className="btn btn-success" style={{ marginRight: '10px' }}>
            {fuelLog ? 'Update' : 'Create'} Fuel Log
          </button>
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

export default FuelLogForm
