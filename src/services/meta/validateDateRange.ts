export function validateDateRange(startDate: string, endDate: string): boolean {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/
  
  if (!dateRegex.test(startDate) || !dateRegex.test(endDate)) {
    return false
  }
  
  const start = new Date(startDate)
  const end = new Date(endDate)
  
  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return false
  }
  
  return start <= end
}
