import { useState, useEffect } from 'react'
import { vehicleService, driverService } from '../services/apiService'
import { formatDate } from '../utils/dateUtils'

function VehicleAssignmentList({ assignments, onEdit, onDelete }) {
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

  if (assignments.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">📋</div>
        <div className="empty-state-title">No assignments found</div>
        <p>Add your first assignment to get started</p>
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
            <th>Assigned Date</th>
            <th>Unassigned Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {assignments.map((assignment) => (
            <tr key={assignment.id}>
              <td data-label="Vehicle">{vehicles[assignment.vehicleId] || `ID: ${assignment.vehicleId}`}</td>
              <td data-label="Driver">{drivers[assignment.driverId] || `ID: ${assignment.driverId}`}</td>
              <td data-label="Assigned Date">{formatDate(assignment.assignedDate || assignment.startDate)}</td>
              <td data-label="Unassigned Date">{formatDate(assignment.unassignedDate || assignment.endDate)}</td>
              <td data-label="Status">{assignment.status}</td>
              <td data-label="Actions">
                <button
                  className="btn btn-secondary"
                  onClick={() => onEdit(assignment)}
                  style={{ marginRight: '5px', marginBottom: '5px' }}
                >
                  Edit
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => onDelete(assignment.id)}
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

export default VehicleAssignmentList
