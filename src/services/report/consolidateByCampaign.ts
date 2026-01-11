import type { CampaignInsight } from '@/types'

export function consolidateByCampaign(insights: CampaignInsight[]): CampaignInsight[] {
  const campaignMap = new Map<string, CampaignInsight>()
  
  for (const insight of insights) {
    if (!campaignMap.has(insight.campaignId)) {
      campaignMap.set(insight.campaignId, { ...insight })
    }
  }
  
  return Array.from(campaignMap.values())
}
