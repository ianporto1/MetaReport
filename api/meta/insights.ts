import type { VercelRequest, VercelResponse } from '@vercel/node'
import { createClient } from '@supabase/supabase-js'
import { fetchInsights } from '../../src/services/meta/fetchInsights'
import { decryptToken } from '../../src/services/token/decryptToken'
import { validateDateRange } from '../../src/services/meta/validateDateRange'
import { retryWithBackoff } from '../../src/services/meta/retryWithBackoff'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const authHeader = req.headers.authorization
  if (!authHeader) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const { accountId, startDate, endDate } = req.body

  if (!accountId || !startDate || !endDate) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  if (!validateDateRange(startDate, endDate)) {
    return res.status(400).json({ error: 'Invalid date range' })
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

    const { data: metaAccount, error: accountError } = await supabase
      .from('meta_accounts')
      .select('access_token_encrypted')
      .eq('user_id', user.id)
      .single()

    if (accountError || !metaAccount) {
      return res.status(404).json({ error: 'Meta account not connected' })
    }

    const accessToken = decryptToken(metaAccount.access_token_encrypted, encryptionKey)
    
    const campaigns = await retryWithBackoff(() => 
      fetchInsights({
        accessToken,
        accountId,
        startDate,
        endDate,
      })
    )

    return res.status(200).json({ campaigns })
  } catch (error) {
    console.error('Error fetching insights:', error)
    return res.status(500).json({ error: 'Failed to fetch insights' })
  }
}
