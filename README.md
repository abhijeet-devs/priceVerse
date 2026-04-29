# 🌐 PriceVerse — Unified Price Comparison Engine

> Compare prices across Amazon, Flipkart, Blinkit & Swiggy Instamart — in one search.

---

## 🏗️ Tech Stack

| Layer       | Technology                            |
|-------------|---------------------------------------|
| Frontend    | React 18 + Vite + Tailwind CSS + Lucide React |
| State       | TanStack Query (React Query v5)       |
| Backend     | FastAPI (Python) + Uvicorn            |
| Database    | PostgreSQL 16 (via Docker)            |
| Cache       | Redis 7 (via Docker) — 10-min TTL    |
| Scraping    | Playwright (headless) + mock fallback |
| Data Norm.  | Pandas                                |

---

## 📁 Project Structure

```
├── docker-compose.yml      # PostgreSQL + Redis services
├── .env                    # Environment variables
├── backend/
│   ├── main.py             # FastAPI entry point
│   ├── requirements.txt
│   └── app/
│       ├── config.py       # Settings from .env
│       ├── database.py     # Async SQLAlchemy
│       ├── redis_client.py # Redis cache helpers
│       ├── models/         # ORM models
│       ├── schemas/        # Pydantic schemas
│       ├── routers/        # API endpoints
│       └── services/       # Aggregator + Normalizer + Scrapers
└── frontend/
    ├── vite.config.js      # Proxy to backend
    ├── tailwind.config.js
    └── src/
        ├── App.jsx          # Router + Navbar
        ├── api/priceApi.js  # Axios + Query keys
        ├── components/      # SearchBar, PlatformCard, etc.
        └── pages/           # HomePage, HistoryPage
```

---

## 🚀 Quick Start (Local Development)

### Prerequisites
- [Node.js 18+](https://nodejs.org/)
- [Python 3.11+](https://www.python.org/)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)

---

### Step 1 — Start Database & Cache

```bash
# From project root
docker-compose up -d
```

Verify services:
```bash
docker ps
# priceverse_postgres  → port 5432
# priceverse_redis     → port 6379
```

---

### Step 2 — Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate (Windows)
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Install Playwright browsers
playwright install chromium

# Start FastAPI server
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

✅ API running at: http://localhost:8000  
📖 Swagger Docs: http://localhost:8000/docs

---

### Step 3 — Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start dev server
npm run dev
```

✅ App running at: http://localhost:5173

---

## 🔌 API Endpoints

| Method | Endpoint         | Description                        |
|--------|------------------|------------------------------------|
| POST   | `/api/search`    | Search prices (body: `{query}`)    |
| GET    | `/api/search`    | Search prices (query param: `?q=`) |
| GET    | `/api/history`   | Get price history (`?q=&limit=`)   |
| DELETE | `/api/history`   | Clear history for a query          |
| GET    | `/health`        | Health check                       |

### Example Request
```bash
curl -X POST http://localhost:8000/api/search \
  -H "Content-Type: application/json" \
  -d '{"query": "iPhone 15"}'
```

---

## ✨ Features

- **🔍 Universal Search** — One search, 4 platform results side-by-side
- **💰 Total Price** — Base Price + Delivery Fee + Tax, always
- **🏆 Best Value Badge** — Algorithm scores platforms by price × delivery time
- **⚡ Redis Cache** — Repeat searches respond instantly (10-min TTL)
- **📈 Price History** — Recharts line chart shows price trends over time
- **🌙 Dark / Light Mode** — Persisted in localStorage
- **📱 Mobile Responsive** — Works perfectly on mobile emulators
- **🗂️ TanStack Query** — Smart loading, error, and stale states

---

## 🧠 Architecture Flow

```
User Search
    │
    ▼
React Frontend (TanStack Query)
    │  POST /api/search
    ▼
FastAPI Search Router
    │
    ├─► Redis Cache? ──YES──► Return cached result (instant)
    │
    └─► NO: asyncio.gather() ──► 4 async scrapers run simultaneously
                                       │
                                  Pandas Normalizer
                                  (recalculate totals, compute value scores)
                                       │
                                  ┌─── Redis SET (TTL 10min)
                                  └─── PostgreSQL (price history snapshot)
                                       │
                                  Return to Frontend
```

---

## 🔧 Environment Variables

All configuration lives in `.env` (root):

```env
POSTGRES_USER=priceverse
POSTGRES_PASSWORD=priceverse123
POSTGRES_DB=priceverse_db
REDIS_TTL_SECONDS=600
FRONTEND_ORIGIN=http://localhost:5173
```

---

## 📦 Adding Real Scrapers (Production)

The `backend/app/services/scrapers/` folder is ready for real Playwright scrapers.
Replace `generate_platform_mock()` calls in `aggregator.py` with your scraper functions:

```python
# Example: amazon.py
from playwright.async_api import async_playwright

async def scrape_amazon(query: str) -> dict:
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()
        await page.goto(f"https://www.amazon.in/s?k={query}")
        # ... scrape logic
        await browser.close()
```
