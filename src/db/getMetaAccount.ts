import { supabase } from '@/services/supabase/createClient'

export async function getMetaAccount(userId: string) {
  const { data, error } = await supabase
    .from('meta_accounts')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (error && error.code !== 'PGRST116') throw error
  return data
}
