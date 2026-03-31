import { useState, useEffect } from 'react'
import VehicleSelector from './VehicleSelector'
import { driverService } from '../services/apiService'
import { getTodayDateString } from '../utils/dateUtils'

function FuelLogForm({ fuelLog, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    vehicleId: 0,
    driverId: '',
    fuelDate: getTodayDateString(),
    liters: 0,
    pricePerLiter: 0,
    odometer: '',
    fuelStation: '',
  })
  const [driverName, setDriverName] = useState('')

  useEffect(() => {
    if (fuelLog) {
      setFormData({
        vehicleId: fuelLog.vehicleId || 0,
        driverId: fuelLog.driverId || '',
        fuelDate: fuelLog.fuelDate?.split('T')[0] || '',
        liters: fuelLog.liters || 0,
        pricePerLiter: fuelLog.pricePerLiter || 0,
        odometer: fuelLog.odometer || '',
        fuelStation: fuelLog.fuelStation || '',
      })
      // Fetch driver name if driverId exists
      if (fuelLog.driverId) {
        fetchDriverName(fuelLog.driverId)
      }
    }
  }, [fuelLog])

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
    
    if (name === 'vehicleId') {
      setFormData(prev => ({ ...prev, [name]: parseInt(value) || 0 }))
    } else if (name === 'driverId' || name === 'odometer') {
      setFormData(prev => ({ ...prev, [name]: value ? parseInt(value) : '' }))
    } else if (name === 'liters' || name === 'pricePerLiter') {
      setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Convert date to ISO 8601 datetime format
    const fuelDateTime = formData.fuelDate ? `${formData.fuelDate}T00:00:00Z` : new Date().toISOString()
    
    // Prepare data for submission - use camelCase (ASP.NET Core 8 default)
    const submitData = {
      vehicleId: parseInt(formData.vehicleId),
      fuelDate: fuelDateTime, // ISO 8601 format with time
      liters: parseFloat(formData.liters),
      pricePerLiter: parseFloat(formData.pricePerLiter),
      fuelStation: '' // Always include with empty string as default
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
              min="0"
            />
          </div>
          <div className="form-group">
            <label>Price Per Liter ($) *</label>
            <input
              type="number"
              name="pricePerLiter"
              value={formData.pricePerLiter}
              onChange={handleChange}
              required
              step="0.01"
              min="0"
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
          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
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
