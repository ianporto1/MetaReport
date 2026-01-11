import { Link } from 'react-router-dom'
import './ReportList.css'

interface ReportSummary {
  id: string
  start_date: string
  end_date: string
  created_at: string
}

interface ReportListProps {
  reports: ReportSummary[]
  loading?: boolean
}

export function ReportList({ reports, loading }: ReportListProps) {
  if (loading) {
    return <div className="report-list-loading">Carregando...</div>
  }

  if (reports.length === 0) {
    return <div className="report-list-empty">Nenhum relatório encontrado</div>
  }

  return (
    <div className="report-list">
      {reports.map(report => (
        <Link key={report.id} to={`/reports/${report.id}`} className="report-item">
          <span className="report-period">
            {formatDate(report.start_date)} - {formatDate(report.end_date)}
          </span>
          <span className="report-created">
            Criado em {formatDateTime(report.created_at)}
          </span>
        </Link>
      ))}
    </div>
  )
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('pt-BR')
}

function formatDateTime(dateStr: string): string {
  return new Date(dateStr).toLocaleString('pt-BR')
}
