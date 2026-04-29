import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
})

// ─── Search ───────────────────────────────────────────────────────────────────
export const searchPrices = async (query) => {
  const { data } = await api.post('/search', { query })
  return data
}

export const searchPricesGet = async (query) => {
  const { data } = await api.get('/search', { params: { q: query } })
  return data
}

// ─── History ─────────────────────────────────────────────────────────────────
export const getPriceHistory = async (query, limit = 50) => {
  const { data } = await api.get('/history', { params: { q: query, limit } })
  return data
}

export const clearPriceHistory = async (query) => {
  await api.delete('/history', { params: { q: query } })
}

// ─── TanStack Query keys ──────────────────────────────────────────────────────
export const queryKeys = {
  search:  (q) => ['search', q],
  history: (q) => ['history', q],
}
