import { useState, useEffect, useCallback } from 'react'
import { vehicleService } from '../services/apiService'
import VehicleList from '../components/VehicleList'
import VehicleForm from '../components/VehicleForm'

function VehiclesPage() {
  const [vehicles, setVehicles] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [editingVehicle, setEditingVehicle] = useState(null)

  const fetchVehicles = useCallback(async () => {
    try {
      setLoading(true)
      const response = await vehicleService.getAll()
      setVehicles(response.data || [])
      setError(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchVehicles()
  }, [fetchVehicles])

  const handleAddNew = () => {
    setEditingVehicle(null)
    setShowForm(true)
  }

  const handleEdit = (vehicle) => {
    setEditingVehicle(vehicle)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this vehicle?')) {
      try {
        await vehicleService.delete(id)
        await fetchVehicles()
      } catch (err) {
        setError(err.message)
      }
    }
  }

  const handleSave = async (formData) => {
    try {
      if (editingVehicle) {
        await vehicleService.update(editingVehicle.id, formData)
      } else {
        await vehicleService.create(formData)
      }
      setShowForm(false)
      await fetchVehicles()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="container">
      <h1 className="page-title">Vehicles</h1>
      
      <div className="btn-group">
        <button className="btn btn-primary" onClick={handleAddNew}>
          + Add New Vehicle
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {showForm && (
        <VehicleForm
          vehicle={editingVehicle}
          onSave={handleSave}
          onCancel={() => setShowForm(false)}
        />
      )}

      {loading ? (
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading vehicles...</p>
        </div>
      ) : (
        <VehicleList
          vehicles={vehicles}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </div>
  )
}

export default VehiclesPage
