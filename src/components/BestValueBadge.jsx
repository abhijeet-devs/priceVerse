import { Trophy } from 'lucide-react'

export default function BestValueBadge({ className = '' }) {
  return (
    <span className={`badge-best ${className}`}>
      <Trophy className="w-3 h-3" />
      Best Value
    </span>
  )
}
