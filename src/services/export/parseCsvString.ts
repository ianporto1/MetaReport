import type { CsvRow } from './formatReportToCsvRows'

export function parseCsvString(csv: string): CsvRow[] {
  const lines = csv.trim().split('\n')
  if (lines.length < 2) return []

  // Skip header line
  const dataLines = lines.slice(1)

  return dataLines.map(line => {
    const values = parseCsvLine(line)
    return {
      campaignId: values[0] || '',
      campaignName: values[1] || '',
      impressions: Number(values[2]) || 0,
      clicks: Number(values[3]) || 0,
      cpc: Number(values[4]) || 0,
      cpm: Number(values[5]) || 0,
      spend: Number(values[6]) || 0,
      ctr: Number(values[7]) || 0,
    }
  })
}

function parseCsvLine(line: string): string[] {
  const result: string[] = []
  let current = ''
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const char = line[i]
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"'
        i++
      } else {
        inQuotes = !inQuotes
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current)
      current = ''
    } else {
      current += char
    }
  }
  result.push(current)
  return result
}
