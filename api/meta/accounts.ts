import type { VercelRequest, VercelResponse } from '@vercel/node'
import { createClient } from '@supabase/supabase-js'
import { fetchAdAccounts } from '../../src/services/meta/fetchAdAccounts'
import { decryptToken } from '../../src/services/token/decryptToken'
import { handleMetaApiError } from '../../src/services/meta/handleMetaApiError'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const authHeader = req.headers.authorization
  if (!authHeader) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  const encryptionKey = process.env.ENCRYPTION_KEY

  if (!supabaseUrl || !supabaseServiceKey || !encryptionKey) {
    return res.status(500).json({ error: 'Server configuration error' })
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    const token = authHeader.replace('Bearer ', '')
    
    const { data: { user }, error: userError } = await supabase.auth.getUser(token)
    if (userError || !user) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    // Get user's meta account
    const { data: metaAccount, error: accountError } = await supabase
      .from('meta_accounts')
      .select('access_token_encrypted')
      .eq('user_id', user.id)
      .single()

    if (accountError || !metaAccount) {
      return res.status(404).json({ error: 'Meta account not connected' })
    }

    const accessToken = decryptToken(metaAccount.access_token_encrypted, encryptionKey)
    const accounts = await fetchAdAccounts(accessToken)

    return res.status(200).json({ accounts })
  } catch (error: unknown) {
    console.error('Error fetching ad accounts:', error)
    
    if (error && typeof error === 'object' && 'code' in error) {
      const message = handleMetaApiError(error as { code: number; message: string; type: string })
      return res.status(400).json({ error: message })
    }
    
    return res.status(500).json({ error: 'Failed to fetch ad accounts' })
  }
}
