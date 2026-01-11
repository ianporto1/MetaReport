import { describe, it, beforeEach } from 'vitest'
import * as fc from 'fast-check'
import { cacheService } from './CacheService'

/**
 * Feature: meta-report, Property 15: Cache Hit Consistency
 * Validates: Requirements 8.5
 * 
 * For any repeated API request with identical parameters within the cache TTL, 
 * the second request SHALL return cached data without calling the Meta API.
 */

describe('Cache Consistency Property Tests', () => {
  beforeEach(() => {
    cacheService.clear()
  })

  it('Property 15: Cache Hit Consistency - get returns set value within TTL', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 50 }),
        fc.jsonValue(),
        (key, value) => {
          cacheService.set(key, value, 60) // 60 second TTL
          const retrieved = cacheService.get(key)
          
          return JSON.stringify(retrieved) === JSON.stringify(value)
        }
      ),
      { numRuns: 20 }
    )
  })

  it('Property 15: Cache Hit Consistency - cache hit returns true for cached keys', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 50 }),
        fc.string({ minLength: 1, maxLength: 100 }),
        (key, value) => {
          cacheService.set(key, value, 60)
          
          return cacheService.has(key) === true
        }
      ),
      { numRuns: 20 }
    )
  })

  it('Property 15: Cache Hit Consistency - uncached keys return null', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 50 }),
        (key) => {
          const result = cacheService.get(key)
          
          return result === null
        }
      ),
      { numRuns: 20 }
    )
  })

  it('Property 15: Cache Hit Consistency - invalidate removes matching keys', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 20 }),
        fc.string({ minLength: 1, maxLength: 100 }),
        (prefix, value) => {
          const key = `${prefix}:test`
          cacheService.set(key, value, 60)
          cacheService.invalidate(`${prefix}:*`)
          
          return cacheService.get(key) === null
        }
      ),
      { numRuns: 20 }
    )
  })
})
