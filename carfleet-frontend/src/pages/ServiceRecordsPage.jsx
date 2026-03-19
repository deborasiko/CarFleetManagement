import { useState, useEffect, useCallback } from 'react'
import { serviceRecordService } from '../services/apiService'
import ServiceRecordList from '../components/ServiceRecordList'
import ServiceRecordForm from '../components/ServiceRecordForm'

function ServiceRecordsPage() {
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [editingRecord, setEditingRecord] = useState(null)

  const fetchRecords = useCallback(async () => {
    try {
      setLoading(true)
      const response = await serviceRecordService.getAll()
      setRecords(response.data || [])
      setError(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchRecords()
  }, [fetchRecords])

  const handleAddNew = () => {
    setEditingRecord(null)
    setShowForm(true)
  }

  const handleEdit = (record) => {
    setEditingRecord(record)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      try {
        await serviceRecordService.delete(id)
        await fetchRecords()
      } catch (err) {
        setError(err.message)
      }
    }
  }

  const handleSave = async (formData) => {
    try {
      if (editingRecord) {
        await serviceRecordService.update(editingRecord.id, formData)
      } else {
        await serviceRecordService.create(formData)
      }
      setShowForm(false)
      await fetchRecords()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="container">
      <h1 className="page-title">Service Records</h1>
      
      <div className="btn-group">
        <button className="btn btn-primary" onClick={handleAddNew}>
          + Add New Service Record
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {showForm && (
        <ServiceRecordForm
          record={editingRecord}
          onSave={handleSave}
          onCancel={() => setShowForm(false)}
        />
      )}

      {loading ? (
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading service records...</p>
        </div>
      ) : (
        <ServiceRecordList
          records={records}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </div>
  )
}

export default ServiceRecordsPage
