import { useState, useEffect, useRef } from 'react'
import { Search, Sparkles, X } from 'lucide-react'
import clsx from 'clsx'

const SUGGESTIONS = [
  'iPhone 15', 'Samsung Galaxy S24', 'Amul Butter', 'Basmati Rice 5kg',
  'MacBook Air M2', 'OnePlus 12', 'Surf Excel', 'Maggi Noodles',
  'Dettol Soap', 'Cadbury Dairy Milk', 'Colgate Toothpaste', 'Nestle Milo',
]

export default function SearchBar({ onSearch, isLoading }) {
  const [value, setValue]           = useState('')
  const [focused, setFocused]       = useState(false)
  const [suggestions, setSuggestions] = useState([])
  const inputRef = useRef(null)

  // Populate suggestions on focus
  useEffect(() => {
    if (focused && value.length === 0) {
      setSuggestions(SUGGESTIONS.slice(0, 6))
    } else if (value.length > 0) {
      const filtered = SUGGESTIONS.filter(s =>
        s.toLowerCase().includes(value.toLowerCase())
      ).slice(0, 4)
      setSuggestions(filtered)
    } else {
      setSuggestions([])
    }
  }, [focused, value])

  const handleSubmit = (e) => {
    e?.preventDefault()
    const trimmed = value.trim()
    if (trimmed) {
      setSuggestions([])
      onSearch(trimmed)
    }
  }

  const handleSuggestion = (s) => {
    setValue(s)
    setSuggestions([])
    onSearch(s)
  }

  const clearInput = () => {
    setValue('')
    inputRef.current?.focus()
  }

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        {/* Search Icon */}
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
          {isLoading
            ? <div className="w-5 h-5 border-2 border-brand-400 border-t-transparent rounded-full animate-spin" />
            : <Search className="w-5 h-5 text-slate-400" />
          }
        </div>

        <input
          ref={inputRef}
          id="search-input"
          type="text"
          value={value}
          onChange={e => setValue(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 150)}
          placeholder="Search for any product — iPhone 15, Rice, Butter..."
          className={clsx(
            'input-search pl-12 pr-28',
            focused && 'ring-2 ring-brand-400 border-brand-400'
          )}
          disabled={isLoading}
          autoComplete="off"
        />

        {/* Right controls */}
        <div className="absolute inset-y-0 right-2 flex items-center gap-2">
          {value && (
            <button type="button" onClick={clearInput}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
              <X className="w-4 h-4" />
            </button>
          )}
          <button type="submit"
            disabled={isLoading || !value.trim()}
            className="btn-primary py-2 px-4 text-sm disabled:opacity-50 disabled:cursor-not-allowed">
            <Sparkles className="w-4 h-4" />
            Compare
          </button>
        </div>
      </form>

      {/* Suggestions Dropdown */}
      {focused && suggestions.length > 0 && (
        <div className="absolute top-full mt-2 w-full z-50 glass-card p-2 animate-fade-in">
          <p className="text-xs text-slate-400 px-3 py-1 font-medium uppercase tracking-wider mb-1">
            {value ? 'Suggestions' : 'Popular Searches'}
          </p>
          {suggestions.map((s) => (
            <button
              key={s}
              onMouseDown={() => handleSuggestion(s)}
              className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium
                         text-slate-700 dark:text-slate-200
                         hover:bg-brand-50 dark:hover:bg-brand-900/30
                         transition-colors flex items-center gap-2">
              <Search className="w-3.5 h-3.5 text-slate-400" />
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
