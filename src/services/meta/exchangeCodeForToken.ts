const META_TOKEN_URL = 'https://graph.facebook.com/v18.0/oauth/access_token'

interface TokenExchangeParams {
  code: string
  clientId: string
  clientSecret: string
  redirectUri: string
}

interface TokenResponse {
  accessToken: string
  expiresIn: number
}

export async function exchangeCodeForToken(params: TokenExchangeParams): Promise<TokenResponse> {
  const queryParams = new URLSearchParams({
    client_id: params.clientId,
    client_secret: params.clientSecret,
    redirect_uri: params.redirectUri,
    code: params.code,
  })

  const response = await fetch(`${META_TOKEN_URL}?${queryParams.toString()}`)
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error?.message || 'Failed to exchange code for token')
  }

  const data = await response.json()
  
  return {
    accessToken: data.access_token,
    expiresIn: data.expires_in,
  }
}
