import { useState, useEffect, useCallback } from 'react'
import { fleetLocationService } from '../services/apiService'
import FleetLocationList from '../components/FleetLocationList'
import FleetLocationForm from '../components/FleetLocationForm'

function FleetLocationsPage() {
  const [locations, setLocations] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [editingLocation, setEditingLocation] = useState(null)

  const fetchLocations = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fleetLocationService.getAll()
      setLocations(response.data || [])
      setError(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchLocations()
  }, [fetchLocations])

  const handleAddNew = () => {
    setEditingLocation(null)
    setShowForm(true)
  }

  const handleEdit = (location) => {
    setEditingLocation(location)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this location?')) {
      try {
        await fleetLocationService.delete(id)
        await fetchLocations()
      } catch (err) {
        setError(err.message)
      }
    }
  }

  const handleSave = async (formData) => {
    try {
      if (editingLocation) {
        await fleetLocationService.update(editingLocation.id, formData)
      } else {
        await fleetLocationService.create(formData)
      }
      setShowForm(false)
      await fetchLocations()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="container">
      <h1 className="page-title">Fleet Locations</h1>
      
      <div className="btn-group">
        <button className="btn btn-primary" onClick={handleAddNew}>
          + Add New Location
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {showForm && (
        <FleetLocationForm
          location={editingLocation}
          onSave={handleSave}
          onCancel={() => setShowForm(false)}
        />
      )}

      {loading ? (
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading locations...</p>
        </div>
      ) : (
        <FleetLocationList
          locations={locations}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </div>
  )
}

export default FleetLocationsPage
