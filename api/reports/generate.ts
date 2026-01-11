import type { VercelRequest, VercelResponse } from '@vercel/node'
import { createClient } from '@supabase/supabase-js'
import { fetchInsights } from '../../src/services/meta/fetchInsights'
import { decryptToken } from '../../src/services/token/decryptToken'
import { validateDateRange } from '../../src/services/meta/validateDateRange'
import { consolidateByCampaign } from '../../src/services/report/consolidateByCampaign'
import { calculateTotals } from '../../src/services/report/calculateTotals'
import { compareMetrics } from '../../src/services/report/compareMetrics'
import type { ReportData } from '../../src/types'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const authHeader = req.headers.authorization
  if (!authHeader) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const { accountId, startDate, endDate, compareStartDate, compareEndDate } = req.body

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
      .select('id, access_token_encrypted')
      .eq('user_id', user.id)
      .single()

    if (accountError || !metaAccount) {
      return res.status(404).json({ error: 'Meta account not connected' })
    }

    const accessToken = decryptToken(metaAccount.access_token_encrypted, encryptionKey)
    
    // Fetch current period insights
    const insights = await fetchInsights({
      accessToken,
      accountId,
      startDate,
      endDate,
    })

    const campaigns = consolidateByCampaign(insights)
    const totals = calculateTotals(campaigns)

    const reportData: ReportData = {
      campaigns,
      totals,
    }

    // Fetch comparison period if provided
    if (compareStartDate && compareEndDate && validateDateRange(compareStartDate, compareEndDate)) {
      const compareInsights = await fetchInsights({
        accessToken,
        accountId,
        startDate: compareStartDate,
        endDate: compareEndDate,
      })

      const compareCampaigns = consolidateByCampaign(compareInsights)
      const compareTotals = calculateTotals(compareCampaigns)
      reportData.comparison = compareMetrics(totals, compareTotals)
    }

    // Save report to database
    const { data: savedReport, error: saveError } = await supabase
      .from('reports')
      .insert({
        user_id: user.id,
        meta_account_id: metaAccount.id,
        start_date: startDate,
        end_date: endDate,
        compare_start_date: compareStartDate || null,
        compare_end_date: compareEndDate || null,
        data: reportData as unknown,
      })
      .select()
      .single()

    if (saveError) {
      console.error('Error saving report:', saveError)
      return res.status(500).json({ error: 'Failed to save report' })
    }

    return res.status(200).json({ report: savedReport })
  } catch (error) {
    console.error('Error generating report:', error)
    return res.status(500).json({ error: 'Failed to generate report' })
  }
}
