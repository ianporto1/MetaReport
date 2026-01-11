import { describe, it } from 'vitest'
import * as fc from 'fast-check'
import { formatReportToCsvRows } from './formatReportToCsvRows'
import { generateCsvString } from './generateCsvString'
import { parseCsvString } from './parseCsvString'
import type { ReportData, CampaignInsight, MetricTotals } from '@/types'

/**
 * Feature: meta-report, Property 13: CSV Export Round-Trip
 * Validates: Requirements 6.2
 * 
 * For any report exported to CSV, parsing the CSV back into structured 
 * data SHALL produce values equivalent to the original report metrics.
 */

const metricTotalsArb: fc.Arbitrary<MetricTotals> = fc.record({
  impressions: fc.nat({ max: 100000 }),
  clicks: fc.nat({ max: 10000 }),
  spend: fc.nat({ max: 10000 }),
  avgCpc: fc.nat({ max: 100 }),
  avgCpm: fc.nat({ max: 1000 }),
  avgCtr: fc.nat({ max: 100 }),
})

// Use alphanumeric strings to avoid CSV parsing edge cases
const safeStringArb = fc.stringMatching(/^[a-zA-Z0-9 _-]{1,30}$/)

const campaignInsightArb: fc.Arbitrary<CampaignInsight> = fc.record({
  campaignId: safeStringArb,
  campaignName: safeStringArb,
  impressions: fc.nat({ max: 100000 }),
  clicks: fc.nat({ max: 10000 }),
  cpc: fc.nat({ max: 100 }),
  cpm: fc.nat({ max: 1000 }),
  spend: fc.nat({ max: 10000 }),
  ctr: fc.nat({ max: 100 }),
  dailyBreakdown: fc.constant([]),
})

const reportDataArb: fc.Arbitrary<ReportData> = fc.record({
  campaigns: fc.array(campaignInsightArb, { minLength: 1, maxLength: 5 }),
  totals: metricTotalsArb,
  comparison: fc.constant(undefined),
})

describe('CSV Export Property Tests', () => {
  it('Property 13: CSV Export Round-Trip - metrics preserved', () => {
    fc.assert(
      fc.property(
        reportDataArb,
        (reportData) => {
          const rows = formatReportToCsvRows(reportData)
          const csv = generateCsvString(rows)
          const parsed = parseCsvString(csv)

          return parsed.length === rows.length &&
            parsed.every((p, i) => 
              p.impressions === rows[i].impressions &&
              p.clicks === rows[i].clicks &&
              p.spend === rows[i].spend
            )
        }
      ),
      { numRuns: 20 }
    )
  })

  it('Property 13: CSV Export Round-Trip - campaign IDs preserved', () => {
    fc.assert(
      fc.property(
        reportDataArb,
        (reportData) => {
          const rows = formatReportToCsvRows(reportData)
          const csv = generateCsvString(rows)
          const parsed = parseCsvString(csv)

          return parsed.every((p, i) => p.campaignId === rows[i].campaignId)
        }
      ),
      { numRuns: 20 }
    )
  })

  it('Property 13: CSV Export Round-Trip - row count matches', () => {
    fc.assert(
      fc.property(
        reportDataArb,
        (reportData) => {
          const rows = formatReportToCsvRows(reportData)
          const csv = generateCsvString(rows)
          const parsed = parseCsvString(csv)

          return parsed.length === reportData.campaigns.length
        }
      ),
      { numRuns: 20 }
    )
  })
})
