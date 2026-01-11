import { describe, it, expect } from 'vitest'
import * as fc from 'fast-check'
import { buildInsightsTimeRange } from './buildInsightsTimeRange'
import { validateDateRange } from './validateDateRange'
import { formatDateForApi } from './formatDateForApi'

/**
 * Feature: meta-report, Property 6: Date Range Filter Accuracy
 * Validates: Requirements 4.3
 * 
 * For any date range specified by the user, the API request to Meta SHALL 
 * include the exact start and end dates in the correct format.
 */

describe('Date Range Filter Property Tests', () => {
  it('Property 6: Date Range Filter Accuracy - time range contains exact dates', () => {
    fc.assert(
      fc.property(
        fc.date({ min: new Date('2020-01-01'), max: new Date('2025-12-31') }),
        fc.date({ min: new Date('2020-01-01'), max: new Date('2025-12-31') }),
        (date1, date2) => {
          const [startDate, endDate] = date1 <= date2 ? [date1, date2] : [date2, date1]
          
          const startStr = formatDateForApi(startDate)
          const endStr = formatDateForApi(endDate)
          
          const timeRange = buildInsightsTimeRange(startStr, endStr)
          
          return timeRange.since === startStr && timeRange.until === endStr
        }
      ),
      { numRuns: 20 }
    )
  })

  it('Property 6: Date Range Filter Accuracy - date format is YYYY-MM-DD', () => {
    fc.assert(
      fc.property(
        fc.date({ min: new Date('2020-01-01'), max: new Date('2025-12-31') }),
        (date) => {
          const formatted = formatDateForApi(date)
          const dateRegex = /^\d{4}-\d{2}-\d{2}$/
          
          return dateRegex.test(formatted)
        }
      ),
      { numRuns: 20 }
    )
  })

  it('Property 6: Date Range Filter Accuracy - valid ranges pass validation', () => {
    fc.assert(
      fc.property(
        fc.date({ min: new Date('2020-01-01'), max: new Date('2025-12-31') }),
        fc.date({ min: new Date('2020-01-01'), max: new Date('2025-12-31') }),
        (date1, date2) => {
          const [startDate, endDate] = date1 <= date2 ? [date1, date2] : [date2, date1]
          
          const startStr = formatDateForApi(startDate)
          const endStr = formatDateForApi(endDate)
          
          return validateDateRange(startStr, endStr) === true
        }
      ),
      { numRuns: 20 }
    )
  })

  it('Property 6: Date Range Filter Accuracy - invalid format fails validation', () => {
    expect(validateDateRange('2024/01/01', '2024-01-31')).toBe(false)
    expect(validateDateRange('01-01-2024', '2024-01-31')).toBe(false)
    expect(validateDateRange('invalid', '2024-01-31')).toBe(false)
  })
})
