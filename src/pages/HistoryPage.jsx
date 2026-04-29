import { useState } from 'react'
import { TrendingUp, Search } from 'lucide-react'
import PriceHistoryChart from '../components/PriceHistoryChart'

const QUICK_QUERIES = [
  'iPhone 15', 'Samsung Galaxy S24', 'Amul Butter', 'Basmati Rice',
  'OnePlus 12', 'Maggi Noodles', 'Surf Excel', 'Colgate Toothpaste',
]

export default function HistoryPage() {
  const [query, setQuery] = useState('')
  const [active, setActive] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (query.trim()) setActive(query.trim())
  }

  return (
    <main className="min-h-screen mesh-bg pt-12 pb-20 px-4">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10 animate-slide-up">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl
                          bg-brand-500/10 border border-brand-500/20 mb-4">
            <TrendingUp className="w-7 h-7 text-brand-400" />
          </div>
          <h1 className="font-display text-4xl font-extrabold text-slate-900 dark:text-white mb-2">
            Price History
          </h1>
          <p className="text-slate-400">
            Track how prices have changed over time across all platforms.
          </p>
        </div>

        {/* Search */}
        <form onSubmit={handleSubmit} className="flex gap-3 max-w-xl mx-auto mb-8 animate-fade-in">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Enter product name…"
              className="input-search pl-9"
            />
          </div>
          <button type="submit" className="btn-primary">View Trend</button>
        </form>

        {/* Quick query chips */}
        <div className="flex flex-wrap justify-center gap-2 mb-10 animate-fade-in">
          {QUICK_QUERIES.map(q => (
            <button
              key={q}
              onClick={() => { setQuery(q); setActive(q) }}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200
                ${active === q
                  ? 'bg-brand-500 text-white border-brand-500'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-brand-400'
                }`}
            >
              {q}
            </button>
          ))}
        </div>

        {/* Chart */}
        {active
          ? <PriceHistoryChart query={active} />
          : (
            <div className="glass-card p-12 text-center animate-fade-in">
              <TrendingUp className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
              <p className="text-slate-500 dark:text-slate-400 font-medium">
                Select a product above to view its price trend
              </p>
              <p className="text-xs text-slate-400 mt-1">
                History is built automatically each time you run a search on the Home page
              </p>
            </div>
          )
        }
      </div>
    </main>
  )
}
