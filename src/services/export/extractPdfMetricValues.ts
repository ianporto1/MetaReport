/**
 * Extracts metric values from PDF buffer content.
 * Used for testing PDF completeness.
 */
export function extractPdfMetricValues(buffer: Buffer): number[] {
  const content = buffer.toString('utf-8')
  const metricRegex = /:\s*(\d+)/g
  const values: number[] = []
  
  let match
  while ((match = metricRegex.exec(content)) !== null) {
    values.push(Number(match[1]))
  }
  
  return values
}
