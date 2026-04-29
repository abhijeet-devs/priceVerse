"""
Search Router — POST /api/search
Cache-first strategy: check Redis → aggregate → normalize → cache → persist history
"""
import logging
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.redis_client import cache_get, cache_set
from app.schemas.price import SearchRequest, SearchResponse, PlatformResult
from app.services.aggregator import aggregate_prices
from app.services.normalizer import normalize_results, get_best_value_platform
from app.models.price_history import PriceHistory

logger = logging.getLogger(__name__)
router = APIRouter()


def _cache_key(query: str) -> str:
    return f"priceverse:search:{query.lower().strip().replace(' ', '_')}"


@router.post("/search", response_model=SearchResponse)
async def search_prices(
    req: SearchRequest,
    db: AsyncSession = Depends(get_db),
):
    """
    Aggregate prices from all platforms for a search query.
    - Checks Redis cache first (10-minute TTL)
    - On cache miss: fetches all platforms concurrently, normalizes, caches
    - Persists price snapshot to PostgreSQL for history tracking
    """
    query = req.query.strip()
    cache_key = _cache_key(query)

    # ── 1. Cache-first lookup ──────────────────────────────────────────────────
    cached = await cache_get(cache_key)
    if cached:
        cached["cache_hit"] = True
        return SearchResponse(**cached)

    # ── 2. Aggregate from all platforms asynchronously ─────────────────────────
    try:
        raw_results = await aggregate_prices(query)
    except Exception as e:
        logger.error(f"Aggregation failed: {e}")
        raise HTTPException(status_code=503, detail=f"Price aggregation failed: {str(e)}")

    if not raw_results:
        raise HTTPException(status_code=404, detail="No results found for this query.")

    # ── 3. Normalize & score ───────────────────────────────────────────────────
    normalized = normalize_results(raw_results)
    best_platform = get_best_value_platform(normalized)

    # ── 4. Build response ──────────────────────────────────────────────────────
    platform_results = [PlatformResult(**r) for r in normalized]
    response = SearchResponse(
        query=query,
        results=platform_results,
        best_value_platform=best_platform,
        fetched_at=datetime.utcnow(),
        cache_hit=False,
        sources_count=len(platform_results),
    )

    # ── 5. Store in Redis cache (10 minutes) ───────────────────────────────────
    await cache_set(cache_key, response.model_dump())

    # ── 6. Persist price history snapshot to PostgreSQL ───────────────────────
    try:
        for r in normalized:
            snapshot = PriceHistory(
                query=query,
                platform=r["platform"],
                total_price=r["total_price"],
                base_price=r["base_price"],
                delivery_fee=r["delivery_fee"],
            )
            db.add(snapshot)
        await db.commit()
    except Exception as e:
        logger.warning(f"History persistence failed (non-critical): {e}")
        await db.rollback()

    return response


@router.get("/search", response_model=SearchResponse)
async def search_prices_get(
    q: str,
    db: AsyncSession = Depends(get_db),
):
    """GET variant for easy browser/curl testing."""
    return await search_prices(SearchRequest(query=q), db)
