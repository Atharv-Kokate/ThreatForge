"""
Tavily web search adapter

Set `TAVILY_API_KEY` in your `.env` to enable web search.
Uses POST with JSON payload when possible; falls back to GET.
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

    # Prefer POST with JSON body; include both header and body key for compatibility
    headers = {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": f"Bearer {TAVILY_API_KEY}",
        "X-API-Key": TAVILY_API_KEY,
    }
    body = {
        "query": query,
        "max_results": top_k,
        "search_depth": "basic",
        "include_answer": False,
        "include_raw_content": False,
        "api_key": TAVILY_API_KEY,
    }
    try:
        r = requests.post(TAVILY_ENDPOINT, headers=headers, json=body, timeout=10)
        r.raise_for_status()
        payload = r.json()
    except Exception as e_post:
        logger.info(f"Tavily POST failed, falling back to GET: {e_post}")
        try:
            params = {"query": query, "max_results": top_k}
            # Also support legacy 'q' and 'limit' naming
            params.setdefault("q", query)
            params.setdefault("limit", top_k)
            r = requests.get(TAVILY_ENDPOINT, headers=headers, params=params, timeout=10)
            r.raise_for_status()
            payload = r.json()
        except Exception as e_get:
            logger.warning(f"Tavily search failed: {e_get}")
            return []

    items = (
        payload.get("results")
        or payload.get("items")
        or payload.get("data")
        or payload.get("organic_results")
        or []
    )
    out: List[Dict] = []
    for it in items[:top_k]:
        out.append({
            "title": it.get("title") or it.get("name") or "",
            "snippet": it.get("content") or it.get("snippet") or it.get("description") or it.get("text") or "",
            "url": it.get("url") or it.get("link") or "",
        })

    if not out:
        logger.info(f"Tavily returned 0 results for query '{query}'")
    return out
