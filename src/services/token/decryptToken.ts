import { createDecipheriv } from 'crypto'

const ALGORITHM = 'aes-256-gcm'

export function decryptToken(encryptedData: string, encryptionKey: string): string {
  const key = Buffer.from(encryptionKey, 'hex')
  const [ivHex, authTagHex, encrypted] = encryptedData.split(':')
  
  const iv = Buffer.from(ivHex, 'hex')
  const authTag = Buffer.from(authTagHex, 'hex')
  
  const decipher = createDecipheriv(ALGORITHM, key, iv)
  decipher.setAuthTag(authTag)
  
  let decrypted = decipher.update(encrypted, 'hex', 'utf8')
  decrypted += decipher.final('utf8')
  
  return decrypted
}
