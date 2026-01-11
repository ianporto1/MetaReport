import type { ReportData } from '@/types'
import { formatReportToCsvRows } from './formatReportToCsvRows'
import { generateCsvString } from './generateCsvString'

export function exportCsv(data: ReportData): string {
  const rows = formatReportToCsvRows(data)
  return generateCsvString(rows)
}
