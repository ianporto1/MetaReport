import type { VercelRequest, VercelResponse } from '@vercel/node'
import { buildOAuthUrl } from '../../src/services/meta/buildOAuthUrl'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const clientId = process.env.META_APP_ID
  const redirectUri = process.env.META_REDIRECT_URI || `${req.headers.origin}/api/auth/meta/callback`

  if (!clientId) {
    return res.status(500).json({ error: 'Meta App ID not configured' })
  }

  const { url, state } = buildOAuthUrl({ clientId, redirectUri })

  // Store state in cookie for CSRF validation
  res.setHeader('Set-Cookie', `oauth_state=${state}; HttpOnly; Secure; SameSite=Lax; Max-Age=600; Path=/`)
  
  return res.redirect(302, url)
}
