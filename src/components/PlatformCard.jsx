import { Star, Clock, Truck, ExternalLink } from 'lucide-react'
import BestValueBadge from './BestValueBadge'
import clsx from 'clsx'

const PLATFORM_LABELS = {
  amazon:           'Amazon',
  flipkart:         'Flipkart',
  blinkit:          'Blinkit',
  swiggy_instamart: 'Swiggy Instamart',
}

const PLATFORM_GRADIENTS = {
  amazon:           'from-amber-500/10 to-orange-500/5',
  flipkart:         'from-blue-600/10 to-blue-400/5',
  blinkit:          'from-emerald-600/10 to-green-400/5',
  swiggy_instamart: 'from-orange-500/10 to-amber-400/5',
}

function formatPrice(price) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency', currency: 'INR', maximumFractionDigits: 2,
  }).format(price)
}

function formatDelivery(minutes) {
  if (minutes < 60) return `${minutes} min`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m > 0 ? `${h}h ${m}m` : `${h}h`
}

export default function PlatformCard({ result, rank }) {
  const {
    platform, platform_logo, platform_color,
    product_name, base_price, delivery_fee, tax, total_price,
    delivery_time_min, rating, in_stock, is_best_value, product_url,
  } = result

  const label    = PLATFORM_LABELS[platform] || platform
  const gradient = PLATFORM_GRADIENTS[platform] || 'from-slate-500/10 to-slate-400/5'

  return (
    <div
      className={clsx(
        'glass-card overflow-hidden flex flex-col animate-slide-up group relative',
        `platform-${platform}`,
        is_best_value && 'ring-2 ring-emerald-400 dark:ring-emerald-500',
        !in_stock && 'opacity-60'
      )}
      style={{ animationDelay: `${rank * 80}ms` }}
      id={`platform-card-${platform}`}
    >
      {/* Gradient header */}
      <div className={clsx('p-5 bg-gradient-to-br', gradient)}>
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">{platform_logo}</span>
            <div>
              <p className="font-bold text-sm" style={{ color: platform_color }}>{label}</p>
              {!in_stock && (
                <span className="text-xs text-red-500 font-semibold">Out of Stock</span>
              )}
            </div>
          </div>

          <div className="flex flex-col items-end gap-1">
            {is_best_value && <BestValueBadge />}
            {rank === 1 && !is_best_value && (
              <span className="text-xs font-semibold text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded-full">
                #{rank} Cheapest
              </span>
            )}
          </div>
        </div>

        {/* Product name */}
        <p className="text-sm font-medium text-slate-700 dark:text-slate-200 line-clamp-2 leading-snug">
          {product_name}
        </p>
      </div>

      {/* Price breakdown */}
      <div className="p-5 flex-1 flex flex-col gap-4">
        {/* Total Price — hero number */}
        <div className="text-center py-2">
          <p className="stat-number text-4xl" style={{ color: platform_color }}>
            {formatPrice(total_price)}
          </p>
          <p className="text-xs text-slate-400 mt-1">Total (incl. all charges)</p>
        </div>

        {/* Price breakdown rows */}
        <div className="space-y-2 text-sm border-t border-slate-100 dark:border-slate-700 pt-3">
          <div className="flex justify-between text-slate-600 dark:text-slate-400">
            <span>Base Price</span>
            <span className="font-medium">{formatPrice(base_price)}</span>
          </div>
          <div className="flex justify-between text-slate-600 dark:text-slate-400">
            <span className="flex items-center gap-1">
              <Truck className="w-3 h-3" /> Delivery
            </span>
            <span className={clsx('font-medium', delivery_fee === 0 ? 'text-emerald-500' : '')}>
              {delivery_fee === 0 ? 'FREE' : formatPrice(delivery_fee)}
            </span>
          </div>
          <div className="flex justify-between text-slate-600 dark:text-slate-400">
            <span>Tax (GST)</span>
            <span className="font-medium">{formatPrice(tax)}</span>
          </div>
        </div>

        {/* Delivery time + Rating */}
        <div className="flex items-center justify-between mt-auto pt-2 border-t border-slate-100 dark:border-slate-700">
          <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
            <Clock className="w-4 h-4" />
            <span className="text-sm font-semibold">{formatDelivery(delivery_time_min)}</span>
          </div>
          <div className="flex items-center gap-1 text-amber-500">
            <Star className="w-4 h-4 fill-current" />
            <span className="text-sm font-bold">{rating.toFixed(1)}</span>
          </div>
          <a
            href={product_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg
                       transition-all duration-200 hover:scale-105"
            style={{ color: platform_color, background: `${platform_color}18` }}
            onClick={e => e.stopPropagation()}
          >
            View <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Hover glow overlay */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-300"
        style={{ boxShadow: `inset 0 0 0 1px ${platform_color}40` }}
      />
    </div>
  )
}
