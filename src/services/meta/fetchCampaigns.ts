const META_GRAPH_URL = 'https://graph.facebook.com/v18.0'

export interface Campaign {
  id: string
  name: string
  status: string
  objective: string
}

interface MetaCampaignResponse {
  data: Array<{
    id: string
    name: string
    status: string
    objective: string
  }>
}

export async function fetchCampaigns(accessToken: string, accountId: string): Promise<Campaign[]> {
  const url = `${META_GRAPH_URL}/act_${accountId.replace('act_', '')}/campaigns?fields=id,name,status,objective&access_token=${accessToken}`
  
  const response = await fetch(url)
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error?.message || 'Failed to fetch campaigns')
  }

  const data: MetaCampaignResponse = await response.json()
  
  return data.data.map(campaign => ({
    id: campaign.id,
    name: campaign.name,
    status: campaign.status,
    objective: campaign.objective,
  }))
}
