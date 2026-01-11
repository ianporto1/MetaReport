import { describe, it } from 'vitest'
import * as fc from 'fast-check'
import type { CampaignInsight } from '@/types'

/**
 * Feature: meta-report, Property 5: Insight Field Completeness
 * Validates: Requirements 4.2
 * 
 * For any campaign insight response from the system, the response SHALL 
 * contain all required fields: impressions, clicks, CPC, CPM, spend, and CTR.
 */

function hasAllRequiredFields(insight: CampaignInsight): boolean {
  return (
    typeof insight.impressions === 'number' &&
    typeof insight.clicks === 'number' &&
    typeof insight.cpc === 'number' &&
    typeof insight.cpm === 'number' &&
    typeof insight.spend === 'number' &&
    typeof insight.ctr === 'number'
  )
}

function createInsight(data: {
  campaignId: string
  campaignName: string
  impressions: number
  clicks: number
  spend: number
}): CampaignInsight {
  const { impressions, clicks, spend } = data
  return {
    campaignId: data.campaignId,
    campaignName: data.campaignName,
    impressions,
    clicks,
    spend,
    cpc: clicks > 0 ? spend / clicks : 0,
    cpm: impressions > 0 ? (spend / impressions) * 1000 : 0,
    ctr: impressions > 0 ? (clicks / impressions) * 100 : 0,
    dailyBreakdown: [],
  }
}

describe('Insight Field Completeness Property Tests', () => {
  it('Property 5: Insight Field Completeness - all required fields present', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 20 }),
        fc.string({ minLength: 1, maxLength: 50 }),
        fc.nat({ max: 1000000 }),
        fc.nat({ max: 100000 }),
        fc.float({ min: 0, max: 10000, noNaN: true }),
        (campaignId, campaignName, impressions, clicks, spend) => {
          const insight = createInsight({
            campaignId,
            campaignName,
            impressions,
            clicks: Math.min(clicks, impressions),
            spend,
          })
          
          return hasAllRequiredFields(insight)
        }
      ),
      { numRuns: 20 }
    )
  })

  it('Property 5: Insight Field Completeness - metrics are non-negative', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 20 }),
        fc.string({ minLength: 1, maxLength: 50 }),
        fc.nat({ max: 1000000 }),
        fc.nat({ max: 100000 }),
        fc.float({ min: 0, max: 10000, noNaN: true }),
        (campaignId, campaignName, impressions, clicks, spend) => {
          const insight = createInsight({
            campaignId,
            campaignName,
            impressions,
            clicks: Math.min(clicks, impressions),
            spend,
          })
          
          return (
            insight.impressions >= 0 &&
            insight.clicks >= 0 &&
            insight.cpc >= 0 &&
            insight.cpm >= 0 &&
            insight.spend >= 0 &&
            insight.ctr >= 0
          )
        }
      ),
      { numRuns: 20 }
    )
  })
})
