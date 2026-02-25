"""
Retriever that merges FAISS-based KB results and Tavily web search.
Ensures at least one web result is included when available and keeps top 2.
"""
from typing import List, Dict
from app.llm.ingest import query_index
from app.llm.web_search import duckduckgo_search
from app.utils.logger import logger


def _dedup_contexts(items: List[Dict]) -> List[Dict]:
    seen = set()
    out: List[Dict] = []
    for r in items:
        url = r.get("url") or r.get("meta", {}).get("url")
        key = (url or r.get("text", "")[:200]).strip()
        if not key:
            key = r.get("text", "")[:200]
        if key in seen:
            continue
        seen.add(key)
        out.append(r)
    return out


def retrieve(query: str, kb_k: int = 2, web_k: int = 2) -> List[Dict]:
    kb_contexts: List[Dict] = []
    web_contexts: List[Dict] = []

    try:
        kb = query_index(query, top_k=kb_k)
        for item in kb:
            kb_contexts.append({
                "source": "kb",
                "text": item.get("text", ""),
                "title": None,
                "url": None,
                "meta": item.get("metadata", {})
            })
    except Exception as e:
        logger.warning(f"KB retrieval failed: {e}")

    try:
        web = duckduckgo_search(query, top_k=web_k)
        for item in web:
            web_contexts.append({
                "source": "web",
                "text": f"{item.get('title','')}\n{item.get('snippet','')}",
                "title": item.get("title") or "",
                "url": item.get("url") or "",
                "meta": {"url": item.get("url", "")}
            })
    except Exception as e:
        logger.warning(f"Web retrieval failed: {e}")

    kb_contexts = _dedup_contexts(kb_contexts)
    web_contexts = _dedup_contexts(web_contexts)

    merged: List[Dict] = []
    # Prefer 1 from KB and 1 from Web when both available
    if kb_contexts:
        merged.append(kb_contexts[0])
    if web_contexts:
        merged.append(web_contexts[0])
    # If we still have fewer than 2, fill from remaining KB then Web
    for src_list in (kb_contexts[1:], web_contexts[1:]):
        for item in src_list:
            if len(merged) >= 2:
                break
            # Avoid duplicates
            merged = _dedup_contexts(merged + [item])
        if len(merged) >= 2:
            break

    # Cap at 2 total
    return merged[:2]
