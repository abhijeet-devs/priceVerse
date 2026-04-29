import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'
import { BarChart3, Home, TrendingUp, Layers } from 'lucide-react'
import ThemeToggle from './components/ThemeToggle'
import HomePage from './pages/HomePage'
import HistoryPage from './pages/HistoryPage'

function Navbar() {
  const linkClass = ({ isActive }) =>
    `flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
     ${isActive
       ? 'bg-brand-500/10 text-brand-500 dark:text-brand-400'
       : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
     }`

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200 dark:border-slate-800
                    bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <NavLink to="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-500 to-purple-500
                          flex items-center justify-center shadow-lg group-hover:shadow-glow transition-shadow">
            <Layers className="w-4 h-4 text-white" />
          </div>
          <span className="font-display font-bold text-xl text-slate-900 dark:text-white tracking-tight">
            Price<span className="text-brand-500">Verse</span>
          </span>
        </NavLink>

        {/* Nav links */}
        <div className="flex items-center gap-1">
          <NavLink to="/" end className={linkClass}>
            <Home className="w-4 h-4" />
            <span className="hidden sm:inline">Compare</span>
          </NavLink>
          <NavLink to="/history" className={linkClass}>
            <TrendingUp className="w-4 h-4" />
            <span className="hidden sm:inline">History</span>
          </NavLink>
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-2">
          <a
            href="http://localhost:8000/docs"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost text-xs hidden sm:flex"
          >
            <BarChart3 className="w-4 h-4" />
            API Docs
          </a>
          <ThemeToggle />
        </div>
      </div>
    </nav>
  )
}

function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 py-6 px-4 text-center">
      <p className="text-xs text-slate-400">
        PriceVerse © {new Date().getFullYear()} — Prices update every 10 minutes via Redis cache.
        Built with React + FastAPI + PostgreSQL + Redis.
      </p>
    </footer>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen bg-[var(--bg-primary)]">
        <Navbar />
        <div className="flex-1">
          <Routes>
            <Route path="/"        element={<HomePage />} />
            <Route path="/history" element={<HistoryPage />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </BrowserRouter>
  )
}
