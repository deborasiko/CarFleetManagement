import { useState, useEffect, useCallback } from 'react'
import { fuelLogService } from '../services/apiService'
import FuelLogList from '../components/FuelLogList'
import FuelLogForm from '../components/FuelLogForm'

function FuelLogsPage() {
  const [fuelLogs, setFuelLogs] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [editingLog, setEditingLog] = useState(null)

  const fetchFuelLogs = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fuelLogService.getAll()
      setFuelLogs(response.data || [])
      setError(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchFuelLogs()
  }, [fetchFuelLogs])

  const handleAddNew = () => {
    setEditingLog(null)
    setShowForm(true)
  }

  const handleEdit = (log) => {
    setEditingLog(log)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this fuel log?')) {
      try {
        await fuelLogService.delete(id)
        await fetchFuelLogs()
      } catch (err) {
        setError(err.message)
      }
    }
  }

  const handleSave = async (formData) => {
    try {
      if (editingLog) {
        await fuelLogService.update(editingLog.id, formData)
      } else {
        await fuelLogService.create(formData)
      }
      setShowForm(false)
      await fetchFuelLogs()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="container">
      <h1 className="page-title">Fuel Logs</h1>
      
      <div className="btn-group">
        <button className="btn btn-primary" onClick={handleAddNew}>
          + Add New Fuel Log
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {showForm && (
        <FuelLogForm
          fuelLog={editingLog}
          onSave={handleSave}
          onCancel={() => setShowForm(false)}
        />
      )}

      {loading ? (
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading fuel logs...</p>
        </div>
      ) : (
        <FuelLogList
          fuelLogs={fuelLogs}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </div>
  )
}

export default FuelLogsPage
