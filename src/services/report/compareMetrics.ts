import type { MetricTotals, ComparisonData } from '@/types'
import { calculatePercentageChange } from './calculatePercentageChange'

export function compareMetrics(current: MetricTotals, previous: MetricTotals): ComparisonData {
  return {
    previousTotals: previous,
    percentageChange: {
      impressions: calculatePercentageChange(current.impressions, previous.impressions),
      clicks: calculatePercentageChange(current.clicks, previous.clicks),
      spend: calculatePercentageChange(current.spend, previous.spend),
      cpc: calculatePercentageChange(current.avgCpc, previous.avgCpc),
      cpm: calculatePercentageChange(current.avgCpm, previous.avgCpm),
      ctr: calculatePercentageChange(current.avgCtr, previous.avgCtr),
    },
  }
}
