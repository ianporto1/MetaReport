import { describe, it } from 'vitest'
import * as fc from 'fast-check'
import { exportPdf } from './exportPdf'
import { extractPdfCampaignNames } from './extractPdfCampaignNames'
import { extractPdfMetricValues } from './extractPdfMetricValues'
import type { ReportData, CampaignInsight, MetricTotals } from '@/types'

/**
 * Feature: meta-report, Property 12: PDF Export Completeness
 * Validates: Requirements 6.1
 * 
 * For any report exported to PDF, the PDF content SHALL contain 
 * all campaign names and metric values from the source report.
 */

const metricTotalsArb: fc.Arbitrary<MetricTotals> = fc.record({
  impressions: fc.nat({ max: 100000 }),
  clicks: fc.nat({ max: 10000 }),
  spend: fc.nat({ max: 10000 }),
  avgCpc: fc.nat({ max: 100 }),
  avgCpm: fc.nat({ max: 1000 }),
  avgCtr: fc.nat({ max: 100 }),
})

const safeStringArb = fc.stringMatching(/^[a-zA-Z0-9]{1,20}$/)

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

describe('PDF Export Property Tests', () => {
  it('Property 12: PDF Export Completeness - all campaign names present', () => {
    fc.assert(
      fc.property(
        reportDataArb,
        (reportData) => {
          const pdf = exportPdf(reportData, '2024-01-01', '2024-01-31')
          const names = extractPdfCampaignNames(pdf)
          
          return reportData.campaigns.every(c => names.includes(c.campaignName))
        }
      ),
      { numRuns: 20 }
    )
  })

  it('Property 12: PDF Export Completeness - metric values present', () => {
    fc.assert(
      fc.property(
        reportDataArb,
        (reportData) => {
          const pdf = exportPdf(reportData, '2024-01-01', '2024-01-31')
          const values = extractPdfMetricValues(pdf)
          
          return reportData.campaigns.every(c => 
            values.includes(c.impressions) && values.includes(c.clicks)
          )
        }
      ),
      { numRuns: 20 }
    )
  })

  it('Property 12: PDF Export Completeness - totals present', () => {
    fc.assert(
      fc.property(
        reportDataArb,
        (reportData) => {
          const pdf = exportPdf(reportData, '2024-01-01', '2024-01-31')
          const values = extractPdfMetricValues(pdf)
          
          return values.includes(reportData.totals.impressions) &&
                 values.includes(reportData.totals.clicks)
        }
      ),
      { numRuns: 20 }
    )
  })
})
