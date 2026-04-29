import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Zap, ShoppingBag, Globe2, ArrowDown } from 'lucide-react'

import SearchBar from '../components/SearchBar'
import ComparisonGrid from '../components/ComparisonGrid'
import LoadingSkeleton from '../components/LoadingSkeleton'
import PriceHistoryChart from '../components/PriceHistoryChart'
import { searchPrices, queryKeys } from '../api/priceApi'

const PLATFORM_PILLS = [
  { name: 'Amazon',          emoji: '🛒', color: '#FF9900' },
  { name: 'Flipkart',        emoji: '⭐', color: '#2874F0' },
  { name: 'Blinkit',         emoji: '⚡', color: '#0C831F' },
  { name: 'Swiggy Instamart',emoji: '🧡', color: '#FC8019' },
]

const STATS = [
  { label: 'Platforms',    value: '4+',  icon: Globe2 },
  { label: 'Avg. Savings', value: '23%', icon: Zap },
  { label: 'Products',     value: '∞',   icon: ShoppingBag },
]

export default function HomePage() {
  const [activeQuery, setActiveQuery] = useState('')

  const { data, isLoading, error } = useQuery({
    queryKey: queryKeys.search(activeQuery),
    queryFn:  () => searchPrices(activeQuery),
    enabled:  !!activeQuery,
    staleTime: 10 * 60 * 1000,
  })

  const handleSearch = (q) => setActiveQuery(q)

  return (
    <main className="min-h-screen mesh-bg">
      {/* ── Hero Section ──────────────────────────────────────────────────── */}
      <section className="hero-gradient pt-20 pb-16 px-4">
        <div className="max-w-5xl mx-auto text-center">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full
                          bg-brand-500/10 border border-brand-500/20 text-brand-400
                          text-xs font-semibold tracking-wide mb-6 animate-fade-in">
            <Zap className="w-3.5 h-3.5" />
            Unified Price Comparison Engine
          </div>

          {/* Headline */}
          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-extrabold
                         text-slate-900 dark:text-white leading-tight tracking-tight mb-4 animate-slide-up">
            One Search.
            <br />
            <span className="bg-gradient-to-r from-brand-400 to-purple-400 bg-clip-text text-transparent">
              Best Price.
            </span>
          </h1>

          <p className="text-lg text-slate-500 dark:text-slate-400 max-w-xl mx-auto mb-8 animate-fade-in">
            Compare prices across Amazon, Flipkart, Blinkit & Swiggy Instamart — instantly.
            Total cost including delivery & tax, always.
          </p>

          {/* Platform pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-10 animate-fade-in">
            {PLATFORM_PILLS.map(p => (
              <span key={p.name}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold
                           bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700
                           text-slate-700 dark:text-slate-300 shadow-sm">
                <span>{p.emoji}</span>
                {p.name}
              </span>
            ))}
          </div>

          {/* Search bar */}
          <div className="animate-slide-up">
            <SearchBar onSearch={handleSearch} isLoading={isLoading} />
          </div>

          {/* Stats */}
          <div className="flex items-center justify-center gap-8 mt-10 animate-fade-in">
            {STATS.map(({ label, value }) => (
              <div key={label} className="text-center">
                <p className="stat-number text-2xl text-slate-800 dark:text-white">{value}</p>
                <p className="text-xs text-slate-400 mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator — only show pre-search */}
        {!activeQuery && (
          <div className="flex justify-center mt-12 animate-bounce">
            <ArrowDown className="w-5 h-5 text-slate-400" />
          </div>
        )}
      </section>

      {/* ── Results Section ────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 pb-20">
        {/* Loading */}
        {isLoading && <LoadingSkeleton />}

        {/* Error */}
        {error && !isLoading && (
          <div className="glass-card p-8 text-center animate-fade-in max-w-lg mx-auto">
            <p className="text-4xl mb-3">😵</p>
            <h3 className="font-bold text-slate-800 dark:text-white mb-1">Fetch Failed</h3>
            <p className="text-sm text-slate-400">
              {error?.response?.data?.detail || 'Could not connect to the backend. Is the FastAPI server running?'}
            </p>
            <p className="text-xs text-slate-400 mt-2 font-mono">
              → Run: <code className="text-brand-400">uvicorn main:app --reload</code> in /backend
            </p>
          </div>
        )}

        {/* Results grid */}
        {data && !isLoading && (
          <div className="space-y-8">
            <ComparisonGrid data={data} />
            <PriceHistoryChart query={activeQuery} />
          </div>
        )}

        {/* Empty state */}
        {!activeQuery && !isLoading && (
          <div className="text-center py-12 animate-fade-in">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-slate-700 dark:text-slate-200 mb-2">
              Search anything to compare prices
            </h3>
            <p className="text-slate-400 text-sm max-w-sm mx-auto">
              Try &quot;iPhone 15&quot;, &quot;Amul Butter&quot;, &quot;Basmati Rice&quot;, or any product you want to compare.
            </p>
          </div>
        )}
      </section>
    </main>
  )
}
