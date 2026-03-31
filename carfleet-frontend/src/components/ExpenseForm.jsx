import { useState, useEffect } from 'react'
import VehicleSelector from './VehicleSelector'
import { getTodayDateString } from '../utils/dateUtils'

function ExpenseForm({ expense, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    vehicleId: 0,
    expenseType: 0,
    amount: 0,
    expenseDate: getTodayDateString(),
    vendor: '',
    description: '',
  })

  useEffect(() => {
    if (expense) {
      setFormData({
        vehicleId: expense.vehicleId || 0,
        expenseType: expense.expenseType || expense.category || 0,
        amount: expense.amount || 0,
        expenseDate: expense.expenseDate?.split('T')[0] || expense.date?.split('T')[0] || '',
        vendor: expense.vendor || '',
        description: expense.description || '',
      })
    }
  }, [expense])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'vehicleId' || name === 'expenseType'
        ? parseInt(value) || 0
        : name === 'amount'
        ? parseFloat(value) || 0
        : value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Convert date to ISO 8601 datetime format
    const expenseDateTime = formData.expenseDate ? `${formData.expenseDate}T00:00:00Z` : new Date().toISOString()
    
    // Prepare data for submission - match ExpenseCreateDto
    const submitData = {
      vehicleId: parseInt(formData.vehicleId),
      expenseType: parseInt(formData.expenseType),
      amount: parseFloat(formData.amount),
      expenseDate: expenseDateTime, // ISO 8601 format with time
      vendor: formData.vendor || '',
      description: formData.description || '',
    }
    
    console.log('Submitting expense data:', submitData)
    onSave(submitData)
  }

  return (
    <div className="card" style={{ marginBottom: '20px' }}>
      <div className="card-title">{expense ? 'Edit Expense' : 'Add New Expense'}</div>
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
          <div className="form-group">
            <label>Vehicle *</label>
            <VehicleSelector
              value={formData.vehicleId}
              onChange={(vehicleId) => setFormData(prev => ({ ...prev, vehicleId }))}
              required
            />
          </div>
          <div className="form-group">
            <label>Expense Type *</label>
            <select name="expenseType" value={formData.expenseType} onChange={handleChange} required>
              <option value="">Select type...</option>
              <option value="0">Insurance</option>
              <option value="1">Maintenance</option>
              <option value="2">Tolls</option>
              <option value="3">Parking</option>
              <option value="4">Repairs</option>
              <option value="5">Cleaning</option>
              <option value="6">Registration</option>
              <option value="7">Other</option>
            </select>
          </div>
          <div className="form-group">
            <label>Amount ($) *</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              required
              step="0.01"
              min="0"
            />
          </div>
          <div className="form-group">
            <label>Expense Date *</label>
            <input
              type="date"
              name="expenseDate"
              value={formData.expenseDate}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Vendor</label>
            <input
              type="text"
              name="vendor"
              value={formData.vendor}
              onChange={handleChange}
              placeholder="e.g., State Insurance Co"
            />
          </div>
          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Additional notes"
            />
          </div>
        </div>
        <div style={{ marginTop: '20px' }}>
          <button type="submit" className="btn btn-success" style={{ marginRight: '10px' }}>
            {expense ? 'Update' : 'Create'} Expense
          </button>
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

export default ExpenseForm
