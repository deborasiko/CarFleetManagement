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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  return (
    <Router>
      <div className="app">
        {/* Mobile Menu Toggle Button */}
        <button 
          className="mobile-menu-toggle" 
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          <span className="hamburger-icon">
            {isMobileMenuOpen ? '✕' : '☰'}
          </span>
        </button>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div 
            className="mobile-menu-overlay" 
            onClick={closeMobileMenu}
          ></div>
        )}

        <div className={`sidebar ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
          <h1>🚗 Fleet Manager</h1>
          <ul className="nav-menu">
            <li className="nav-item">
              <NavLink 
                to="/" 
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                onClick={closeMobileMenu}
              >
                📊 Dashboard
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink 
                to="/vehicles" 
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                onClick={closeMobileMenu}
              >
                🚙 Vehicles
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink 
                to="/drivers" 
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                onClick={closeMobileMenu}
              >
                👤 Drivers
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink 
                to="/trips" 
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                onClick={closeMobileMenu}
              >
                🛣️ Trips
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink 
                to="/expenses" 
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                onClick={closeMobileMenu}
              >
                💰 Expenses
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink 
                to="/fuel-logs" 
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                onClick={closeMobileMenu}
              >
                ⛽ Fuel Logs
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink 
                to="/service-records" 
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                onClick={closeMobileMenu}
              >
                🔧 Service Records
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink 
                to="/documents" 
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                onClick={closeMobileMenu}
              >
                📄 Documents
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink 
                to="/assignments" 
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                onClick={closeMobileMenu}
              >
                📋 Assignments
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink 
                to="/fleet-locations" 
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                onClick={closeMobileMenu}
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
