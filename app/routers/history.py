"""
History Router — GET /api/history
Retrieves price history snapshots from PostgreSQL for trend charts.
"""
import logging
from typing import List

from fastapi import APIRouter, Depends, Query
from sqlalchemy import select, desc
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models.price_history import PriceHistory
from app.schemas.price import HistoryResponse, HistoryPoint

logger = logging.getLogger(__name__)
router = APIRouter()


@router.get("/history", response_model=HistoryResponse)
async def get_price_history(
    q: str = Query(..., description="Product search query to fetch history for"),
    limit: int = Query(50, ge=1, le=200, description="Max number of history points"),
    db: AsyncSession = Depends(get_db),
):
    """
    Return historical price snapshots for a given query,
    ordered by recorded_at descending (newest first).
    Used to power the Price History trend chart in the UI.
    """
    query_lower = q.strip().lower()

    stmt = (
        select(PriceHistory)
        .where(PriceHistory.query.ilike(f"%{query_lower}%"))
        .order_by(desc(PriceHistory.recorded_at))
        .limit(limit)
    )

    result = await db.execute(stmt)
    rows = result.scalars().all()

    history_points = [
        HistoryPoint(
            platform=row.platform,
            total_price=row.total_price,
            base_price=row.base_price,
            delivery_fee=row.delivery_fee,
            recorded_at=row.recorded_at,
        )
        for row in rows
    ]

    platforms = list({h.platform for h in history_points})

    logger.info(f"📈 History for '{q}': {len(history_points)} points across {len(platforms)} platforms")

    return HistoryResponse(
        query=q,
        history=history_points,
        platforms=platforms,
    )


@router.delete("/history", status_code=204)
async def clear_history(
    q: str = Query(..., description="Query whose history to clear"),
    db: AsyncSession = Depends(get_db),
):
    """Delete all history snapshots for a specific query."""
    from sqlalchemy import delete
    stmt = delete(PriceHistory).where(PriceHistory.query.ilike(f"%{q.strip().lower()}%"))
    await db.execute(stmt)
    await db.commit()
    logger.info(f"🗑️  Cleared history for: '{q}'")
