import type { PdfContent } from './formatReportToPdfContent'

/**
 * Generates a simple text-based PDF representation.
 * In production, use a library like pdfkit or jspdf.
 */
export function generatePdfBuffer(content: PdfContent): Buffer {
  const lines: string[] = []
  
  lines.push(`%PDF-1.4`)
  lines.push(`% ${content.title}`)
  lines.push(``)
  
  content.campaigns.forEach(campaign => {
    lines.push(`Campaign: ${campaign.name}`)
    Object.entries(campaign.metrics).forEach(([key, value]) => {
      lines.push(`  ${key}: ${value}`)
    })
    lines.push(``)
  })

  lines.push(`Totals:`)
  Object.entries(content.totals).forEach(([key, value]) => {
    lines.push(`  ${key}: ${value}`)
  })

  return Buffer.from(lines.join('\n'), 'utf-8')
}
