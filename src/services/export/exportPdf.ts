import type { ReportData } from '@/types'
import { formatReportToPdfContent } from './formatReportToPdfContent'
import { generatePdfBuffer } from './generatePdfBuffer'

export function exportPdf(
  data: ReportData,
  startDate: string,
  endDate: string
): Buffer {
  const content = formatReportToPdfContent(data, startDate, endDate)
  return generatePdfBuffer(content)
}
