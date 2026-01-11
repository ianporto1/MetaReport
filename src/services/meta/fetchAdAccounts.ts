import type { AdAccount } from '@/types'

const META_GRAPH_URL = 'https://graph.facebook.com/v18.0'

interface MetaAdAccountResponse {
  data: Array<{
    id: string
    name: string
    currency: string
    timezone_name: string
  }>
}

export async function fetchAdAccounts(accessToken: string): Promise<AdAccount[]> {
  const url = `${META_GRAPH_URL}/me/adaccounts?fields=id,name,currency,timezone_name&access_token=${accessToken}`
  
  const response = await fetch(url)
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error?.message || 'Failed to fetch ad accounts')
  }

  const data: MetaAdAccountResponse = await response.json()
  
  return data.data.map(account => ({
    id: account.id,
    name: account.name,
    currency: account.currency,
    timezone: account.timezone_name,
  }))
}
