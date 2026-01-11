import type { CampaignInsight } from './campaignInsight'

export interface Report {
  id: string
  userId: string
  metaAccountId: string
  startDate: Date
  endDate: Date
  compareStartDate?: Date
  compareEndDate?: Date
  data: ReportData
  createdAt: Date
}

export interface ReportData {
  campaigns: CampaignInsight[]
  totals: MetricTotals
  comparison?: ComparisonData
}

export interface MetricTotals {
  impressions: number
  clicks: number
  spend: number
  avgCpc: number
  avgCpm: number
  avgCtr: number
}

export interface ComparisonData {
  previousTotals: MetricTotals
  percentageChange: {
    impressions: number
    clicks: number
    spend: number
    cpc: number
    cpm: number
    ctr: number
  }
}
