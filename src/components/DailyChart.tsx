import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import type { DailyMetric } from '@/types'
import './DailyChart.css'

interface DailyChartProps {
  data: DailyMetric[]
}

export function DailyChart({ data }: DailyChartProps) {
  const chartData = data.map(d => ({
    date: formatDate(d.date),
    impressions: d.impressions,
    clicks: d.clicks,
  }))

  return (
    <div className="daily-chart">
      <h3>Evolução Diária</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis yAxisId="left" />
          <YAxis yAxisId="right" orientation="right" />
          <Tooltip />
          <Legend />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="impressions"
            stroke="#8884d8"
            name="Impressões"
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="clicks"
            stroke="#82ca9d"
            name="Cliques"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
}
