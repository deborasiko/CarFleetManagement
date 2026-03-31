import { useState, useEffect } from 'react'
import { getTodayDateString } from '../utils/dateUtils'

function DriverForm({ driver, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    licenseNumber: '',
    licenseExpiryDate: '',
    phone: '',
    email: '',
    hireDate: getTodayDateString(),
  })

  useEffect(() => {
    if (driver) {
      setFormData({
        ...driver,
        licenseExpiryDate: driver.licenseExpiryDate?.split('T')[0] || '',
        hireDate: driver.hireDate?.split('T')[0] || '',
      })
    }
  }, [driver])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Convert dates to ISO 8601 datetime format
    const licenseExpiryDateTime = formData.licenseExpiryDate ? `${formData.licenseExpiryDate}T00:00:00Z` : new Date().toISOString()
    const hireDateDateTime = formData.hireDate ? `${formData.hireDate}T00:00:00Z` : new Date().toISOString()
    
    const submitData = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      licenseNumber: formData.licenseNumber,
      licenseExpiryDate: licenseExpiryDateTime,
      phone: formData.phone || '',
      email: formData.email || '',
      hireDate: hireDateDateTime,
    }
    
    console.log('Submitting driver data:', submitData)
    onSave(submitData)
    
    setFormData({
      firstName: '',
      lastName: '',
      licenseNumber: '',
      licenseExpiryDate: '',
      phone: '',
      email: '',
      hireDate: '',
    })
  }

  return (
    <div className="card" style={{ marginBottom: '20px' }}>
      <div className="card-title">{driver ? 'Edit Driver' : 'Add New Driver'}</div>
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
          <div className="form-group">
            <label>First Name *</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Last Name *</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>License Number *</label>
            <input
              type="text"
              name="licenseNumber"
              value={formData.licenseNumber}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>License Expiry Date *</label>
            <input
              type="date"
              name="licenseExpiryDate"
              value={formData.licenseExpiryDate}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Phone *</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Hire Date *</label>
            <input
              type="date"
              name="hireDate"
              value={formData.hireDate}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div style={{ marginTop: '20px' }}>
          <button type="submit" className="btn btn-success" style={{ marginRight: '10px' }}>
            {driver ? 'Update' : 'Create'} Driver
          </button>
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

export default DriverForm
