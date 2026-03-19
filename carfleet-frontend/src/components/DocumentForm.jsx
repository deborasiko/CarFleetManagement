import { useState, useEffect } from 'react'

function DocumentForm({ document, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    title: '',
    documentType: '',
    associatedWith: '',
    uploadDate: '',
    expiryDate: '',
    filePath: '',
  })

  useEffect(() => {
    if (document) {
      setFormData({
        ...document,
        uploadDate: document.uploadDate?.split('T')[0] || '',
        expiryDate: document.expiryDate?.split('T')[0] || '',
      })
    }
  }, [document])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <div className="card" style={{ marginBottom: '20px' }}>
      <div className="card-title">{document ? 'Edit Document' : 'Add New Document'}</div>
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
          <div className="form-group">
            <label>Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
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
              <option value="License">License</option>
              <option value="Insurance">Insurance</option>
              <option value="Registration">Registration</option>
              <option value="Service Manual">Service Manual</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="form-group">
            <label>Associated With</label>
            <input
              type="text"
              name="associatedWith"
              value={formData.associatedWith}
              onChange={handleChange}
              placeholder="Vehicle ID or Driver ID"
            />
          </div>
          <div className="form-group">
            <label>Upload Date</label>
            <input
              type="date"
              name="uploadDate"
              value={formData.uploadDate}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Expiry Date</label>
            <input
              type="date"
              name="expiryDate"
              value={formData.expiryDate}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>File Path</label>
            <input
              type="text"
              name="filePath"
              value={formData.filePath}
              onChange={handleChange}
              placeholder="/path/to/file"
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
