"""
Realistic mock data for all platforms — used when live scraping is unavailable.
Simulates Amazon, Flipkart, Blinkit, and Swiggy Instamart responses.
"""
import random
from datetime import datetime
from typing import Dict, List

PLATFORM_META = {
    "amazon": {
        "logo": "🛒",
        "color": "#FF9900",
        "base_url": "https://www.amazon.in",
    },
    "flipkart": {
        "logo": "⭐",
        "color": "#2874F0",
        "base_url": "https://www.flipkart.com",
    },
    "blinkit": {
        "logo": "⚡",
        "color": "#0C831F",
        "base_url": "https://blinkit.com",
    },
    "swiggy_instamart": {
        "logo": "🧡",
        "color": "#FC8019",
        "base_url": "https://www.swiggy.com/instamart",
    },
}

PRODUCT_CATALOG: Dict[str, List[Dict]] = {
    "default": [
        {
            "name": "{query} — Premium Quality",
            "base_price_range": (499, 2999),
            "delivery_fee_range": (0, 99),
            "tax_rate": 0.18,
            "delivery_time_range": (30, 120),
            "rating_range": (3.5, 5.0),
            "image_url": "https://via.placeholder.com/300x300/1a1a2e/ffffff?text={query}",
        }
    ],
    "smartphone": [
        {"name": "{query} — 128GB / 8GB RAM", "base_price_range": (14999, 89999)},
        {"name": "{query} Pro — 256GB / 12GB RAM", "base_price_range": (24999, 129999)},
    ],
    "laptop": [
        {"name": "{query} — Core i5 / 16GB / SSD", "base_price_range": (45999, 129999)},
    ],
    "milk": [
        {"name": "Amul {query} Full Cream 1L", "base_price_range": (58, 68)},
        {"name": "Mother Dairy {query} Toned 1L", "base_price_range": (54, 62)},
    ],
    "rice": [
        {"name": "India Gate {query} Basmati 5kg", "base_price_range": (480, 650)},
        {"name": "Daawat {query} Extra Long 5kg", "base_price_range": (420, 580)},
    ],
}


def _get_product_template(query: str) -> Dict:
    q_lower = query.lower()
    for keyword, templates in PRODUCT_CATALOG.items():
        if keyword != "default" and keyword in q_lower:
            return random.choice(templates)
    return random.choice(PRODUCT_CATALOG["default"])


def generate_platform_mock(platform: str, query: str) -> Dict:
    """Generate a realistic mock result for a given platform and query."""
    meta = PLATFORM_META[platform]
    template = _get_product_template(query)

    price_range = template.get("base_price_range", (499, 2999))
    base_price = round(random.uniform(*price_range), 2)

    # Platform-specific delivery logic
    if platform == "blinkit":
        delivery_fee = 0.0 if base_price > 199 else 25.0
        delivery_time = random.randint(8, 20)          # quick commerce
    elif platform == "swiggy_instamart":
        delivery_fee = 0.0 if base_price > 299 else 30.0
        delivery_time = random.randint(10, 25)
    elif platform == "amazon":
        delivery_fee = 0.0 if base_price > 499 else 40.0
        delivery_time = random.randint(60, 1440)       # 1hr – 1day
    else:  # flipkart
        delivery_fee = 0.0 if base_price > 500 else 45.0
        delivery_time = random.randint(60, 2880)

    tax = round(base_price * template.get("tax_rate", 0.18), 2)
    total_price = round(base_price + delivery_fee + tax, 2)
    rating = round(random.uniform(*template.get("rating_range", (3.5, 5.0))), 1)

    product_name = template["name"].replace("{query}", query.title())
    image_url = template.get(
        "image_url",
        f"https://via.placeholder.com/300x300/1a1a2e/ffffff?text={query.replace(' ', '+')}",
    ).replace("{query}", query.replace(" ", "+"))

    return {
        "platform": platform,
        "platform_logo": meta["logo"],
        "platform_color": meta["color"],
        "product_name": product_name,
        "base_price": base_price,
        "delivery_fee": delivery_fee,
        "tax": tax,
        "total_price": total_price,
        "delivery_time_min": delivery_time,
        "image_url": image_url,
        "product_url": f"{meta['base_url']}/search?q={query.replace(' ', '+')}",
        "rating": rating,
        "in_stock": random.random() > 0.1,  # 90% in stock
        "is_best_value": False,
        "value_score": 0.0,
        "fetched_at": datetime.utcnow().isoformat(),
    }


def get_all_mock_results(query: str) -> List[Dict]:
    """Return mock results for all 4 platforms."""
    return [generate_platform_mock(p, query) for p in PLATFORM_META.keys()]
