import { useState, useEffect } from 'react'
import { vehicleService, driverService } from '../services/apiService'
import { formatDate } from '../utils/dateUtils'

function TripList({ trips, onEdit, onDelete }) {
  const [vehicles, setVehicles] = useState({})
  const [drivers, setDrivers] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [vehiclesRes, driversRes] = await Promise.all([
          vehicleService.getAll(),
          driverService.getAll()
        ])
        
        const vehiclesMap = {}
        vehiclesRes.data?.forEach(v => {
          vehiclesMap[v.id] = `${v.make} ${v.model} (${v.licensePlate})`
        })
        
        const driversMap = {}
        driversRes.data?.forEach(d => {
          driversMap[d.id] = `${d.firstName} ${d.lastName}`
        })
        
        setVehicles(vehiclesMap)
        setDrivers(driversMap)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (trips.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">🛣️</div>
        <div className="empty-state-title">No trips found</div>
        <p>Add your first trip to get started</p>
      </div>
    )
  }

  if (loading) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>Loading...</div>
  }

  return (
    <div className="card">
      <table className="table">
        <thead>
          <tr>
            <th>Vehicle</th>
            <th>Driver</th>
            <th>Origin</th>
            <th>Destination</th>
            <th>Start Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {trips.map((trip) => (
            <tr key={trip.id}>
              <td data-label="Vehicle">{vehicles[trip.vehicleId] || `ID: ${trip.vehicleId}`}</td>
              <td data-label="Driver">{trip.driverId ? (drivers[trip.driverId] || `ID: ${trip.driverId}`) : '-'}</td>
              <td data-label="Origin">{trip.origin || trip.startLocation}</td>
              <td data-label="Destination">{trip.destination || trip.endLocation}</td>
              <td data-label="Start Date">{formatDate(trip.startDate || trip.startTime)}</td>
              <td data-label="Status">{trip.status}</td>
              <td data-label="Actions">
                <button
                  className="btn btn-secondary"
                  onClick={() => onEdit(trip)}
                  style={{ marginRight: '5px', marginBottom: '5px' }}
                >
                  Edit
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => onDelete(trip.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default TripList
