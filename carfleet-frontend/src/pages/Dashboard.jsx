import { useEffect, useState } from 'react'
import { vehicleService, driverService, tripService, expenseService } from '../services/apiService'

function Dashboard() {
  const [stats, setStats] = useState({
    vehicles: 0,
    drivers: 0,
    trips: 0,
    expenses: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)
        const [vehiclesRes, driversRes, tripsRes, expensesRes] = await Promise.all([
          vehicleService.getAll(),
          driverService.getAll(),
          tripService.getAll(),
          expenseService.getAll(),
        ])

        setStats({
          vehicles: vehiclesRes.data?.length || 0,
          drivers: driversRes.data?.length || 0,
          trips: tripsRes.data?.length || 0,
          expenses: expensesRes.data?.length || 0,
        })
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="error-message">
        Error loading dashboard: {error}
      </div>
    )
  }

  return (
    <div className="container">
      <h1 className="page-title">Dashboard</h1>
      
      <div className="grid">
        <div className="stat-card">
          <div className="stat-card-title">Total Vehicles</div>
          <div className="stat-card-value">{stats.vehicles}</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-card-title">Total Drivers</div>
          <div className="stat-card-value">{stats.drivers}</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-card-title">Total Trips</div>
          <div className="stat-card-value">{stats.trips}</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-card-title">Total Expenses</div>
          <div className="stat-card-value">${stats.expenses}</div>
        </div>
      </div>

      <div className="card" style={{ marginTop: '30px' }}>
        <div className="card-title">Welcome to Fleet Management</div>
        <p>
          Use the navigation menu on the left to manage your vehicle fleet, drivers, trips, 
          and all related information. Track fuel consumption, service records, expenses, 
          and maintain fleet documentation.
        </p>
      </div>
    </div>
  )
}

export default Dashboard
