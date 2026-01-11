import { describe, it } from 'vitest'
import * as fc from 'fast-check'
import { consolidateByCampaign } from './consolidateByCampaign'
import type { CampaignInsight } from '@/types'

/**
 * Feature: meta-report, Property 8: Campaign Consolidation
 * Validates: Requirements 5.1
 * 
 * For any set of campaign insights, the generated report SHALL group metrics 
 * by campaign ID, with no duplicate campaign entries.
 */

const campaignInsightArb = fc.record({
  campaignId: fc.string({ minLength: 1, maxLength: 20 }),
  campaignName: fc.string({ minLength: 1, maxLength: 50 }),
  impressions: fc.nat({ max: 100000 }),
  clicks: fc.nat({ max: 10000 }),
  cpc: fc.float({ min: 0, max: 10, noNaN: true }),
  cpm: fc.float({ min: 0, max: 100, noNaN: true }),
  spend: fc.float({ min: 0, max: 10000, noNaN: true }),
  ctr: fc.float({ min: 0, max: 100, noNaN: true }),
  dailyBreakdown: fc.constant([]),
}) as fc.Arbitrary<CampaignInsight>

describe('Campaign Consolidation Property Tests', () => {
  it('Property 8: Campaign Consolidation - no duplicate campaign IDs', () => {
    fc.assert(
      fc.property(
        fc.array(campaignInsightArb, { minLength: 1, maxLength: 20 }),
        (insights) => {
          const consolidated = consolidateByCampaign(insights)
          const ids = consolidated.map(c => c.campaignId)
          const uniqueIds = new Set(ids)
          
          return ids.length === uniqueIds.size
        }
      ),
      { numRuns: 20 }
    )
  })

  it('Property 8: Campaign Consolidation - all unique campaigns preserved', () => {
    fc.assert(
      fc.property(
        fc.array(campaignInsightArb, { minLength: 1, maxLength: 20 }),
        (insights) => {
          const uniqueInputIds = new Set(insights.map(i => i.campaignId))
          const consolidated = consolidateByCampaign(insights)
          const outputIds = new Set(consolidated.map(c => c.campaignId))
          
          // All unique input IDs should be in output
          for (const id of uniqueInputIds) {
            if (!outputIds.has(id)) return false
          }
          return true
        }
      ),
      { numRuns: 20 }
    )
  })
})
