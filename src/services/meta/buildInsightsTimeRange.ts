export interface TimeRange {
  since: string
  until: string
}

export function buildInsightsTimeRange(startDate: string, endDate: string): TimeRange {
  return {
    since: startDate,
    until: endDate,
  }
}
