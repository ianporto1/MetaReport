import type { CampaignInsight, MetricTotals } from '@/types'

export function calculateTotals(campaigns: CampaignInsight[]): MetricTotals {
  const totals = campaigns.reduce(
    (acc, campaign) => ({
      impressions: acc.impressions + campaign.impressions,
      clicks: acc.clicks + campaign.clicks,
      spend: acc.spend + campaign.spend,
    }),
    { impressions: 0, clicks: 0, spend: 0 }
  )

  return {
    impressions: totals.impressions,
    clicks: totals.clicks,
    spend: totals.spend,
    avgCpc: totals.clicks > 0 ? totals.spend / totals.clicks : 0,
    avgCpm: totals.impressions > 0 ? (totals.spend / totals.impressions) * 1000 : 0,
    avgCtr: totals.impressions > 0 ? (totals.clicks / totals.impressions) * 100 : 0,
  }
}
