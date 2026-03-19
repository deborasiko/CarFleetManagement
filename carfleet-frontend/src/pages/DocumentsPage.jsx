import { useState, useEffect, useCallback } from 'react'
import { documentService } from '../services/apiService'
import DocumentList from '../components/DocumentList'
import DocumentForm from '../components/DocumentForm'

function DocumentsPage() {
  const [documents, setDocuments] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [editingDocument, setEditingDocument] = useState(null)

  const fetchDocuments = useCallback(async () => {
    try {
      setLoading(true)
      const response = await documentService.getAll()
      setDocuments(response.data || [])
      setError(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchDocuments()
  }, [fetchDocuments])

  const handleAddNew = () => {
    setEditingDocument(null)
    setShowForm(true)
  }

  const handleEdit = (document) => {
    setEditingDocument(document)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      try {
        await documentService.delete(id)
        await fetchDocuments()
      } catch (err) {
        setError(err.message)
      }
    }
  }

  const handleSave = async (formData) => {
    try {
      if (editingDocument) {
        await documentService.update(editingDocument.id, formData)
      } else {
        await documentService.create(formData)
      }
      setShowForm(false)
      await fetchDocuments()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="container">
      <h1 className="page-title">Documents</h1>
      
      <div className="btn-group">
        <button className="btn btn-primary" onClick={handleAddNew}>
          + Add New Document
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {showForm && (
        <DocumentForm
          document={editingDocument}
          onSave={handleSave}
          onCancel={() => setShowForm(false)}
        />
      )}

      {loading ? (
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading documents...</p>
        </div>
      ) : (
        <DocumentList
          documents={documents}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </div>
  )
}

export default DocumentsPage
