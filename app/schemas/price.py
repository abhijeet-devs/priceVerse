"""
Pydantic schemas for price search request / response
"""
from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, Field


# ─── Request ──────────────────────────────────────────────────────────────────

class SearchRequest(BaseModel):
    query: str = Field(..., min_length=1, max_length=255, description="Product search term")
    category: Optional[str] = Field(None, description="Category hint: grocery, electronics, food, rides")


# ─── Per-platform result ──────────────────────────────────────────────────────

class PlatformResult(BaseModel):
    platform: str
    platform_logo: str           # emoji or URL
    platform_color: str          # hex color for UI theming
    product_name: str
    base_price: float
    delivery_fee: float
    tax: float
    total_price: float
    delivery_time_min: int
    image_url: str
    product_url: str
    rating: float
    in_stock: bool
    is_best_value: bool = False
    value_score: float = 0.0     # lower is better (total_price / delivery_time)


# ─── Aggregated response ──────────────────────────────────────────────────────

class SearchResponse(BaseModel):
    query: str
    results: List[PlatformResult]
    best_value_platform: Optional[str]
    fetched_at: datetime
    cache_hit: bool = False
    sources_count: int


# ─── Price History ────────────────────────────────────────────────────────────

class HistoryPoint(BaseModel):
    platform: str
    total_price: float
    base_price: float
    delivery_fee: float
    recorded_at: datetime


class HistoryResponse(BaseModel):
    query: str
    history: List[HistoryPoint]
    platforms: List[str]
