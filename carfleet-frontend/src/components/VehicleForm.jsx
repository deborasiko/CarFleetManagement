import { useState, useEffect } from 'react'

function VehicleForm({ vehicle, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    make: '',
    model: '',
    licensePlate: '',
    year: new Date().getFullYear(),
    mileage: 0,
    status: 'Active',
  })

  useEffect(() => {
    if (vehicle) {
      setFormData(vehicle)
    }
  }, [vehicle])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'year' || name === 'mileage' ? parseInt(value) : value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(formData)
    setFormData({
      make: '',
      model: '',
      licensePlate: '',
      year: new Date().getFullYear(),
      mileage: 0,
      status: 'Active',
    })
  }

  return (
    <div className="card" style={{ marginBottom: '20px' }}>
      <div className="card-title">{vehicle ? 'Edit Vehicle' : 'Add New Vehicle'}</div>
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
          <div className="form-group">
            <label>Make *</label>
            <input
              type="text"
              name="make"
              value={formData.make}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Model *</label>
            <input
              type="text"
              name="model"
              value={formData.model}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>License Plate *</label>
            <input
              type="text"
              name="licensePlate"
              value={formData.licensePlate}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Year</label>
            <input
              type="number"
              name="year"
              value={formData.year}
              onChange={handleChange}
              min="1900"
              max={new Date().getFullYear() + 1}
            />
          </div>
          <div className="form-group">
            <label>Mileage (km)</label>
            <input
              type="number"
              name="mileage"
              value={formData.mileage}
              onChange={handleChange}
              min="0"
            />
          </div>
          <div className="form-group">
            <label>Status</label>
            <select name="status" value={formData.status} onChange={handleChange}>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Maintenance">Maintenance</option>
            </select>
          </div>
        </div>
        <div style={{ marginTop: '20px' }}>
          <button type="submit" className="btn btn-success" style={{ marginRight: '10px' }}>
            {vehicle ? 'Update' : 'Create'} Vehicle
          </button>
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

export default VehicleForm
