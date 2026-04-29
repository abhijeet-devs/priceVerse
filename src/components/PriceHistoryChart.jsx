import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from 'recharts'
import { TrendingUp, RefreshCw, Trash2 } from 'lucide-react'
import { getPriceHistory, clearPriceHistory, queryKeys } from '../api/priceApi'
import { format } from 'date-fns'

const PLATFORM_COLORS = {
  amazon:           '#FF9900',
  flipkart:         '#2874F0',
  blinkit:          '#0C831F',
  swiggy_instamart: '#FC8019',
}

const PLATFORM_LABELS = {
  amazon:           'Amazon',
  flipkart:         'Flipkart',
  blinkit:          'Blinkit',
  swiggy_instamart: 'Swiggy Instamart',
}

// Custom Tooltip
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="glass-card p-3 text-sm min-w-[160px]">
      <p className="font-semibold text-slate-700 dark:text-white mb-2">{label}</p>
      {payload.map(p => (
        <div key={p.dataKey} className="flex justify-between gap-4">
          <span style={{ color: p.color }} className="font-medium">
            {PLATFORM_LABELS[p.dataKey] || p.dataKey}
          </span>
          <span className="font-bold text-slate-800 dark:text-white">
            ₹{Number(p.value).toFixed(2)}
          </span>
        </div>
      ))}
    </div>
  )
}

export default function PriceHistoryChart({ query }) {
  const [, setCleared] = useState(false)

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: queryKeys.history(query),
    queryFn:  () => getPriceHistory(query, 50),
    enabled:  !!query,
  })

  const handleClear = async () => {
    await clearPriceHistory(query)
    setCleared(true)
    refetch()
  }

  if (!query) return null
  if (isLoading) {
    return (
      <div className="glass-card p-6 animate-fade-in">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-brand-400" />
          <div className="w-40 h-5 rounded skeleton" />
        </div>
        <div className="w-full h-48 rounded-xl skeleton" />
      </div>
    )
  }

  if (error || !data?.history?.length) {
    return (
      <div className="glass-card p-6 text-center animate-fade-in">
        <TrendingUp className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
        <p className="text-slate-400 text-sm">
          {error ? 'Could not load history.' : 'No price history yet. Search a few times to build a trend chart!'}
        </p>
      </div>
    )
  }

  // Transform history → recharts format: [{time, amazon, flipkart, ...}]
  const grouped = {}
  data.history.forEach(h => {
    const time = format(new Date(h.recorded_at), 'MMM d, HH:mm')
    if (!grouped[time]) grouped[time] = { time }
    grouped[time][h.platform] = h.total_price
  })
  const chartData = Object.values(grouped).reverse().slice(0, 20)

  return (
    <div className="glass-card p-6 animate-slide-up">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-brand-400" />
          <h3 className="font-bold text-slate-800 dark:text-white">
            Price History — <span className="text-brand-400">&quot;{query}&quot;</span>
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => refetch()} title="Refresh"
            className="btn-ghost p-2 rounded-lg text-slate-400 hover:text-brand-400">
            <RefreshCw className="w-4 h-4" />
          </button>
          <button onClick={handleClear} title="Clear history"
            className="btn-ghost p-2 rounded-lg text-slate-400 hover:text-red-400">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.15)" />
          <XAxis
            dataKey="time" tick={{ fontSize: 11, fill: '#94a3b8' }}
            tickLine={false} axisLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: '#94a3b8' }}
            tickLine={false} axisLine={false}
            tickFormatter={v => `₹${v}`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            formatter={v => PLATFORM_LABELS[v] || v}
            wrapperStyle={{ fontSize: '12px', paddingTop: '12px' }}
          />
          {data.platforms.map(platform => (
            <Line
              key={platform}
              type="monotone"
              dataKey={platform}
              stroke={PLATFORM_COLORS[platform] || '#94a3b8'}
              strokeWidth={2.5}
              dot={{ r: 4, fill: PLATFORM_COLORS[platform] }}
              activeDot={{ r: 6 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>

      <p className="text-xs text-slate-400 text-center mt-3">
        Showing last {chartData.length} price snapshots • each search auto-saves a snapshot
      </p>
    </div>
  )
}
