import type { VercelRequest, VercelResponse } from '@vercel/node'
import { createClient } from '@supabase/supabase-js'
import { exchangeCodeForToken } from '../../../src/services/meta/exchangeCodeForToken'
import { encryptToken } from '../../../src/services/token/encryptToken'
import { calculateTokenExpiration } from '../../../src/services/meta/calculateTokenExpiration'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { code, state, error: oauthError } = req.query

  // Handle OAuth errors or cancellation
  if (oauthError) {
    return res.redirect('/?error=oauth_cancelled')
  }

  if (!code || typeof code !== 'string') {
    return res.redirect('/?error=missing_code')
  }

  // Validate state for CSRF protection
  const cookies = req.headers.cookie || ''
  const storedState = cookies.split(';').find(c => c.trim().startsWith('oauth_state='))?.split('=')[1]
  
  if (!storedState || storedState !== state) {
    console.error('Invalid OAuth state')
    return res.redirect('/?error=invalid_state')
  }

  const clientId = process.env.META_APP_ID
  const clientSecret = process.env.META_APP_SECRET
  const encryptionKey = process.env.ENCRYPTION_KEY
  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  const redirectUri = process.env.META_REDIRECT_URI || `${req.headers.origin}/api/auth/meta/callback`

  if (!clientId || !clientSecret || !encryptionKey || !supabaseUrl || !supabaseServiceKey) {
    console.error('Missing environment variables')
    return res.redirect('/?error=server_error')
  }

  try {
    // Exchange code for access token
    const { accessToken, expiresIn } = await exchangeCodeForToken({
      code,
      clientId,
      clientSecret,
      redirectUri,
    })

    // Encrypt the token
    const encryptedToken = encryptToken(accessToken, encryptionKey)
    const tokenExpiration = calculateTokenExpiration(expiresIn)

    // Get user from authorization header (Supabase JWT)
    const authHeader = req.headers.authorization
    if (!authHeader) {
      return res.redirect('/?error=unauthorized')
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    
    // Decode JWT to get user ID (simplified - in production use proper JWT verification)
    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: userError } = await supabase.auth.getUser(token)
    
    if (userError || !user) {
      return res.redirect('/?error=unauthorized')
    }

    // Store encrypted token temporarily (will be associated with account in next step)
    // Clear the state cookie
    res.setHeader('Set-Cookie', 'oauth_state=; HttpOnly; Secure; SameSite=Lax; Max-Age=0; Path=/')
    
    // Redirect with success and token info for account selection
    return res.redirect(`/connect?token=${encodeURIComponent(encryptedToken)}&expires=${tokenExpiration.toISOString()}`)
  } catch (error) {
    console.error('OAuth callback error:', error)
    return res.redirect('/?error=token_exchange_failed')
  }
}
