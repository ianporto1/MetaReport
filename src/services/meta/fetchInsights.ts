import type { CampaignInsight, DailyMetric } from '@/types'

const META_GRAPH_URL = 'https://graph.facebook.com/v18.0'

interface InsightParams {
  accessToken: string
  accountId: string
  startDate: string
  endDate: string
  campaignIds?: string[]
}

interface MetaInsightData {
  campaign_id: string
  campaign_name: string
  impressions: string
  clicks: string
  cpc: string
  cpm: string
  spend: string
  ctr: string
  date_start: string
  date_stop: string
}

export async function fetchInsights(params: InsightParams): Promise<CampaignInsight[]> {
  const { accessToken, accountId, startDate, endDate } = params
  
  const fields = 'campaign_id,campaign_name,impressions,clicks,cpc,cpm,spend,ctr'
  const timeRange = JSON.stringify({ since: startDate, until: endDate })
  
  const url = `${META_GRAPH_URL}/act_${accountId.replace('act_', '')}/insights?fields=${fields}&time_range=${encodeURIComponent(timeRange)}&level=campaign&time_increment=1&access_token=${accessToken}`
  
  const response = await fetch(url)
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error?.message || 'Failed to fetch insights')
  }

  const data = await response.json()
  
  return transformInsights(data.data || [])
}

function transformInsights(rawData: MetaInsightData[]): CampaignInsight[] {
  const campaignMap = new Map<string, CampaignInsight>()
  
  for (const item of rawData) {
    const campaignId = item.campaign_id
    
    if (!campaignMap.has(campaignId)) {
      campaignMap.set(campaignId, {
        campaignId,
        campaignName: item.campaign_name,
        impressions: 0,
        clicks: 0,
        cpc: 0,
        cpm: 0,
        spend: 0,
        ctr: 0,
        dailyBreakdown: [],
      })
    }
    
    const campaign = campaignMap.get(campaignId)!
    
    const dailyMetric: DailyMetric = {
      date: item.date_start,
      impressions: parseInt(item.impressions || '0', 10),
      clicks: parseInt(item.clicks || '0', 10),
      cpc: parseFloat(item.cpc || '0'),
      cpm: parseFloat(item.cpm || '0'),
      spend: parseFloat(item.spend || '0'),
      ctr: parseFloat(item.ctr || '0'),
    }
    
    campaign.dailyBreakdown.push(dailyMetric)
    campaign.impressions += dailyMetric.impressions
    campaign.clicks += dailyMetric.clicks
    campaign.spend += dailyMetric.spend
  }
  
  // Calculate averages
  for (const campaign of campaignMap.values()) {
    if (campaign.impressions > 0) {
      campaign.ctr = (campaign.clicks / campaign.impressions) * 100
      campaign.cpm = (campaign.spend / campaign.impressions) * 1000
    }
    if (campaign.clicks > 0) {
      campaign.cpc = campaign.spend / campaign.clicks
    }
  }
  
  return Array.from(campaignMap.values())
}
