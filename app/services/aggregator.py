"""
Async Aggregator — fetches prices from all platforms simultaneously
using asyncio.gather(). Falls back to mock data when live scrapers fail.
"""
import asyncio
import logging
from typing import Dict, List

from app.services.scrapers.mock_data import generate_platform_mock

logger = logging.getLogger(__name__)

PLATFORMS = ["amazon", "flipkart", "blinkit", "swiggy_instamart"]


async def _fetch_platform(platform: str, query: str) -> Dict | None:
    """
    Fetch price data for a single platform.
    In production: calls the real Playwright scraper.
    Currently: returns realistic mock data with simulated network delay.
    """
    try:
        # Simulate async I/O (scraping delay per platform)
        delay = {"amazon": 1.2, "flipkart": 1.0, "blinkit": 0.6, "swiggy_instamart": 0.8}
        await asyncio.sleep(delay.get(platform, 1.0))

        result = generate_platform_mock(platform, query)
        logger.info(f"✅ Fetched {platform} → ₹{result['total_price']}")
        return result

    except Exception as e:
        logger.error(f"❌ Failed to fetch {platform}: {e}")
        return None


async def aggregate_prices(query: str) -> List[Dict]:
    """
    Fetch all platforms concurrently using asyncio.gather().
    Returns only successful results (None values filtered out).
    """
    logger.info(f"🔍 Aggregating prices for: '{query}' across {len(PLATFORMS)} platforms")

    tasks = [_fetch_platform(platform, query) for platform in PLATFORMS]
    results = await asyncio.gather(*tasks, return_exceptions=False)

    successful = [r for r in results if r is not None]
    logger.info(f"📦 Aggregation complete: {len(successful)}/{len(PLATFORMS)} sources responded")

    return successful
