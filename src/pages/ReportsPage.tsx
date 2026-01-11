import { useState, useEffect } from 'react'
import { ReportList } from '@/components/ReportList'
import { useAuth } from '@/hooks/useAuth'
import './ReportsPage.css'

interface ReportSummary {
  id: string
  start_date: string
  end_date: string
  created_at: string
}

export function ReportsPage() {
  const { session } = useAuth()
  const [reports, setReports] = useState<ReportSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!session?.access_token) return

    const fetchReports = async () => {
      try {
        const response = await fetch('/api/reports', {
          headers: { Authorization: `Bearer ${session.access_token}` },
        })

        if (!response.ok) throw new Error('Falha ao carregar relatórios')

        const { reports } = await response.json()
        setReports(reports)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro desconhecido')
      } finally {
        setLoading(false)
      }
    }

    fetchReports()
  }, [session?.access_token])

  return (
    <div className="reports-page">
      <header className="reports-header">
        <h1>Histórico de Relatórios</h1>
      </header>

      {error && <div className="error-message">{error}</div>}

      <ReportList reports={reports} loading={loading} />
    </div>
  )
}
