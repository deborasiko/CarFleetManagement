import { useState, useEffect } from 'react'
import { getTodayDateString } from '../utils/dateUtils'

function VehicleForm({ vehicle, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    make: '',
    model: '',
    vin: '',
    year: new Date().getFullYear(),
    licensePlate: '',
    color: '',
    fuelType: 0,
    purchaseDate: getTodayDateString(),
  })

  useEffect(() => {
    if (vehicle) {
      setFormData({
        ...vehicle,
        purchaseDate: vehicle.purchaseDate?.split('T')[0] || '',
      })
    }
  }, [vehicle])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'year' || name === 'fuelType'
        ? parseInt(value) || 0
        : value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Convert date to ISO 8601 datetime format
    const purchaseDateTime = formData.purchaseDate ? `${formData.purchaseDate}T00:00:00Z` : new Date().toISOString()
    
    const submitData = {
      make: formData.make,
      model: formData.model,
      vin: formData.vin,
      year: parseInt(formData.year),
      licensePlate: formData.licensePlate,
      color: formData.color || '',
      fuelType: parseInt(formData.fuelType),
      purchaseDate: purchaseDateTime,
    }
    
    console.log('Submitting vehicle data:', submitData)
    onSave(submitData)
    
    setFormData({
      make: '',
      model: '',
      vin: '',
      year: new Date().getFullYear(),
      licensePlate: '',
      color: '',
      fuelType: 0,
      purchaseDate: '',
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
            <label>VIN *</label>
            <input
              type="text"
              name="vin"
              value={formData.vin}
              onChange={handleChange}
              required
              placeholder="Vehicle Identification Number"
            />
          </div>
          <div className="form-group">
            <label>Year *</label>
            <input
              type="number"
              name="year"
              value={formData.year}
              onChange={handleChange}
              required
              min="1900"
              max={new Date().getFullYear() + 1}
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
            <label>Color</label>
            <input
              type="text"
              name="color"
              value={formData.color}
              onChange={handleChange}
              placeholder="e.g., Silver, Black"
            />
          </div>
          <div className="form-group">
            <label>Fuel Type *</label>
            <select name="fuelType" value={formData.fuelType} onChange={handleChange} required>
              <option value="0">Diesel</option>
              <option value="1">Petrol</option>
              <option value="2">Electric</option>
            </select>
          </div>
          <div className="form-group">
            <label>Purchase Date *</label>
            <input
              type="date"
              name="purchaseDate"
              value={formData.purchaseDate}
              onChange={handleChange}
              required
            />
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
