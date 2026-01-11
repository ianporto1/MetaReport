import type { ReportData } from '@/types'

export interface PdfContent {
  title: string
  campaigns: Array<{
    name: string
    metrics: Record<string, number>
  }>
  totals: Record<string, number>
}

export function formatReportToPdfContent(
  data: ReportData,
  startDate: string,
  endDate: string
): PdfContent {
  return {
    title: `Report ${startDate} - ${endDate}`,
    campaigns: data.campaigns.map(c => ({
      name: c.campaignName,
      metrics: {
        impressions: c.impressions,
        clicks: c.clicks,
        cpc: c.cpc,
        cpm: c.cpm,
        spend: c.spend,
        ctr: c.ctr,
      },
    })),
    totals: {
      impressions: data.totals.impressions,
      clicks: data.totals.clicks,
      spend: data.totals.spend,
      avgCpc: data.totals.avgCpc,
      avgCpm: data.totals.avgCpm,
      avgCtr: data.totals.avgCtr,
    },
  }
}
