import { useState, useEffect, useRef } from 'react'
import { vehicleService, vehicleAssignmentService } from '../services/apiService'

function VehicleSelector({ value, onChange, onDriverAssigned, required = false }) {
  const [vehicles, setVehicles] = useState([])
  const [filteredVehicles, setFilteredVehicles] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [selectedVehicle, setSelectedVehicle] = useState(null)
  const [loading, setLoading] = useState(false)
  const dropdownRef = useRef(null)

  // Fetch all vehicles on mount
  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        setLoading(true)
        const response = await vehicleService.getAll()
        setVehicles(response.data || [])
        setFilteredVehicles(response.data || [])
        
        // If there's a value, find and set the selected vehicle
        if (value) {
          const vehicle = (response.data || []).find(v => v.id === value)
          if (vehicle) {
            setSelectedVehicle(vehicle)
            setSearchTerm(`${vehicle.make} ${vehicle.model} - ${vehicle.licensePlate}`)
          }
        }
      } catch (error) {
        console.error('Error fetching vehicles:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchVehicles()
  }, [value])

  // Filter vehicles based on search term
  useEffect(() => {
    if (searchTerm === '' || selectedVehicle) {
      setFilteredVehicles(vehicles)
    } else {
      const filtered = vehicles.filter(vehicle => {
        const searchLower = searchTerm.toLowerCase()
        return (
          vehicle.make?.toLowerCase().includes(searchLower) ||
          vehicle.model?.toLowerCase().includes(searchLower) ||
          vehicle.licensePlate?.toLowerCase().includes(searchLower) ||
          vehicle.vin?.toLowerCase().includes(searchLower)
        )
      })
      setFilteredVehicles(filtered)
    }
  }, [searchTerm, vehicles, selectedVehicle])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Fetch active driver assignment for the vehicle
  const fetchDriverForVehicle = async (vehicleId) => {
    try {
      const response = await vehicleAssignmentService.getActiveForVehicle(vehicleId)
      if (response.data && response.data.driverId) {
        return response.data.driverId
      }
    } catch (error) {
      console.error('Error fetching driver assignment:', error)
    }
    return null
  }

  const handleSelectVehicle = async (vehicle) => {
    setSelectedVehicle(vehicle)
    setSearchTerm(`${vehicle.make} ${vehicle.model} - ${vehicle.licensePlate}`)
    setIsOpen(false)
    onChange(vehicle.id)

    // Fetch and assign driver if callback provided
    if (onDriverAssigned) {
      const driverId = await fetchDriverForVehicle(vehicle.id)
      if (driverId) {
        onDriverAssigned(driverId)
      }
    }
  }

  const handleInputChange = (e) => {
    const value = e.target.value
    setSearchTerm(value)
    setSelectedVehicle(null)
    setIsOpen(true)
    
    // Clear the vehicle selection if user is typing
    if (value === '') {
      onChange(0)
      if (onDriverAssigned) {
        onDriverAssigned(null)
      }
    }
  }

  const handleInputFocus = () => {
    setIsOpen(true)
  }

  return (
    <div ref={dropdownRef} style={{ position: 'relative', width: '100%' }}>
      <input
        type="text"
        value={searchTerm}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        placeholder="Search by make, model, or license plate..."
        required={required}
        style={{
          width: '100%',
          padding: '8px',
          border: '1px solid #ddd',
          borderRadius: '4px',
          fontSize: '14px'
        }}
      />
      
      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            maxHeight: '300px',
            overflowY: 'auto',
            backgroundColor: 'white',
            border: '1px solid #ddd',
            borderRadius: '4px',
            marginTop: '4px',
            zIndex: 1000,
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
          }}
        >
          {loading ? (
            <div style={{ padding: '12px', textAlign: 'center', color: '#666' }}>
              Loading vehicles...
            </div>
          ) : filteredVehicles.length === 0 ? (
            <div style={{ padding: '12px', textAlign: 'center', color: '#666' }}>
              No vehicles found
            </div>
          ) : (
            filteredVehicles.map(vehicle => (
              <div
                key={vehicle.id}
                onClick={() => handleSelectVehicle(vehicle)}
                style={{
                  padding: '10px 12px',
                  cursor: 'pointer',
                  borderBottom: '1px solid #f0f0f0',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#f5f5f5'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
              >
                <div style={{ fontWeight: '500', marginBottom: '4px' }}>
                  {vehicle.make} {vehicle.model} ({vehicle.year})
                </div>
                <div style={{ fontSize: '12px', color: '#666' }}>
                  License: {vehicle.licensePlate} | VIN: {vehicle.vin}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}

export default VehicleSelector
