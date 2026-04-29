"""
PriceVerse — FastAPI Application Entry Point
"""
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware

from app.config import settings
from app.database import engine, Base
from app.routers import search, history


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup / Shutdown lifecycle."""
    # Create all DB tables on startup (graceful — works without Docker)
    try:
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
        print("[OK] PostgreSQL connected - tables ready.")
    except Exception as e:
        print(f"[WARN] PostgreSQL unavailable ({e.__class__.__name__}): running in mock-only mode.")
        print("    -> Start Docker then run: docker-compose up -d")
    print("[OK] PriceVerse API is live - http://localhost:8000")
    print("[DOCS] Docs available at  - http://localhost:8000/docs")
    yield
    await engine.dispose()
    print("[STOP] PriceVerse API shut down.")


app = FastAPI(
    title="PriceVerse API",
    description="Unified Price Comparison Engine — aggregates prices from multiple platforms in real-time.",
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)

# ─── Middleware ────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_ORIGIN, "http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:5174", "http://127.0.0.1:5174"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.add_middleware(GZipMiddleware, minimum_size=1000)

# ─── Routers ──────────────────────────────────────────────────────────────────
app.include_router(search.router, prefix="/api", tags=["Search"])
app.include_router(history.router, prefix="/api", tags=["History"])


@app.get("/", tags=["Health"])
async def root():
    return {
        "service": "PriceVerse API",
        "version": "1.0.0",
        "status": "operational",
        "docs": "/docs",
    }


@app.get("/health", tags=["Health"])
async def health_check():
    return {"status": "ok"}
