import { supabase } from '@/services/supabase/createClient'
import type { ReportData } from '@/types'
import type { Json } from '@/types/database'

interface SaveReportParams {
  userId: string
  metaAccountId: string
  startDate: string
  endDate: string
  compareStartDate?: string
  compareEndDate?: string
  data: ReportData
}

export async function saveReport(params: SaveReportParams) {
  const { data, error } = await supabase
    .from('reports')
    .insert({
      user_id: params.userId,
      meta_account_id: params.metaAccountId,
      start_date: params.startDate,
      end_date: params.endDate,
      compare_start_date: params.compareStartDate || null,
      compare_end_date: params.compareEndDate || null,
      data: params.data as unknown as Json,
    })
    .select()
    .single()

  if (error) throw error
  return data
}
