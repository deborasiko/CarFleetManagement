import { useState, useEffect, useCallback } from 'react'
import { fuelLogService, vehicleService } from '../services/apiService'
import FuelLogList from '../components/FuelLogList'
import FuelLogForm from '../components/FuelLogForm'

function FuelLogsPage() {
  const [vehicles, setVehicles] = useState([])
  const [selectedVehicle, setSelectedVehicle] = useState(null)
  const [fuelLogs, setFuelLogs] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [editingLog, setEditingLog] = useState(null)
  const [averageConsumption, setAverageConsumption] = useState(null)

  // Fetch all vehicles on mount
  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await vehicleService.getAll()
        setVehicles(response.data || [])
      } catch (err) {
        setError(err.message)
      }
    }
    fetchVehicles()
  }, [])

  // Fetch fuel logs when a vehicle is selected
  const fetchFuelLogsForVehicle = useCallback(async (vehicleId) => {
    try {
      setLoading(true)
      const [logsResponse, avgResponse] = await Promise.all([
        fuelLogService.getByVehicle(vehicleId),
        fuelLogService.getAverageConsumption(vehicleId)
      ])
      setFuelLogs(logsResponse.data || [])
      setAverageConsumption(avgResponse.data?.averageConsumptionKmPerLiter || null)
      setError(null)
    } catch (err) {
      setError(err.message)
      setFuelLogs([])
      setAverageConsumption(null)
    } finally {
      setLoading(false)
    }
  }, [])

  const handleVehicleSelect = (vehicle) => {
    setSelectedVehicle(vehicle)
    setShowForm(false)
    setEditingLog(null)
    fetchFuelLogsForVehicle(vehicle.id)
  }

  const handleAddNew = () => {
    if (!selectedVehicle) {
      setError('Please select a vehicle first')
      return
    }
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
        if (selectedVehicle) {
          await fetchFuelLogsForVehicle(selectedVehicle.id)
        }
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
      if (selectedVehicle) {
        await fetchFuelLogsForVehicle(selectedVehicle.id)
      }
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="container">
      <h1 className="page-title">Fuel Logs</h1>
      
      {error && <div className="alert alert-error">{error}</div>}

      {/* Vehicle Selection */}
      <div className="card" style={{ marginBottom: '20px' }}>
        <div className="card-title">Select a Vehicle</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '15px' }}>
          {vehicles.map((vehicle) => (
            <div
              key={vehicle.id}
              onClick={() => handleVehicleSelect(vehicle)}
              style={{
                padding: '15px',
                border: selectedVehicle?.id === vehicle.id ? '2px solid #007bff' : '1px solid #ddd',
                borderRadius: '8px',
                cursor: 'pointer',
                backgroundColor: selectedVehicle?.id === vehicle.id ? '#e7f3ff' : '#fff',
                transition: 'all 0.2s'
              }}
            >
              <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>
                {vehicle.make} {vehicle.model}
              </div>
              <div style={{ fontSize: '0.9em', color: '#666' }}>
                {vehicle.licensePlate}
              </div>
              <div style={{ fontSize: '0.85em', color: '#999', marginTop: '5px' }}>
                {vehicle.year}
              </div>
            </div>
          ))}
        </div>
        {vehicles.length === 0 && (
          <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
            No vehicles found. Please add vehicles first.
          </div>
        )}
      </div>

      {/* Fuel Logs Section - Only show when vehicle is selected */}
      {selectedVehicle && (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ margin: 0 }}>
              Fuel Logs for {selectedVehicle.make} {selectedVehicle.model} ({selectedVehicle.licensePlate})
            </h2>
            <button className="btn btn-primary" onClick={handleAddNew}>
              + Add Fuel Log
            </button>
          </div>

          {averageConsumption !== null && (
            <div className="alert" style={{ backgroundColor: '#e7f3ff', border: '1px solid #007bff', marginBottom: '20px' }}>
              <strong>Average Fuel Consumption:</strong> {averageConsumption.toFixed(2)} km/L
            </div>
          )}

          {showForm && (
            <FuelLogForm
              fuelLog={editingLog}
              selectedVehicleId={selectedVehicle.id}
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
        </>
      )}

      {!selectedVehicle && (
        <div className="empty-state">
          <div className="empty-state-icon">🚗</div>
          <div className="empty-state-title">Select a vehicle to view fuel logs</div>
          <p>Click on a vehicle above to see its fuel logs</p>
        </div>
      )}
    </div>
  )
}

export default FuelLogsPage
