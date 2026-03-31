import { useState, useEffect } from 'react'
import { driverService } from '../services/apiService'
import { getTodayDateString } from '../utils/dateUtils'

function FuelLogForm({ fuelLog, selectedVehicleId, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    vehicleId: selectedVehicleId || 0,
    driverId: '',
    fuelDate: getTodayDateString(),
    liters: 0,
    totalCost: 0,
    odometer: '',
    fuelStation: '',
    currency: 'USD',
  })
  const [driverName, setDriverName] = useState('')
  const [calculatedPricePerLiter, setCalculatedPricePerLiter] = useState(0)

  useEffect(() => {
    if (fuelLog) {
      setFormData({
        vehicleId: fuelLog.vehicleId || selectedVehicleId || 0,
        driverId: fuelLog.driverId || '',
        fuelDate: fuelLog.fuelDate?.split('T')[0] || '',
        liters: fuelLog.liters || 0,
        totalCost: fuelLog.totalCost || 0,
        odometer: fuelLog.odometer || '',
        fuelStation: fuelLog.fuelStation || '',
        currency: fuelLog.currency || 'USD',
      })
      // Fetch driver name if driverId exists
      if (fuelLog.driverId) {
        fetchDriverName(fuelLog.driverId)
      }
    } else if (selectedVehicleId) {
      setFormData(prev => ({ ...prev, vehicleId: selectedVehicleId }))
    }
  }, [fuelLog, selectedVehicleId])

  // Calculate price per liter whenever liters or totalCost changes
  useEffect(() => {
    if (formData.liters > 0 && formData.totalCost > 0) {
      const pricePerLiter = formData.totalCost / formData.liters
      setCalculatedPricePerLiter(pricePerLiter)
    } else {
      setCalculatedPricePerLiter(0)
    }
  }, [formData.liters, formData.totalCost])

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

  const handleChange = (e) => {
    const { name, value } = e.target
    
    if (name === 'vehicleId') {
      setFormData(prev => ({ ...prev, [name]: parseInt(value) || 0 }))
    } else if (name === 'driverId' || name === 'odometer') {
      setFormData(prev => ({ ...prev, [name]: value ? parseInt(value) : '' }))
    } else if (name === 'liters' || name === 'totalCost') {
      setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Convert date to ISO 8601 datetime format
    const fuelDateTime = formData.fuelDate ? `${formData.fuelDate}T00:00:00Z` : new Date().toISOString()
    
    // Calculate price per liter
    const pricePerLiter = formData.liters > 0 ? formData.totalCost / formData.liters : 0
    
    // Prepare data for submission - use camelCase (ASP.NET Core 8 default)
    const submitData = {
      vehicleId: parseInt(formData.vehicleId),
      fuelDate: fuelDateTime, // ISO 8601 format with time
      liters: parseFloat(formData.liters),
      pricePerLiter: parseFloat(pricePerLiter.toFixed(4)), // Calculate from totalCost and liters
      fuelStation: '', // Always include with empty string as default
      currency: formData.currency || 'USD'
    }
    
    // Add optional fields only if they have valid values
    if (formData.driverId && formData.driverId !== '') {
      submitData.driverId = parseInt(formData.driverId)
    }
    if (formData.odometer && formData.odometer !== '') {
      submitData.odometer = parseInt(formData.odometer)
    }
    if (formData.fuelStation && formData.fuelStation.trim() !== '') {
      submitData.fuelStation = formData.fuelStation.trim()
    }
    
    console.log('Submitting fuel log data:', submitData)
    onSave(submitData)
  }

  return (
    <div className="card" style={{ marginBottom: '20px' }}>
      <div className="card-title">{fuelLog ? 'Edit Fuel Log' : 'Add New Fuel Log'}</div>
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
          <div className="form-group">
            <label>Fuel Date *</label>
            <input
              type="date"
              name="fuelDate"
              value={formData.fuelDate}
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
              min="0.01"
            />
          </div>
          <div className="form-group">
            <label>Currency *</label>
            <select
              name="currency"
              value={formData.currency}
              onChange={handleChange}
              required
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="RON">RON (lei)</option>
              <option value="JPY">JPY (¥)</option>
              <option value="CAD">CAD ($)</option>
              <option value="AUD">AUD ($)</option>
            </select>
          </div>
          <div className="form-group">
            <label>Total Cost *</label>
            <input
              type="number"
              name="totalCost"
              value={formData.totalCost}
              onChange={handleChange}
              required
              step="0.01"
              min="0.01"
            />
          </div>
          <div className="form-group">
            <label>Price Per Liter (Calculated)</label>
            <input
              type="text"
              value={calculatedPricePerLiter > 0 ? `${calculatedPricePerLiter.toFixed(4)} ${formData.currency}` : '-'}
              readOnly
              style={{ backgroundColor: '#f5f5f5', fontWeight: 'bold', color: '#007bff' }}
            />
          </div>
          <div className="form-group">
            <label>Trip Odometer (km)</label>
            <input
              type="number"
              name="odometer"
              value={formData.odometer}
              onChange={handleChange}
              min="0"
              placeholder="Optional - for consumption calculation"
            />
          </div>
          <div className="form-group">
            <label>Fuel Station</label>
            <input
              type="text"
              name="fuelStation"
              value={formData.fuelStation}
              onChange={handleChange}
              placeholder="Optional"
            />
          </div>
        </div>
        
        {formData.liters > 0 && formData.totalCost > 0 && (
          <div className="alert" style={{ backgroundColor: '#e7f3ff', border: '1px solid #007bff', marginTop: '15px' }}>
            <strong>Calculation:</strong> {formData.totalCost.toFixed(2)} {formData.currency} ÷ {formData.liters.toFixed(2)} L = {calculatedPricePerLiter.toFixed(4)} {formData.currency} per liter
          </div>
        )}

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
