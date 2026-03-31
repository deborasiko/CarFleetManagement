import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'
const API_TIMEOUT = import.meta.env.VITE_API_TIMEOUT || 10000

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Vehicle endpoints
export const vehicleService = {
  getAll: () => apiClient.get('/vehicles'),
  getById: (id) => apiClient.get(`/vehicles/${id}`),
  create: (data) => apiClient.post('/vehicles', data),
  update: (id, data) => apiClient.put(`/vehicles/${id}`, data),
  delete: (id) => apiClient.delete(`/vehicles/${id}`),
}

// Driver endpoints
export const driverService = {
  getAll: () => apiClient.get('/drivers'),
  getById: (id) => apiClient.get(`/drivers/${id}`),
  create: (data) => apiClient.post('/drivers', data),
  update: (id, data) => apiClient.put(`/drivers/${id}`, data),
  delete: (id) => apiClient.delete(`/drivers/${id}`),
}

// Trip endpoints
export const tripService = {
  getAll: () => apiClient.get('/trips'),
  getById: (id) => apiClient.get(`/trips/${id}`),
  create: (data) => apiClient.post('/trips', data),
  update: (id, data) => apiClient.put(`/trips/${id}`, data),
  delete: (id) => apiClient.delete(`/trips/${id}`),
}

// Expense endpoints
export const expenseService = {
  getAll: () => apiClient.get('/expenses'),
  getById: (id) => apiClient.get(`/expenses/${id}`),
  create: (data) => apiClient.post('/expenses', data),
  update: (id, data) => apiClient.put(`/expenses/${id}`, data),
  delete: (id) => apiClient.delete(`/expenses/${id}`),
}

// Fuel Log endpoints
export const fuelLogService = {
  getAll: () => apiClient.get('/fuel-logs'),
  getById: (id) => apiClient.get(`/fuel-logs/${id}`),
  create: (data) => apiClient.post('/fuel-logs', data),
  update: (id, data) => apiClient.put(`/fuel-logs/${id}`, data),
  delete: (id) => apiClient.delete(`/fuel-logs/${id}`),
}

// Service Record endpoints
export const serviceRecordService = {
  getAll: () => apiClient.get('/service-records'),
  getById: (id) => apiClient.get(`/service-records/${id}`),
  create: (data) => apiClient.post('/service-records', data),
  update: (id, data) => apiClient.put(`/service-records/${id}`, data),
  delete: (id) => apiClient.delete(`/service-records/${id}`),
}

// Document endpoints
export const documentService = {
  getAll: () => apiClient.get('/documents'),
  getById: (id) => apiClient.get(`/documents/${id}`),
  create: (data) => apiClient.post('/documents', data),
  update: (id, data) => apiClient.put(`/documents/${id}`, data),
  delete: (id) => apiClient.delete(`/documents/${id}`),
}

// Vehicle Assignment endpoints
export const vehicleAssignmentService = {
  getAll: () => apiClient.get('/vehicle-assignments'),
  getById: (id) => apiClient.get(`/vehicle-assignments/${id}`),
  getActiveForVehicle: (vehicleId) => apiClient.get(`/vehicle-assignments/vehicle/${vehicleId}/active`),
  create: (data) => apiClient.post('/vehicle-assignments', data),
  update: (id, data) => apiClient.put(`/vehicle-assignments/${id}`, data),
  delete: (id) => apiClient.delete(`/vehicle-assignments/${id}`),
}

// Fleet Location endpoints
export const fleetLocationService = {
  getAll: () => apiClient.get('/fleet-locations'),
  getById: (id) => apiClient.get(`/fleet-locations/${id}`),
  create: (data) => apiClient.post('/fleet-locations', data),
  update: (id, data) => apiClient.put(`/fleet-locations/${id}`, data),
  delete: (id) => apiClient.delete(`/fleet-locations/${id}`),
}

export default apiClient
