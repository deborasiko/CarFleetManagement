import { useState, useEffect } from 'react'
import { driverService } from '../services/apiService'
import { formatDate } from '../utils/dateUtils'

function FuelLogList({ fuelLogs, onEdit, onDelete }) {
  const [drivers, setDrivers] = useState({})
  const [loading, setLoading] = useState(true)

  // Helper function to get currency symbol
  const getCurrencySymbol = (currency) => {
    const symbols = {
      'USD': '$',
      'EUR': '€',
      'GBP': '£',
      'RON': 'lei',
      'JPY': '¥',
      'CAD': '$',
      'AUD': '$'
    }
    return symbols[currency] || currency
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const driversRes = await driverService.getAll()
        
        const driversMap = {}
        driversRes.data?.forEach(d => {
          driversMap[d.id] = `${d.firstName} ${d.lastName}`
        })
        
        setDrivers(driversMap)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  // Calculate consumption for individual fuel log (L/100km)
  const calculateConsumption = (log) => {
    if (!log.odometer || log.odometer <= 0 || !log.liters) {
      return null
    }
    
    // L/100km = (Liters * 100) / Trip Odometer
    return (log.liters * 100) / log.odometer
  }

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

  // Sort fuel logs by date (newest first) for display
  const sortedLogs = [...fuelLogs].sort((a, b) => 
    new Date(b.fuelDate) - new Date(a.fuelDate)
  )

  return (
    <div className="card">
      <table className="table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Driver</th>
            <th>Liters</th>
            <th>Total Cost</th>
            <th>Price/L</th>
            <th>Trip Odometer</th>
            <th>Consumption</th>
            <th>Station</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sortedLogs.map((log) => {
            // Calculate consumption for this fuel log individually
            const consumption = calculateConsumption(log)

            return (
              <tr key={log.id}>
                <td data-label="Date">{formatDate(log.fuelDate)}</td>
                <td data-label="Driver">{log.driverId ? (drivers[log.driverId] || `ID: ${log.driverId}`) : '-'}</td>
                <td data-label="Liters">{log.liters?.toFixed(2)} L</td>
                <td data-label="Total Cost">{getCurrencySymbol(log.currency || 'USD')}{log.totalCost?.toFixed(2)}</td>
                <td data-label="Price/L">{getCurrencySymbol(log.currency || 'USD')}{log.pricePerLiter?.toFixed(4)}</td>
                <td data-label="Trip Odometer">{log.odometer ? `${log.odometer} km` : '-'}</td>
                <td data-label="Consumption">
                  {consumption !== null && consumption > 0 ? (
                    <span style={{ 
                      fontWeight: 'bold', 
                      color: consumption < 6 ? '#28a745' : consumption < 9 ? '#ffc107' : '#dc3545' 
                    }}>
                      {consumption.toFixed(2)} L/100km
                    </span>
                  ) : (
                    <span style={{ color: '#999' }}>-</span>
                  )}
                </td>
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
            )
          })}
        </tbody>
      </table>
      
      <div style={{ marginTop: '15px', padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '4px', fontSize: '0.9em' }}>
        <strong>Note:</strong> Consumption is calculated individually for each fuel log: (Liters × 100) / Trip Odometer = L/100km. 
        Color coding: <span style={{ color: '#28a745', fontWeight: 'bold' }}>Green</span> (&lt;6 L/100km = excellent), 
        <span style={{ color: '#ffc107', fontWeight: 'bold' }}> Yellow</span> (6-9 L/100km = good), 
        <span style={{ color: '#dc3545', fontWeight: 'bold' }}> Red</span> (&gt;9 L/100km = needs attention)
      </div>
    </div>
  )
}

export default FuelLogList
