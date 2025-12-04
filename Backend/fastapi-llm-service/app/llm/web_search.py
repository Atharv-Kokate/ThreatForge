"""
Tavily web search adapter

This file contains a minimal adapter for the Tavily web search API.
Set `TAVILY_API_KEY` in your `.env` to enable web search.
"""
import os
import requests
from typing import List, Dict
from app.utils.logger import logger

TAVILY_API_KEY = os.getenv("TAVILY_API_KEY")
TAVILY_ENDPOINT = os.getenv("TAVILY_ENDPOINT", "https://api.tavily.ai/v1/search")


def tavily_search(query: str, top_k: int = 2) -> List[Dict]:
    """Call Tavily search API and return up to top_k results with title/snippet/url."""
    if not TAVILY_API_KEY:
        logger.debug("TAVILY_API_KEY not set; skipping web search")
        return []

    headers = {"Authorization": f"Bearer {TAVILY_API_KEY}", "Accept": "application/json"}
    params = {"q": query, "limit": top_k}
    try:
        r = requests.get(TAVILY_ENDPOINT, headers=headers, params=params, timeout=8)
        r.raise_for_status()
        payload = r.json()
        # Adapt to expected response structure; be resilient
        items = payload.get("results") or payload.get("items") or []
        out = []
        for it in items[:top_k]:
            out.append({
                "title": it.get("title") or it.get("name") or "",
                "snippet": it.get("snippet") or it.get("description") or "",
                "url": it.get("url") or it.get("link") or ""
            })
        return out
    except Exception as e:
        logger.warning(f"Tavily search failed: {e}")
        return []
