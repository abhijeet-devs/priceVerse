"""
Intelligent Normalizer — uses Pandas to standardize price data
across all platforms so comparisons are truly "apples-to-apples".

Total Price = Base Price + Delivery Fee + Tax
Value Score = Total Price / (1 + 1/delivery_time)  → lower is better
"""
import logging
from typing import Dict, List

import pandas as pd

logger = logging.getLogger(__name__)


def normalize_results(raw_results: List[Dict]) -> List[Dict]:
    """
    Clean, validate, and enrich raw platform results.
    Adds: total_price (recalculated), value_score, is_best_value flag.
    """
    if not raw_results:
        return []

    df = pd.DataFrame(raw_results)

    # ── 1. Ensure required columns exist ──────────────────────────────────────
    required = ["platform", "base_price", "delivery_fee", "tax", "delivery_time_min"]
    for col in required:
        if col not in df.columns:
            df[col] = 0.0

    # ── 2. Coerce numeric columns ──────────────────────────────────────────────
    numeric_cols = ["base_price", "delivery_fee", "tax", "delivery_time_min", "rating"]
    for col in numeric_cols:
        if col in df.columns:
            df[col] = pd.to_numeric(df[col], errors="coerce").fillna(0.0)

    # ── 3. Recalculate total_price (source of truth) ───────────────────────────
    df["total_price"] = (df["base_price"] + df["delivery_fee"] + df["tax"]).round(2)

    # ── 4. Remove out-of-stock items from value scoring ───────────────────────
    df["in_stock"] = df.get("in_stock", pd.Series([True] * len(df))).fillna(True)

    # ── 5. Compute Value Score ─────────────────────────────────────────────────
    # Score penalizes high price AND long delivery time
    # Lower score = better value
    df["delivery_time_min"] = df["delivery_time_min"].clip(lower=1)  # avoid division by zero
    df["value_score"] = (
        df["total_price"] * (1 + df["delivery_time_min"] / 60)
    ).round(4)

    # ── 6. Determine Best Value (in-stock only) ───────────────────────────────
    in_stock_mask = df["in_stock"] == True
    df["is_best_value"] = False

    if in_stock_mask.any():
        best_idx = df.loc[in_stock_mask, "value_score"].idxmin()
        df.at[best_idx, "is_best_value"] = True

    # ── 7. Sort: best value first ──────────────────────────────────────────────
    df = df.sort_values("value_score").reset_index(drop=True)

    # ── 8. Round all price fields to 2 decimals ────────────────────────────────
    for col in ["base_price", "delivery_fee", "tax", "total_price"]:
        df[col] = df[col].round(2)

    logger.info(
        f"✅ Normalized {len(df)} results | "
        f"Best value: {df.loc[df['is_best_value'] == True, 'platform'].values}"
    )

    return df.to_dict(orient="records")


def get_best_value_platform(normalized: List[Dict]) -> str | None:
    """Return the platform name with is_best_value=True."""
    for r in normalized:
        if r.get("is_best_value"):
            return r["platform"]
    return None
