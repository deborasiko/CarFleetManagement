import { formatDate } from '../utils/dateUtils'

function DocumentList({ documents, onEdit, onDelete }) {
  if (documents.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">📄</div>
        <div className="empty-state-title">No documents found</div>
        <p>Add your first document to get started</p>
      </div>
    )
  }

  return (
    <div className="card">
      <table className="table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Type</th>
            <th>Associated With</th>
            <th>Upload Date</th>
            <th>Expiry Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {documents.map((doc) => (
            <tr key={doc.id}>
              <td data-label="Title">{doc.title}</td>
              <td data-label="Type">{doc.documentType}</td>
              <td data-label="Associated With">{doc.associatedWith || doc.vehicleId || '-'}</td>
              <td data-label="Upload Date">{formatDate(doc.uploadDate || doc.uploadedAt || doc.issueDate)}</td>
              <td data-label="Expiry Date">{formatDate(doc.expiryDate)}</td>
              <td data-label="Actions">
                <button
                  className="btn btn-secondary"
                  onClick={() => onEdit(doc)}
                  style={{ marginRight: '5px', marginBottom: '5px' }}
                >
                  Edit
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => onDelete(doc.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default DocumentList
