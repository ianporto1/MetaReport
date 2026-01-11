import { describe, it } from 'vitest'
import * as fc from 'fast-check'
import { generateDailyBreakdown, ensureDailyBreakdown } from './generateDailyBreakdown'

/**
 * Feature: meta-report, Property 9: Daily Breakdown Presence
 * Validates: Requirements 5.2
 * 
 * For any generated report, each campaign SHALL include a daily breakdown 
 * array with one entry per day in the date range.
 */

describe('Daily Breakdown Property Tests', () => {
  it('Property 9: Daily Breakdown Presence - generates correct number of days', () => {
    fc.assert(
      fc.property(
        fc.date({ min: new Date('2024-01-01'), max: new Date('2024-06-30') }),
        fc.integer({ min: 1, max: 30 }),
        (startDate, daysDiff) => {
          const endDate = new Date(startDate)
          endDate.setDate(endDate.getDate() + daysDiff)
          
          const startStr = startDate.toISOString().split('T')[0]
          const endStr = endDate.toISOString().split('T')[0]
          
          const breakdown = generateDailyBreakdown(startStr, endStr)
          
          return breakdown.length === daysDiff + 1
        }
      ),
      { numRuns: 20 }
    )
  })

  it('Property 9: Daily Breakdown Presence - all dates in range included', () => {
    fc.assert(
      fc.property(
        fc.date({ min: new Date('2024-01-01'), max: new Date('2024-06-30') }),
        fc.integer({ min: 1, max: 14 }),
        (startDate, daysDiff) => {
          const endDate = new Date(startDate)
          endDate.setDate(endDate.getDate() + daysDiff)
          
          const startStr = startDate.toISOString().split('T')[0]
          const endStr = endDate.toISOString().split('T')[0]
          
          const breakdown = generateDailyBreakdown(startStr, endStr)
          
          // First date should be start, last should be end
          return breakdown[0] === startStr && breakdown[breakdown.length - 1] === endStr
        }
      ),
      { numRuns: 20 }
    )
  })

  it('Property 9: Daily Breakdown Presence - ensureDailyBreakdown fills gaps', () => {
    fc.assert(
      fc.property(
        fc.date({ min: new Date('2024-01-01'), max: new Date('2024-06-30') }),
        fc.integer({ min: 3, max: 10 }),
        (startDate, daysDiff) => {
          const endDate = new Date(startDate)
          endDate.setDate(endDate.getDate() + daysDiff)
          
          const startStr = startDate.toISOString().split('T')[0]
          const endStr = endDate.toISOString().split('T')[0]
          
          // Start with empty breakdown
          const result = ensureDailyBreakdown([], startStr, endStr)
          
          return result.length === daysDiff + 1
        }
      ),
      { numRuns: 20 }
    )
  })
})
