import type { DailyMetric } from '@/types'

export function generateDailyBreakdown(startDate: string, endDate: string): string[] {
  const dates: string[] = []
  const current = new Date(startDate)
  const end = new Date(endDate)
  
  while (current <= end) {
    dates.push(current.toISOString().split('T')[0])
    current.setDate(current.getDate() + 1)
  }
  
  return dates
}

export function ensureDailyBreakdown(
  breakdown: DailyMetric[],
  startDate: string,
  endDate: string
): DailyMetric[] {
  const allDates = generateDailyBreakdown(startDate, endDate)
  const existingDates = new Set(breakdown.map(d => d.date))
  
  const result: DailyMetric[] = [...breakdown]
  
  for (const date of allDates) {
    if (!existingDates.has(date)) {
      result.push({
        date,
        impressions: 0,
        clicks: 0,
        cpc: 0,
        cpm: 0,
        spend: 0,
        ctr: 0,
      })
    }
  }
  
  return result.sort((a, b) => a.date.localeCompare(b.date))
}
