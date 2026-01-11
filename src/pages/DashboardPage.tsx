import { useState, useEffect } from 'react'
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
  const [checkingConnection, setCheckingConnection] = useState(true)
  const [selectedAccount, setSelectedAccount] = useState<AdAccount | null>(null)
  const [startDate, setStartDate] = useState(getDefaultStartDate())
  const [endDate, setEndDate] = useState(getDefaultEndDate())
  const [reportData, setReportData] = useState<ReportData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    checkMetaConnection()
  }, [session?.access_token])

  const checkMetaConnection = async () => {
    if (!session?.access_token) {
      setCheckingConnection(false)
      return
    }

    try {
      const response = await fetch('/api/meta/accounts', {
        headers: { Authorization: `Bearer ${session.access_token}` },
      })
      setIsMetaConnected(response.ok)
    } catch {
      setIsMetaConnected(false)
    } finally {
      setCheckingConnection(false)
    }
  }

  const handleAccountSelect = (account: AdAccount) => {
    setSelectedAccount(account)
  }

  const handleDateChange = (start: string, end: string) => {
    setStartDate(start)
    setEndDate(end)
  }

  const handleGenerateReport = async () => {
    if (!selectedAccount || !session?.access_token) return

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
          accountId: selectedAccount.id,
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

  if (checkingConnection) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-loading">Verificando conexão...</div>
      </div>
    )
  }

  // Step 1: Show OAuth button if not connected
  if (!isMetaConnected) {
    return (
      <div className="dashboard-page">
        <header className="dashboard-header">
          <h1>Dashboard</h1>
        </header>
        <div className="connection-prompt">
          <h2>Conecte sua conta Meta Ads</h2>
          <p>Para gerar relatórios, você precisa conectar sua conta do Facebook.</p>
          <MetaConnectionButton onError={setError} />
          {error && <div className="error-message">{error}</div>}
        </div>
      </div>
    )
  }

  // Step 2: Show account selector if no account selected
  if (!selectedAccount) {
    return (
      <div className="dashboard-page">
        <header className="dashboard-header">
          <h1>Dashboard</h1>
          <span className="connection-status">✓ Meta conectado</span>
        </header>
        {error && <div className="error-message">{error}</div>}
        <div className="account-selection">
          <h2>Selecione uma conta de anúncios</h2>
          <AccountSelector onSelect={handleAccountSelect} onError={setError} />
        </div>
      </div>
    )
  }

  // Step 3: Show full dashboard with report generation
  const dailyData = aggregateDailyData(reportData)

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <h1>Dashboard</h1>
        <div className="header-info">
          <span className="selected-account">{selectedAccount.name}</span>
          <button className="change-account-btn" onClick={() => setSelectedAccount(null)}>
            Trocar conta
          </button>
        </div>
      </header>

      {error && <div className="error-message">{error}</div>}

      <div className="dashboard-controls">
        <DateRangePicker
          startDate={startDate}
          endDate={endDate}
          onDateChange={handleDateChange}
        />
        <button
          className="generate-btn"
          onClick={handleGenerateReport}
          disabled={loading}
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
