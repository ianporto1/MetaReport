import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { MetricsCards } from '@/components/MetricsCards'
import { CampaignChart } from '@/components/CampaignChart'
import { DailyChart } from '@/components/DailyChart'
import { useAuth } from '@/hooks/useAuth'
import type { ReportData, DailyMetric } from '@/types'
import './ReportDetailPage.css'

export function ReportDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { session } = useAuth()
  const [report, setReport] = useState<{ data: ReportData; start_date: string; end_date: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!session?.access_token || !id) return

    const fetchReport = async () => {
      try {
        const response = await fetch(`/api/reports/${id}`, {
          headers: { Authorization: `Bearer ${session.access_token}` },
        })

        if (!response.ok) throw new Error('Relatório não encontrado')

        const { report } = await response.json()
        setReport(report)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro desconhecido')
      } finally {
        setLoading(false)
      }
    }

    fetchReport()
  }, [session?.access_token, id])

  const handleExport = (format: 'pdf' | 'csv') => {
    window.open(`/api/reports/${id}/export?format=${format}`, '_blank')
  }

  if (loading) return <div className="report-detail-loading">Carregando...</div>
  if (error) return <div className="error-message">{error}</div>
  if (!report) return null

  const dailyData = aggregateDailyData(report.data)

  return (
    <div className="report-detail-page">
      <header className="report-detail-header">
        <h1>Relatório {report.start_date} - {report.end_date}</h1>
        <div className="export-buttons">
          <button onClick={() => handleExport('pdf')}>Exportar PDF</button>
          <button onClick={() => handleExport('csv')}>Exportar CSV</button>
        </div>
      </header>

      <div className="report-detail-content">
        <MetricsCards totals={report.data.totals} comparison={report.data.comparison} />
        <div className="charts-grid">
          <CampaignChart campaigns={report.data.campaigns} />
          {dailyData.length > 0 && <DailyChart data={dailyData} />}
        </div>
      </div>
    </div>
  )
}

function aggregateDailyData(data: ReportData): DailyMetric[] {
  if (!data?.campaigns.length) return []
  return data.campaigns[0]?.dailyBreakdown || []
}
