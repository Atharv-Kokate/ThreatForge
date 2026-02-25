"""
DuckDuckGo web search adapter
"""
from typing import List, Dict
from duckduckgo_search import DDGS
from app.utils.logger import logger
import time
import random


def duckduckgo_search(query: str, top_k: int = 2) -> List[Dict]:
    """Call DuckDuckGo search API and return up to top_k results with title/snippet/url."""
    logger.info(f"Searching DuckDuckGo for: {query}")
    
    max_retries = 3
    base_delay = 2
    
    for attempt in range(max_retries):
        try:
            results = DDGS().text(query, max_results=top_k)
            out: List[Dict] = []
            if results:
                for it in results:
                    out.append({
                        "title": it.get("title", ""),
                        "snippet": it.get("body", ""),
                        "url": it.get("href", ""),
                    })
            
            if not out:
                logger.info(f"DuckDuckGo returned 0 results for query '{query}'")
            return out
        
        except Exception as e:
            if attempt < max_retries - 1:
                wait_time = base_delay * (2 ** attempt) + random.uniform(0, 1)
                logger.warning(f"DuckDuckGo search failed (attempt {attempt+1}/{max_retries}): {e}. Retrying in {wait_time:.2f}s...")
                time.sleep(wait_time)
            else:
                logger.warning(f"DuckDuckGo search failed after {max_retries} attempts: {e}")
                return []
    return []
