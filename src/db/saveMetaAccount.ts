import { supabase } from '@/services/supabase/createClient'
import type { AdAccount } from '@/types'

interface SaveMetaAccountParams {
  userId: string
  account: AdAccount
  encryptedToken: string
  tokenExpiration: Date
}

export async function saveMetaAccount(params: SaveMetaAccountParams) {
  const { data, error } = await supabase
    .from('meta_accounts')
    .upsert({
      user_id: params.userId,
      meta_account_id: params.account.id,
      name: params.account.name,
      access_token_encrypted: params.encryptedToken,
      token_expiration: params.tokenExpiration.toISOString(),
      updated_at: new Date().toISOString(),
    }, {
      onConflict: 'user_id,meta_account_id'
    })
    .select()
    .single()

  if (error) throw error
  return data
}
