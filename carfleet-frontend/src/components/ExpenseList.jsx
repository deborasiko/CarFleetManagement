import { formatDate } from '../utils/dateUtils'

function ExpenseList({ expenses, onEdit, onDelete }) {
  if (expenses.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">💰</div>
        <div className="empty-state-title">No expenses found</div>
        <p>Add your first expense to get started</p>
      </div>
    )
  }

  return (
    <div className="card">
      <table className="table">
        <thead>
          <tr>
            <th>Vehicle</th>
            <th>Category</th>
            <th>Amount</th>
            <th>Date</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((expense) => (
            <tr key={expense.id}>
              <td data-label="Vehicle">{expense.vehicleId}</td>
              <td data-label="Category">{expense.category || expense.expenseType}</td>
              <td data-label="Amount">${expense.amount?.toFixed(2) || '0.00'}</td>
              <td data-label="Date">{formatDate(expense.date || expense.expenseDate)}</td>
              <td data-label="Description">{expense.description}</td>
              <td data-label="Actions">
                <button
                  className="btn btn-secondary"
                  onClick={() => onEdit(expense)}
                  style={{ marginRight: '5px', marginBottom: '5px' }}
                >
                  Edit
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => onDelete(expense.id)}
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

export default ExpenseList
