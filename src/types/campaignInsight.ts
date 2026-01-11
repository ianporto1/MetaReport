export interface CampaignInsight {
  campaignId: string
  campaignName: string
  impressions: number
  clicks: number
  cpc: number
  cpm: number
  spend: number
  ctr: number
  dailyBreakdown: DailyMetric[]
}

export interface DailyMetric {
  date: string
  impressions: number
  clicks: number
  cpc: number
  cpm: number
  spend: number
  ctr: number
}
