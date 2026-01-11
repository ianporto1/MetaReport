/**
 * Extracts campaign names from PDF buffer content.
 * Used for testing PDF completeness.
 */
export function extractPdfCampaignNames(buffer: Buffer): string[] {
  const content = buffer.toString('utf-8')
  const campaignRegex = /Campaign: (.+)/g
  const names: string[] = []
  
  let match
  while ((match = campaignRegex.exec(content)) !== null) {
    names.push(match[1])
  }
  
  return names
}
