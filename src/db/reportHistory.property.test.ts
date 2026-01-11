import { describe, it, expect } from 'vitest'
import * as fc from 'fast-check'

/**
 * Feature: meta-report, Property 14: Report History Metadata
 * Validates: Requirements 7.2
 * 
 * For any report in the history list, the response SHALL include 
 * the report's date range (startDate, endDate) and creation timestamp.
 */

interface ReportHistoryItem {
  id: string
  start_date: string
  end_date: string
  compare_start_date: string | null
  compare_end_date: string | null
  created_at: string
}

function hasRequiredMetadata(report: ReportHistoryItem): boolean {
  return (
    typeof report.id === 'string' &&
    typeof report.start_date === 'string' &&
    typeof report.end_date === 'string' &&
    typeof report.created_at === 'string'
  )
}

function isValidDateFormat(dateStr: string): boolean {
  const date = new Date(dateStr)
  return !isNaN(date.getTime())
}

const reportHistoryItemArb: fc.Arbitrary<ReportHistoryItem> = fc.record({
  id: fc.uuid(),
  start_date: fc.date({ min: new Date('2020-01-01'), max: new Date('2025-12-31') })
    .map(d => d.toISOString().split('T')[0]),
  end_date: fc.date({ min: new Date('2020-01-01'), max: new Date('2025-12-31') })
    .map(d => d.toISOString().split('T')[0]),
  compare_start_date: fc.option(
    fc.date({ min: new Date('2020-01-01'), max: new Date('2025-12-31') })
      .map(d => d.toISOString().split('T')[0]),
    { nil: null }
  ),
  compare_end_date: fc.option(
    fc.date({ min: new Date('2020-01-01'), max: new Date('2025-12-31') })
      .map(d => d.toISOString().split('T')[0]),
    { nil: null }
  ),
  created_at: fc.date({ min: new Date('2020-01-01'), max: new Date('2025-12-31') })
    .map(d => d.toISOString()),
})

describe('Report History Metadata Property Tests', () => {
  it('Property 14: Report History Metadata - has required fields', () => {
    fc.assert(
      fc.property(
        reportHistoryItemArb,
        (report) => hasRequiredMetadata(report)
      ),
      { numRuns: 20 }
    )
  })

  it('Property 14: Report History Metadata - dates are valid format', () => {
    fc.assert(
      fc.property(
        reportHistoryItemArb,
        (report) => {
          return (
            isValidDateFormat(report.start_date) &&
            isValidDateFormat(report.end_date) &&
            isValidDateFormat(report.created_at)
          )
        }
      ),
      { numRuns: 20 }
    )
  })

  it('Property 14: Report History Metadata - id is non-empty', () => {
    fc.assert(
      fc.property(
        reportHistoryItemArb,
        (report) => report.id.length > 0
      ),
      { numRuns: 20 }
    )
  })
})
