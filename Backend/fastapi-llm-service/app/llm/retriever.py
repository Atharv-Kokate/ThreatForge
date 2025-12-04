"""
Retriever that merges FAISS-based KB results and Tavily web search.
Keeps top 2 results only (as requested).
"""
from typing import List, Dict
from app.llm.ingest import query_index
from app.llm.web_search import tavily_search
from app.utils.logger import logger


def retrieve(query: str, kb_k: int = 2, web_k: int = 2) -> List[Dict]:
    """Return merged contexts from knowledge base and web search.
    Keeps at most top 2 combined (prioritize KB then web results).
    """
    results = []
    try:
        kb = query_index(query, top_k=kb_k)
        for item in kb:
            results.append({"source": "kb", "text": item.get("text", ""), "meta": item.get("metadata", {})})
    except Exception as e:
        logger.warning(f"KB retrieval failed: {e}")

    try:
        web = tavily_search(query, top_k=web_k)
        for item in web:
            results.append({"source": "web", "text": f"{item.get('title','')}\n{item.get('snippet','')}", "meta": {"url": item.get('url','')}})
    except Exception as e:
        logger.warning(f"Web retrieval failed: {e}")

    # Deduplicate by snippet/url
    seen = set()
    out = []
    for r in results:
        key = (r.get('meta', {}).get('url') or r.get('text', '')[:200]).strip()
        if not key:
            key = r.get('text','')[:200]
        if key in seen:
            continue
        seen.add(key)
        out.append(r)
        if len(out) >= 2:  # keep top 2 only
            break

    return out
