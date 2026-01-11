import { MetricCard } from './MetricCard'
import type { MetricTotals, ComparisonData } from '@/types'
import './MetricsCards.css'

interface MetricsCardsProps {
  totals: MetricTotals
  comparison?: ComparisonData
}

export function MetricsCards({ totals, comparison }: MetricsCardsProps) {
  return (
    <div className="metrics-cards">
      <MetricCard
        title="Impressões"
        value={totals.impressions}
        percentageChange={comparison?.percentageChange.impressions}
      />
      <MetricCard
        title="Cliques"
        value={totals.clicks}
        percentageChange={comparison?.percentageChange.clicks}
      />
      <MetricCard
        title="Gasto"
        value={totals.spend}
        format="currency"
        percentageChange={comparison?.percentageChange.spend}
      />
      <MetricCard
        title="CPC Médio"
        value={totals.avgCpc}
        format="currency"
        percentageChange={comparison?.percentageChange.cpc}
      />
      <MetricCard
        title="CPM Médio"
        value={totals.avgCpm}
        format="currency"
        percentageChange={comparison?.percentageChange.cpm}
      />
      <MetricCard
        title="CTR Médio"
        value={totals.avgCtr}
        format="percentage"
        percentageChange={comparison?.percentageChange.ctr}
      />
    </div>
  )
}
