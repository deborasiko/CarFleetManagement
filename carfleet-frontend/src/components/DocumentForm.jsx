import { useState, useEffect } from 'react'
import VehicleSelector from './VehicleSelector'
import { getTodayDateString } from '../utils/dateUtils'

function DocumentForm({ document, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    vehicleId: 0,
    documentType: 0,
    filePath: '',
    issueDate: getTodayDateString(),
    expiryDate: '',
  })

  useEffect(() => {
    if (document) {
      setFormData({
        vehicleId: document.vehicleId || 0,
        documentType: document.documentType || 0,
        filePath: document.filePath || '',
        issueDate: document.issueDate?.split('T')[0] || document.uploadDate?.split('T')[0] || '',
        expiryDate: document.expiryDate?.split('T')[0] || '',
      })
    }
  }, [document])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'vehicleId' || name === 'documentType'
        ? parseInt(value) || 0
        : value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Convert dates to ISO 8601 datetime format
    const issueDateTime = formData.issueDate ? `${formData.issueDate}T00:00:00Z` : new Date().toISOString()
    
    // Prepare data for submission - match DocumentCreateDto
    const submitData = {
      vehicleId: parseInt(formData.vehicleId),
      documentType: parseInt(formData.documentType),
      filePath: formData.filePath || '',
      issueDate: issueDateTime, // ISO 8601 format with time
    }
    
    // Add optional expiryDate if provided
    if (formData.expiryDate && formData.expiryDate !== '') {
      submitData.expiryDate = `${formData.expiryDate}T00:00:00Z`
    }
    
    console.log('Submitting document data:', submitData)
    onSave(submitData)
  }

  return (
    <div className="card" style={{ marginBottom: '20px' }}>
      <div className="card-title">{document ? 'Edit Document' : 'Add New Document'}</div>
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
            <label>Document Type *</label>
            <select
              name="documentType"
              value={formData.documentType}
              onChange={handleChange}
              required
            >
              <option value="">Select Type</option>
              <option value="0">Insurance</option>
              <option value="1">Registration</option>
              <option value="2">Inspection</option>
              <option value="3">Emission Test</option>
              <option value="4">Vehicle Title</option>
              <option value="5">Maintenance Record</option>
              <option value="6">Other</option>
            </select>
          </div>
          <div className="form-group">
            <label>File Path *</label>
            <input
              type="text"
              name="filePath"
              value={formData.filePath}
              onChange={handleChange}
              required
              placeholder="/documents/insurance_2026.pdf"
            />
          </div>
          <div className="form-group">
            <label>Issue Date *</label>
            <input
              type="date"
              name="issueDate"
              value={formData.issueDate}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Expiry Date</label>
            <input
              type="date"
              name="expiryDate"
              value={formData.expiryDate}
              onChange={handleChange}
              placeholder="Optional"
            />
          </div>
        </div>
        <div style={{ marginTop: '20px' }}>
          <button type="submit" className="btn btn-success" style={{ marginRight: '10px' }}>
            {document ? 'Update' : 'Create'} Document
          </button>
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

export default DocumentForm
