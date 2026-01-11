import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import type { CampaignInsight } from '@/types'
import './CampaignChart.css'

interface CampaignChartProps {
  campaigns: CampaignInsight[]
  metric?: 'impressions' | 'clicks' | 'spend'
}

export function CampaignChart({ campaigns, metric = 'impressions' }: CampaignChartProps) {
  const data = campaigns.map(c => ({
    name: truncateName(c.campaignName),
    [metric]: c[metric],
  }))

  const barColor = getBarColor(metric)

  return (
    <div className="campaign-chart">
      <h3>Performance por Campanha</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey={metric} fill={barColor} name={getMetricLabel(metric)} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

function truncateName(name: string): string {
  return name.length > 15 ? `${name.slice(0, 15)}...` : name
}

function getBarColor(metric: string): string {
  const colors: Record<string, string> = {
    impressions: '#8884d8',
    clicks: '#82ca9d',
    spend: '#ffc658',
  }
  return colors[metric] || '#8884d8'
}

function getMetricLabel(metric: string): string {
  const labels: Record<string, string> = {
    impressions: 'Impressões',
    clicks: 'Cliques',
    spend: 'Gasto (R$)',
  }
  return labels[metric] || metric
}
