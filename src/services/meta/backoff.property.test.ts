import { describe, it } from 'vitest'
import * as fc from 'fast-check'
import { calculateBackoffDelay } from './calculateBackoffDelay'

/**
 * Feature: meta-report, Property 7: Exponential Backoff Retry
 * Validates: Requirements 4.5
 * 
 * For any rate-limited request, the retry delay SHALL increase exponentially 
 * with each attempt (delay = baseDelay * 2^attemptNumber).
 */

const BASE_DELAY = 1000

describe('Exponential Backoff Property Tests', () => {
  it('Property 7: Exponential Backoff Retry - delay follows formula', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 10 }),
        (attemptNumber) => {
          const delay = calculateBackoffDelay(attemptNumber)
          const expected = BASE_DELAY * Math.pow(2, attemptNumber)
          
          return delay === expected
        }
      ),
      { numRuns: 20 }
    )
  })

  it('Property 7: Exponential Backoff Retry - delay increases with each attempt', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 9 }),
        (attemptNumber) => {
          const currentDelay = calculateBackoffDelay(attemptNumber)
          const nextDelay = calculateBackoffDelay(attemptNumber + 1)
          
          return nextDelay > currentDelay
        }
      ),
      { numRuns: 20 }
    )
  })

  it('Property 7: Exponential Backoff Retry - delay doubles each attempt', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 9 }),
        (attemptNumber) => {
          const currentDelay = calculateBackoffDelay(attemptNumber)
          const nextDelay = calculateBackoffDelay(attemptNumber + 1)
          
          return nextDelay === currentDelay * 2
        }
      ),
      { numRuns: 20 }
    )
  })
})
