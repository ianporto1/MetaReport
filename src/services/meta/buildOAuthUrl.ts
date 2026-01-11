import { randomBytes } from 'crypto'

const META_OAUTH_BASE = 'https://www.facebook.com/v18.0/dialog/oauth'
const REQUIRED_SCOPES = ['ads_read', 'business_management']

interface OAuthUrlParams {
  clientId: string
  redirectUri: string
  state?: string
}

export interface OAuthUrlResult {
  url: string
  state: string
}

export function buildOAuthUrl(params: OAuthUrlParams): OAuthUrlResult {
  const state = params.state || randomBytes(16).toString('hex')
  
  const queryParams = new URLSearchParams({
    client_id: params.clientId,
    redirect_uri: params.redirectUri,
    scope: REQUIRED_SCOPES.join(','),
    response_type: 'code',
    state: state,
  })

  return {
    url: `${META_OAUTH_BASE}?${queryParams.toString()}`,
    state,
  }
}
