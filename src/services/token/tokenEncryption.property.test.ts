import { describe, it, expect } from 'vitest'
import * as fc from 'fast-check'
import { encryptToken } from './encryptToken'
import { decryptToken } from './decryptToken'

/**
 * Feature: meta-report, Property 2: Token Encryption Round-Trip
 * Validates: Requirements 2.2, 8.2
 * 
 * For any valid access token, encrypting and then decrypting the token 
 * SHALL produce the original token value. Additionally, the encrypted 
 * value SHALL NOT equal the original token.
 */
describe('Token Encryption Property Tests', () => {
  // Generate a valid 32-byte hex key (64 hex characters)
  const validKey = '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef'

  it('Property 2: Token Encryption Round-Trip - decrypt(encrypt(token)) === token', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 500 }),
        (token) => {
          const encrypted = encryptToken(token, validKey)
          const decrypted = decryptToken(encrypted, validKey)
          
          return decrypted === token
        }
      ),
      { numRuns: 20 }
    )
  })

  it('Property 2: Token Encryption Round-Trip - encrypted !== original', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 500 }),
        (token) => {
          const encrypted = encryptToken(token, validKey)
          
          return encrypted !== token
        }
      ),
      { numRuns: 20 }
    )
  })

  it('Property 2: Token Encryption Round-Trip - different encryptions for same token', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 500 }),
        (token) => {
          const encrypted1 = encryptToken(token, validKey)
          const encrypted2 = encryptToken(token, validKey)
          
          // Due to random IV, encryptions should be different
          // But both should decrypt to the same value
          const decrypted1 = decryptToken(encrypted1, validKey)
          const decrypted2 = decryptToken(encrypted2, validKey)
          
          return encrypted1 !== encrypted2 && decrypted1 === token && decrypted2 === token
        }
      ),
      { numRuns: 20 }
    )
  })
})
