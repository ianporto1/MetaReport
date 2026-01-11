import type { ReportData } from '@/types'

export interface CsvRow {
  campaignId: string
  campaignName: string
  impressions: number
  clicks: number
  cpc: number
  cpm: number
  spend: number
  ctr: number
}

export function formatReportToCsvRows(data: ReportData): CsvRow[] {
  return data.campaigns.map(campaign => ({
    campaignId: campaign.campaignId,
    campaignName: campaign.campaignName,
    impressions: campaign.impressions,
    clicks: campaign.clicks,
    cpc: campaign.cpc,
    cpm: campaign.cpm,
    spend: campaign.spend,
    ctr: campaign.ctr,
  }))
}
