import { useState } from 'react'
import { DateRangePicker } from '@/components/DateRangePicker'
import { MetricsCards } from '@/components/MetricsCards'
import { CampaignChart } from '@/components/CampaignChart'
import { DailyChart } from '@/components/DailyChart'
import { AccountSelector } from '@/components/AccountSelector'
import { MetaConnectionButton } from '@/components/MetaConnectionButton'
import { useAuth } from '@/hooks/useAuth'
import type { ReportData, DailyMetric, AdAccount } from '@/types'
import './DashboardPage.css'

export function DashboardPage() {
  const { session } = useAuth()
  const [isMetaConnected, setIsMetaConnected] = useState(false)
  const [selectedAccountId, setSelectedAccountId] = useState<string>('')
  const [startDate, setStartDate] = useState(getDefaultStartDate())
  const [endDate, setEndDate] = useState(getDefaultEndDate())
  const [reportData, setReportData] = useState<ReportData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleAccountSelect = (account: AdAccount) => {
    setSelectedAccountId(account.id)
    setIsMetaConnected(true)
  }

  const handleDateChange = (start: string, end: string) => {
    setStartDate(start)
    setEndDate(end)
  }

  const handleGenerateReport = async () => {
    if (!selectedAccountId || !session?.access_token) return

    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/reports/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          accountId: selectedAccountId,
          startDate,
          endDate,
        }),
      })

      if (!response.ok) throw new Error('Falha ao gerar relatório')

      const { report } = await response.json()
      setReportData(report.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
    } finally {
      setLoading(false)
    }
  }

  const dailyData = aggregateDailyData(reportData)

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <h1>Dashboard</h1>
        <MetaConnectionButton 
          isConnected={isMetaConnected}
          onError={setError}
        />
      </header>

      {error && <div className="error-message">{error}</div>}

      <div className="dashboard-controls">
        <AccountSelector onSelect={handleAccountSelect} onError={setError} />
        <DateRangePicker
          startDate={startDate}
          endDate={endDate}
          onDateChange={handleDateChange}
        />
        <button
          className="generate-btn"
          onClick={handleGenerateReport}
          disabled={!selectedAccountId || loading}
        >
          {loading ? 'Gerando...' : 'Gerar Relatório'}
        </button>
      </div>

      {reportData && (
        <div className="dashboard-content">
          <MetricsCards totals={reportData.totals} comparison={reportData.comparison} />
          <div className="charts-grid">
            <CampaignChart campaigns={reportData.campaigns} />
            {dailyData.length > 0 && <DailyChart data={dailyData} />}
          </div>
        </div>
      )}
    </div>
  )
}

function getDefaultStartDate(): string {
  const date = new Date()
  date.setDate(date.getDate() - 30)
  return date.toISOString().split('T')[0]
}

function getDefaultEndDate(): string {
  return new Date().toISOString().split('T')[0]
}

function aggregateDailyData(data: ReportData | null): DailyMetric[] {
  if (!data?.campaigns.length) return []
  return data.campaigns[0]?.dailyBreakdown || []
}
