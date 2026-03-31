import { useState, useEffect } from 'react'
import { vehicleService, driverService } from '../services/apiService'
import { formatDate } from '../utils/dateUtils'

function FuelLogList({ fuelLogs, onEdit, onDelete }) {
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

  if (fuelLogs.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">⛽</div>
        <div className="empty-state-title">No fuel logs found</div>
        <p>Add your first fuel log to get started</p>
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
            <th>Date</th>
            <th>Liters</th>
            <th>Price/L</th>
            <th>Total Cost</th>
            <th>Odometer</th>
            <th>Station</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {fuelLogs.map((log) => (
            <tr key={log.id}>
              <td data-label="Vehicle">{vehicles[log.vehicleId] || `ID: ${log.vehicleId}`}</td>
              <td data-label="Driver">{log.driverId ? (drivers[log.driverId] || `ID: ${log.driverId}`) : '-'}</td>
              <td data-label="Date">{formatDate(log.fuelDate)}</td>
              <td data-label="Liters">{log.liters} L</td>
              <td data-label="Price/L">${log.pricePerLiter?.toFixed(2)}</td>
              <td data-label="Total Cost">${log.totalCost?.toFixed(2)}</td>
              <td data-label="Odometer">{log.odometer ? `${log.odometer} km` : '-'}</td>
              <td data-label="Station">{log.fuelStation || '-'}</td>
              <td data-label="Actions">
                <button
                  className="btn btn-secondary"
                  onClick={() => onEdit(log)}
                  style={{ marginRight: '5px', marginBottom: '5px' }}
                >
                  Edit
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => onDelete(log.id)}
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

export default FuelLogList
