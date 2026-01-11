import './MetricCard.css'

interface MetricCardProps {
  title: string
  value: number | string
  percentageChange?: number
  format?: 'number' | 'currency' | 'percentage'
}

export function MetricCard({
  title,
  value,
  percentageChange,
  format = 'number',
}: MetricCardProps) {
  const formattedValue = formatValue(value, format)
  const changeClass = getChangeClass(percentageChange)

  return (
    <div className="metric-card">
      <span className="metric-title">{title}</span>
      <span className="metric-value">{formattedValue}</span>
      {percentageChange !== undefined && (
        <span className={`metric-change ${changeClass}`}>
          {percentageChange > 0 ? '+' : ''}{percentageChange.toFixed(1)}%
        </span>
      )}
    </div>
  )
}

function formatValue(value: number | string, format: string): string {
  if (typeof value === 'string') return value
  
  switch (format) {
    case 'currency':
      return `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
    case 'percentage':
      return `${value.toFixed(2)}%`
    default:
      return value.toLocaleString('pt-BR')
  }
}

function getChangeClass(change?: number): string {
  if (change === undefined) return ''
  if (change > 0) return 'positive'
  if (change < 0) return 'negative'
  return 'neutral'
}
