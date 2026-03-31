/**
 * Safely format a date string to local date format
 * @param {string|Date|null|undefined} dateValue - The date value to format
 * @returns {string} Formatted date string or '-' if invalid
 */
export const formatDate = (dateValue) => {
  if (!dateValue) return '-'
  
  try {
    const date = new Date(dateValue)
    // Check if date is valid
    if (isNaN(date.getTime())) return '-'
    
    return date.toLocaleDateString()
  } catch (error) {
    console.error('Error formatting date:', error)
    return '-'
  }
}

/**
 * Get today's date in YYYY-MM-DD format for date input fields
 * @returns {string} Today's date in YYYY-MM-DD format
 */
export const getTodayDateString = () => {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}
