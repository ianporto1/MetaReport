export function formatDateForApi(date: Date): string {
  return date.toISOString().split('T')[0]
}
