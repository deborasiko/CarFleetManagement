import { useState, useEffect } from 'react'
import { vehicleService } from '../services/apiService'
import { formatDate } from '../utils/dateUtils'

function ServiceRecordList({ records, onEdit, onDelete }) {
  const [vehicles, setVehicles] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const vehiclesRes = await vehicleService.getAll()
        
        const vehiclesMap = {}
        vehiclesRes.data?.forEach(v => {
          vehiclesMap[v.id] = `${v.make} ${v.model} (${v.licensePlate})`
        })
        
        setVehicles(vehiclesMap)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (records.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">🔧</div>
        <div className="empty-state-title">No service records found</div>
        <p>Add your first service record to get started</p>
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
            <th>Service Type</th>
            <th>Date</th>
            <th>Mileage</th>
            <th>Cost</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {records.map((record) => (
            <tr key={record.id}>
              <td data-label="Vehicle">{vehicles[record.vehicleId] || `ID: ${record.vehicleId}`}</td>
              <td data-label="Service Type">{record.serviceType}</td>
              <td data-label="Date">{formatDate(record.date || record.serviceDate)}</td>
              <td data-label="Mileage">{record.mileage || record.odometer} km</td>
              <td data-label="Cost">${record.cost?.toFixed(2) || '0.00'}</td>
              <td data-label="Description">{record.description}</td>
              <td data-label="Actions">
                <button
                  className="btn btn-secondary"
                  onClick={() => onEdit(record)}
                  style={{ marginRight: '5px', marginBottom: '5px' }}
                >
                  Edit
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => onDelete(record.id)}
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

export default ServiceRecordList
