import type { VercelRequest, VercelResponse } from '@vercel/node'
import { createClient } from '@supabase/supabase-js'
import { exportCsv } from '../../../src/services/export/exportCsv'
import { exportPdf } from '../../../src/services/export/exportPdf'
import type { ReportData } from '../../../src/types'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { id, format } = req.query
  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Report ID is required' })
  }

  if (!format || (format !== 'pdf' && format !== 'csv')) {
    return res.status(400).json({ error: 'Format must be pdf or csv' })
  }

  const authHeader = req.headers.authorization
  if (!authHeader) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    return res.status(500).json({ error: 'Server configuration error' })
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    const token = authHeader.replace('Bearer ', '')
    
    const { data: { user }, error: userError } = await supabase.auth.getUser(token)
    if (userError || !user) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    const { data: report, error } = await supabase
      .from('reports')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single()

    if (error || !report) {
      return res.status(404).json({ error: 'Report not found' })
    }

    const reportData = report.data as ReportData

    if (format === 'csv') {
      const csv = exportCsv(reportData)
      res.setHeader('Content-Type', 'text/csv')
      res.setHeader('Content-Disposition', `attachment; filename=report-${id}.csv`)
      return res.status(200).send(csv)
    }

    const pdf = exportPdf(reportData, report.start_date, report.end_date)
    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', `attachment; filename=report-${id}.pdf`)
    return res.status(200).send(pdf)
  } catch (error) {
    console.error('Error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
