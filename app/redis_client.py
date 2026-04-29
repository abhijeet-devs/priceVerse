"""
Redis async client with connection pooling
"""
import json
import logging
from typing import Any, Optional

import redis.asyncio as aioredis

from app.config import settings

logger = logging.getLogger(__name__)

_redis_pool: Optional[aioredis.Redis] = None


async def get_redis() -> aioredis.Redis:
    """Return a shared Redis connection pool."""
    global _redis_pool
    if _redis_pool is None:
        _redis_pool = aioredis.from_url(
            settings.REDIS_URL,
            encoding="utf-8",
            decode_responses=True,
            max_connections=20,
        )
    return _redis_pool


async def cache_get(key: str) -> Optional[Any]:
    """Retrieve a JSON-serialized value from Redis cache."""
    try:
        redis = await get_redis()
        raw = await redis.get(key)
        if raw:
            logger.info(f"🎯 Cache HIT  → {key}")
            return json.loads(raw)
        logger.info(f"❌ Cache MISS → {key}")
        return None
    except Exception as e:
        logger.warning(f"Redis GET error: {e}")
        return None


async def cache_set(key: str, value: Any, ttl: int = None) -> None:
    """Store a JSON-serializable value in Redis with TTL."""
    try:
        redis = await get_redis()
        ttl = ttl or settings.REDIS_TTL_SECONDS
        await redis.setex(key, ttl, json.dumps(value, default=str))
        logger.info(f"💾 Cache SET  → {key} (TTL: {ttl}s)")
    except Exception as e:
        logger.warning(f"Redis SET error: {e}")


async def cache_delete(key: str) -> None:
    """Delete a key from Redis."""
    try:
        redis = await get_redis()
        await redis.delete(key)
    except Exception as e:
        logger.warning(f"Redis DEL error: {e}")
