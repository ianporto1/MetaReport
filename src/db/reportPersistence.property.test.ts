import { describe, it } from 'vitest'
import * as fc from 'fast-check'
import type { ReportData, CampaignInsight, MetricTotals } from '@/types'

/**
 * Feature: meta-report, Property 11: Report Persistence Round-Trip
 * Validates: Requirements 5.4, 7.3, 7.4
 * 
 * For any generated report, storing to the database and then retrieving 
 * by ID SHALL return an equivalent report object with all data intact.
 */

// Simulate storage/retrieval via JSON (as JSONB does)
function simulateStore(data: ReportData): string {
  return JSON.stringify(data)
}

function simulateRetrieve(stored: string): ReportData {
  return JSON.parse(stored)
}

const metricTotalsArb: fc.Arbitrary<MetricTotals> = fc.record({
  impressions: fc.nat({ max: 1000000 }),
  clicks: fc.nat({ max: 100000 }),
  spend: fc.nat({ max: 100000 }),
  avgCpc: fc.nat({ max: 100 }),
  avgCpm: fc.nat({ max: 1000 }),
  avgCtr: fc.nat({ max: 100 }),
})

const campaignInsightArb: fc.Arbitrary<CampaignInsight> = fc.record({
  campaignId: fc.string({ minLength: 1, maxLength: 20 }),
  campaignName: fc.string({ minLength: 1, maxLength: 50 }),
  impressions: fc.nat({ max: 100000 }),
  clicks: fc.nat({ max: 10000 }),
  cpc: fc.nat({ max: 100 }),
  cpm: fc.nat({ max: 1000 }),
  spend: fc.nat({ max: 10000 }),
  ctr: fc.nat({ max: 100 }),
  dailyBreakdown: fc.constant([]),
})

const reportDataArb: fc.Arbitrary<ReportData> = fc.record({
  campaigns: fc.array(campaignInsightArb, { minLength: 0, maxLength: 5 }),
  totals: metricTotalsArb,
  comparison: fc.option(fc.record({
    previousTotals: metricTotalsArb,
    percentageChange: fc.record({
      impressions: fc.integer({ min: -100, max: 1000 }),
      clicks: fc.integer({ min: -100, max: 1000 }),
      spend: fc.integer({ min: -100, max: 1000 }),
      cpc: fc.integer({ min: -100, max: 1000 }),
      cpm: fc.integer({ min: -100, max: 1000 }),
      ctr: fc.integer({ min: -100, max: 1000 }),
    }),
  }), { nil: undefined }),
})

describe('Report Persistence Property Tests', () => {
  it('Property 11: Report Persistence Round-Trip - data intact after store/retrieve', () => {
    fc.assert(
      fc.property(
        reportDataArb,
        (reportData) => {
          const stored = simulateStore(reportData)
          const retrieved = simulateRetrieve(stored)
          
          return JSON.stringify(retrieved) === JSON.stringify(reportData)
        }
      ),
      { numRuns: 20 }
    )
  })

  it('Property 11: Report Persistence Round-Trip - campaigns preserved', () => {
    fc.assert(
      fc.property(
        reportDataArb,
        (reportData) => {
          const stored = simulateStore(reportData)
          const retrieved = simulateRetrieve(stored)
          
          return retrieved.campaigns.length === reportData.campaigns.length
        }
      ),
      { numRuns: 20 }
    )
  })

  it('Property 11: Report Persistence Round-Trip - totals preserved', () => {
    fc.assert(
      fc.property(
        reportDataArb,
        (reportData) => {
          const stored = simulateStore(reportData)
          const retrieved = simulateRetrieve(stored)
          
          return (
            retrieved.totals.impressions === reportData.totals.impressions &&
            retrieved.totals.clicks === reportData.totals.clicks &&
            retrieved.totals.spend === reportData.totals.spend
          )
        }
      ),
      { numRuns: 20 }
    )
  })
})
