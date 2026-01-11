import type { CsvRow } from './formatReportToCsvRows'

const CSV_HEADERS = [
  'Campaign ID',
  'Campaign Name',
  'Impressions',
  'Clicks',
  'CPC',
  'CPM',
  'Spend',
  'CTR',
]

function escapeCsvValue(value: string | number): string {
  const str = String(value)
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
}

export function generateCsvString(rows: CsvRow[]): string {
  const headerLine = CSV_HEADERS.join(',')
  
  const dataLines = rows.map(row => [
    escapeCsvValue(row.campaignId),
    escapeCsvValue(row.campaignName),
    row.impressions,
    row.clicks,
    row.cpc,
    row.cpm,
    row.spend,
    row.ctr,
  ].join(','))

  return [headerLine, ...dataLines].join('\n')
}
