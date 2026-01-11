import { supabase } from '@/services/supabase/createClient'

export async function getReportById(reportId: string) {
  const { data, error } = await supabase
    .from('reports')
    .select('*')
    .eq('id', reportId)
    .single()

  if (error) throw error
  return data
}
