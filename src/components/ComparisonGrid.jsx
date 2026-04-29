import { Zap, Database } from 'lucide-react'
import PlatformCard from './PlatformCard'

export default function ComparisonGrid({ data }) {
  const { results, best_value_platform, query, fetched_at, cache_hit, sources_count } = data

  return (
    <div className="w-full animate-fade-in">
      {/* Meta bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h2 className="text-lg font-bold text-slate-800 dark:text-white">
            Comparing{' '}
            <span className="text-brand-500">&quot;{query}&quot;</span>
            {' '}across {sources_count} platforms
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Fetched at {new Date(fetched_at).toLocaleTimeString('en-IN')}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {cache_hit ? (
            <span className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5
                             rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300">
              <Database className="w-3 h-3" />
              Cached Result
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5
                             rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-300">
              <Zap className="w-3 h-3" />
              Live Fetch
            </span>
          )}
        </div>
      </div>

      {/* Best Value Summary Banner */}
      {best_value_platform && (
        <div className="mb-6 p-4 rounded-xl border border-emerald-200 dark:border-emerald-800
                        bg-emerald-50 dark:bg-emerald-900/20 animate-slide-up">
          <p className="text-sm text-emerald-700 dark:text-emerald-300 font-medium">
            🏆{' '}
            <strong className="capitalize">
              {best_value_platform.replace('_', ' ')}
            </strong>{' '}
            offers the best overall value — factoring in price, delivery fee, and delivery speed.
          </p>
        </div>
      )}

      {/* Platform Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {results.map((result, idx) => (
          <PlatformCard key={result.platform} result={result} rank={idx + 1} />
        ))}
      </div>
    </div>
  )
}
