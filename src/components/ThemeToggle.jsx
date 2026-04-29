import { Moon, Sun } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function ThemeToggle() {
  const [dark, setDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' ||
        (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)
    }
    return true
  })

  useEffect(() => {
    const root = document.documentElement
    if (dark) {
      root.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      root.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }, [dark])

  return (
    <button
      id="theme-toggle"
      onClick={() => setDark(d => !d)}
      aria-label="Toggle dark mode"
      className="relative p-2.5 rounded-xl border border-slate-200 dark:border-slate-700
                 bg-white dark:bg-slate-800
                 hover:bg-slate-50 dark:hover:bg-slate-700
                 transition-all duration-300 shadow-sm group"
    >
      <div className="relative w-5 h-5">
        <Sun  className={`absolute inset-0 w-5 h-5 text-amber-500 transition-all duration-300
                          ${dark ? 'opacity-0 rotate-90 scale-50' : 'opacity-100 rotate-0 scale-100'}`} />
        <Moon className={`absolute inset-0 w-5 h-5 text-brand-400 transition-all duration-300
                          ${dark ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-50'}`} />
      </div>
    </button>
  )
}
