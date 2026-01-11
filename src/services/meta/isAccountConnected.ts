import type { MetaAccount } from '@/types'

export function isAccountConnected(account: MetaAccount | null): boolean {
  if (!account) return false
  if (!account.accessTokenEncrypted) return false
  if (!account.tokenExpiration) return false
  
  const now = new Date()
  const expiration = new Date(account.tokenExpiration)
  
  return expiration > now
}
