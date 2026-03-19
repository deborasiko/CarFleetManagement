import { useState, useEffect, useCallback } from 'react'
import { vehicleAssignmentService } from '../services/apiService'
import VehicleAssignmentList from '../components/VehicleAssignmentList'
import VehicleAssignmentForm from '../components/VehicleAssignmentForm'

function VehicleAssignmentsPage() {
  const [assignments, setAssignments] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [editingAssignment, setEditingAssignment] = useState(null)

  const fetchAssignments = useCallback(async () => {
    try {
      setLoading(true)
      const response = await vehicleAssignmentService.getAll()
      setAssignments(response.data || [])
      setError(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchAssignments()
  }, [fetchAssignments])

  const handleAddNew = () => {
    setEditingAssignment(null)
    setShowForm(true)
  }

  const handleEdit = (assignment) => {
    setEditingAssignment(assignment)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this assignment?')) {
      try {
        await vehicleAssignmentService.delete(id)
        await fetchAssignments()
      } catch (err) {
        setError(err.message)
      }
    }
  }

  const handleSave = async (formData) => {
    try {
      if (editingAssignment) {
        await vehicleAssignmentService.update(editingAssignment.id, formData)
      } else {
        await vehicleAssignmentService.create(formData)
      }
      setShowForm(false)
      await fetchAssignments()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="container">
      <h1 className="page-title">Vehicle Assignments</h1>
      
      <div className="btn-group">
        <button className="btn btn-primary" onClick={handleAddNew}>
          + Add New Assignment
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {showForm && (
        <VehicleAssignmentForm
          assignment={editingAssignment}
          onSave={handleSave}
          onCancel={() => setShowForm(false)}
        />
      )}

      {loading ? (
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading assignments...</p>
        </div>
      ) : (
        <VehicleAssignmentList
          assignments={assignments}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </div>
  )
}

export default VehicleAssignmentsPage
