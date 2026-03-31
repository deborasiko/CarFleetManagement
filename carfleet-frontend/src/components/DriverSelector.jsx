import { useState, useEffect, useRef } from 'react'
import { driverService } from '../services/apiService'

function DriverSelector({ value, onChange, required = false }) {
  const [drivers, setDrivers] = useState([])
  const [filteredDrivers, setFilteredDrivers] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [selectedDriver, setSelectedDriver] = useState(null)
  const [loading, setLoading] = useState(false)
  const dropdownRef = useRef(null)

  // Fetch all drivers on mount
  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        setLoading(true)
        const response = await driverService.getAll()
        setDrivers(response.data || [])
        setFilteredDrivers(response.data || [])
        
        // If there's a value, find and set the selected driver
        if (value) {
          const driver = (response.data || []).find(d => d.id === value)
          if (driver) {
            setSelectedDriver(driver)
            setSearchTerm(`${driver.firstName} ${driver.lastName}`)
          }
        }
      } catch (error) {
        console.error('Error fetching drivers:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchDrivers()
  }, [value])

  // Filter drivers based on search term
  useEffect(() => {
    if (searchTerm === '' || selectedDriver) {
      setFilteredDrivers(drivers)
    } else {
      const filtered = drivers.filter(driver => {
        const searchLower = searchTerm.toLowerCase()
        const fullName = `${driver.firstName} ${driver.lastName}`.toLowerCase()
        return (
          fullName.includes(searchLower) ||
          driver.email?.toLowerCase().includes(searchLower) ||
          driver.phone?.toLowerCase().includes(searchLower) ||
          driver.licenseNumber?.toLowerCase().includes(searchLower)
        )
      })
      setFilteredDrivers(filtered)
    }
  }, [searchTerm, drivers, selectedDriver])

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

  const handleSelectDriver = (driver) => {
    setSelectedDriver(driver)
    setSearchTerm(`${driver.firstName} ${driver.lastName}`)
    setIsOpen(false)
    onChange(driver.id)
  }

  const handleInputChange = (e) => {
    const value = e.target.value
    setSearchTerm(value)
    setSelectedDriver(null)
    setIsOpen(true)
    
    // Clear the driver selection if user is typing
    if (value === '') {
      onChange(0)
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
        placeholder="Search by name, email, phone, or license..."
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
              Loading drivers...
            </div>
          ) : filteredDrivers.length === 0 ? (
            <div style={{ padding: '12px', textAlign: 'center', color: '#666' }}>
              No drivers found
            </div>
          ) : (
            filteredDrivers.map(driver => (
              <div
                key={driver.id}
                onClick={() => handleSelectDriver(driver)}
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
                  {driver.firstName} {driver.lastName}
                </div>
                <div style={{ fontSize: '12px', color: '#666' }}>
                  License: {driver.licenseNumber} | Phone: {driver.phone}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}

export default DriverSelector
