import { describe, it } from 'vitest'
import * as fc from 'fast-check'
import { calculatePercentageChange } from './calculatePercentageChange'

/**
 * Feature: meta-report, Property 10: Period Comparison Calculation
 * Validates: Requirements 5.3
 * 
 * For any comparative report with two periods, the percentage change for 
 * each metric SHALL equal ((current - previous) / previous) * 100.
 */

describe('Period Comparison Property Tests', () => {
  it('Property 10: Period Comparison Calculation - formula is correct', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 10000 }),
        fc.integer({ min: 1, max: 10000 }),
        (current, previous) => {
          const result = calculatePercentageChange(current, previous)
          const expected = ((current - previous) / previous) * 100
          
          return Math.abs(result - expected) < 0.0001
        }
      ),
      { numRuns: 20 }
    )
  })

  it('Property 10: Period Comparison Calculation - 100% increase when doubled', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 5000 }),
        (value) => {
          const result = calculatePercentageChange(value * 2, value)
          
          return Math.abs(result - 100) < 0.0001
        }
      ),
      { numRuns: 20 }
    )
  })

  it('Property 10: Period Comparison Calculation - 0% when unchanged', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 10000 }),
        (value) => {
          const result = calculatePercentageChange(value, value)
          
          return Math.abs(result) < 0.0001
        }
      ),
      { numRuns: 20 }
    )
  })

  it('Property 10: Period Comparison Calculation - negative when decreased', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 100, max: 5000 }),
        fc.integer({ min: 1, max: 99 }),
        (previous, percentDecrease) => {
          const current = Math.floor(previous * (100 - percentDecrease) / 100)
          const result = calculatePercentageChange(current, previous)
          
          return result < 0
        }
      ),
      { numRuns: 20 }
    )
  })
})
