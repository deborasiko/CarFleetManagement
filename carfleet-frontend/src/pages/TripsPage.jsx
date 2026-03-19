import { useState, useEffect, useCallback } from 'react'
import { tripService } from '../services/apiService'
import TripList from '../components/TripList'
import TripForm from '../components/TripForm'

function TripsPage() {
  const [trips, setTrips] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [editingTrip, setEditingTrip] = useState(null)

  const fetchTrips = useCallback(async () => {
    try {
      setLoading(true)
      const response = await tripService.getAll()
      setTrips(response.data || [])
      setError(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchTrips()
  }, [fetchTrips])

  const handleAddNew = () => {
    setEditingTrip(null)
    setShowForm(true)
  }

  const handleEdit = (trip) => {
    setEditingTrip(trip)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this trip?')) {
      try {
        await tripService.delete(id)
        await fetchTrips()
      } catch (err) {
        setError(err.message)
      }
    }
  }

  const handleSave = async (formData) => {
    try {
      if (editingTrip) {
        await tripService.update(editingTrip.id, formData)
      } else {
        await tripService.create(formData)
      }
      setShowForm(false)
      await fetchTrips()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="container">
      <h1 className="page-title">Trips</h1>
      
      <div className="btn-group">
        <button className="btn btn-primary" onClick={handleAddNew}>
          + Add New Trip
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {showForm && (
        <TripForm
          trip={editingTrip}
          onSave={handleSave}
          onCancel={() => setShowForm(false)}
        />
      )}

      {loading ? (
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading trips...</p>
        </div>
      ) : (
        <TripList
          trips={trips}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </div>
  )
}

export default TripsPage
