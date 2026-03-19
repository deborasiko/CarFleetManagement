import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom'
import './styles/app.css'

// Pages
import Dashboard from './pages/Dashboard'
import VehiclesPage from './pages/VehiclesPage'
import DriversPage from './pages/DriversPage'
import TripsPage from './pages/TripsPage'
import ExpensesPage from './pages/ExpensesPage'
import FuelLogsPage from './pages/FuelLogsPage'
import ServiceRecordsPage from './pages/ServiceRecordsPage'
import DocumentsPage from './pages/DocumentsPage'
import VehicleAssignmentsPage from './pages/VehicleAssignmentsPage'
import FleetLocationsPage from './pages/FleetLocationsPage'

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard')

  return (
    <Router>
      <div className="app">
        <div className="sidebar">
          <h1>🚗 Fleet Manager</h1>
          <ul className="nav-menu">
            <li className="nav-item">
              <NavLink 
                to="/" 
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                📊 Dashboard
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink 
                to="/vehicles" 
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                🚙 Vehicles
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink 
                to="/drivers" 
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                👤 Drivers
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink 
                to="/trips" 
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                🛣️ Trips
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink 
                to="/expenses" 
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                💰 Expenses
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink 
                to="/fuel-logs" 
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                ⛽ Fuel Logs
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink 
                to="/service-records" 
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                🔧 Service Records
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink 
                to="/documents" 
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                📄 Documents
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink 
                to="/assignments" 
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                📋 Assignments
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink 
                to="/fleet-locations" 
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                📍 Fleet Locations
              </NavLink>
            </li>
          </ul>
        </div>

        <div className="main-content">
          <div className="header">
            <h2>Car Fleet Management System</h2>
          </div>
          <div className="content">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/vehicles" element={<VehiclesPage />} />
              <Route path="/drivers" element={<DriversPage />} />
              <Route path="/trips" element={<TripsPage />} />
              <Route path="/expenses" element={<ExpensesPage />} />
              <Route path="/fuel-logs" element={<FuelLogsPage />} />
              <Route path="/service-records" element={<ServiceRecordsPage />} />
              <Route path="/documents" element={<DocumentsPage />} />
              <Route path="/assignments" element={<VehicleAssignmentsPage />} />
              <Route path="/fleet-locations" element={<FleetLocationsPage />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  )
}

export default App
