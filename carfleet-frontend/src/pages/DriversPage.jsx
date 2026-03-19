import { useState, useEffect, useCallback } from 'react'
import { driverService } from '../services/apiService'
import DriverList from '../components/DriverList'
import DriverForm from '../components/DriverForm'

function DriversPage() {
  const [drivers, setDrivers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [editingDriver, setEditingDriver] = useState(null)

  const fetchDrivers = useCallback(async () => {
    try {
      setLoading(true)
      const response = await driverService.getAll()
      setDrivers(response.data || [])
      setError(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchDrivers()
  }, [fetchDrivers])

  const handleAddNew = () => {
    setEditingDriver(null)
    setShowForm(true)
  }

  const handleEdit = (driver) => {
    setEditingDriver(driver)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this driver?')) {
      try {
        await driverService.delete(id)
        await fetchDrivers()
      } catch (err) {
        setError(err.message)
      }
    }
  }

  const handleSave = async (formData) => {
    try {
      if (editingDriver) {
        await driverService.update(editingDriver.id, formData)
      } else {
        await driverService.create(formData)
      }
      setShowForm(false)
      await fetchDrivers()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="container">
      <h1 className="page-title">Drivers</h1>
      
      <div className="btn-group">
        <button className="btn btn-primary" onClick={handleAddNew}>
          + Add New Driver
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {showForm && (
        <DriverForm
          driver={editingDriver}
          onSave={handleSave}
          onCancel={() => setShowForm(false)}
        />
      )}

      {loading ? (
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading drivers...</p>
        </div>
      ) : (
        <DriverList
          drivers={drivers}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </div>
  )
}

export default DriversPage
