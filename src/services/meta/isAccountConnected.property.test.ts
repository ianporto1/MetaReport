import { describe, it, expect } from 'vitest'
import * as fc from 'fast-check'
import { isAccountConnected } from './isAccountConnected'
import type { MetaAccount } from '@/types'

/**
 * Feature: meta-report, Property 3: Connected Account Status
 * Validates: Requirements 2.5
 * 
 * For any Meta account with a valid (non-expired) access token, 
 * the account status SHALL be marked as connected.
 */
describe('Account Connection Status Property Tests', () => {
  const baseAccount: Omit<MetaAccount, 'tokenExpiration' | 'accessTokenEncrypted'> = {
    id: 'test-id',
    userId: 'user-id',
    metaAccountId: 'meta-123',
    name: 'Test Account',
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  it('Property 3: Connected Account Status - valid token returns connected', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 365 * 24 * 60 * 60 * 1000 }), // days in ms
        fc.string({ minLength: 10, maxLength: 200 }), // encrypted token
        (futureMs, encryptedToken) => {
          const futureDate = new Date(Date.now() + futureMs)
          
          const account: MetaAccount = {
            ...baseAccount,
            accessTokenEncrypted: encryptedToken,
            tokenExpiration: futureDate,
          }
          
          return isAccountConnected(account) === true
        }
      ),
      { numRuns: 20 }
    )
  })

  it('Property 3: Connected Account Status - expired token returns disconnected', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 365 * 24 * 60 * 60 * 1000 }), // days in ms
        fc.string({ minLength: 10, maxLength: 200 }),
        (pastMs, encryptedToken) => {
          const pastDate = new Date(Date.now() - pastMs)
          
          const account: MetaAccount = {
            ...baseAccount,
            accessTokenEncrypted: encryptedToken,
            tokenExpiration: pastDate,
          }
          
          return isAccountConnected(account) === false
        }
      ),
      { numRuns: 20 }
    )
  })

  it('Property 3: Connected Account Status - null account returns disconnected', () => {
    expect(isAccountConnected(null)).toBe(false)
  })

  it('Property 3: Connected Account Status - missing token returns disconnected', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 365 * 24 * 60 * 60 * 1000 }),
        (futureMs) => {
          const futureDate = new Date(Date.now() + futureMs)
          
          const account: MetaAccount = {
            ...baseAccount,
            accessTokenEncrypted: '',
            tokenExpiration: futureDate,
          }
          
          return isAccountConnected(account) === false
        }
      ),
      { numRuns: 20 }
    )
  })
})
