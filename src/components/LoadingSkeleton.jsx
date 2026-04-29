export default function LoadingSkeleton() {
  return (
    <div className="w-full">
      {/* Status bar */}
      <div className="flex items-center justify-center gap-3 mb-8 animate-fade-in">
        <div className="w-5 h-5 border-2 border-brand-400 border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
          Aggregating prices across 4 platforms…
        </p>
      </div>

      {/* Platform skeleton cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {[
          { color: '#FF9900', label: 'Amazon' },
          { color: '#2874F0', label: 'Flipkart' },
          { color: '#0C831F', label: 'Blinkit' },
          { color: '#FC8019', label: 'Swiggy' },
        ].map(({ color, label }, i) => (
          <div
            key={label}
            className="glass-card overflow-hidden animate-fade-in"
            style={{ animationDelay: `${i * 100}ms`, borderTop: `3px solid ${color}` }}
          >
            {/* Header skeleton */}
            <div className="p-5 border-b border-slate-100 dark:border-slate-700/50">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg skeleton" />
                <div className="w-20 h-4 rounded skeleton" />
              </div>
              <div className="w-full h-4 rounded skeleton mb-2" />
              <div className="w-3/4 h-4 rounded skeleton" />
            </div>

            {/* Price skeleton */}
            <div className="p-5 space-y-4">
              <div className="flex flex-col items-center gap-2">
                <div className="w-32 h-10 rounded-xl skeleton" />
                <div className="w-24 h-3 rounded skeleton" />
              </div>
              <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-700/50">
                {[1, 2, 3].map(j => (
                  <div key={j} className="flex justify-between">
                    <div className="w-20 h-3 rounded skeleton" />
                    <div className="w-16 h-3 rounded skeleton" />
                  </div>
                ))}
              </div>
              <div className="flex justify-between pt-3 border-t border-slate-100 dark:border-slate-700/50">
                <div className="w-16 h-4 rounded skeleton" />
                <div className="w-12 h-4 rounded skeleton" />
                <div className="w-14 h-6 rounded-lg skeleton" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
