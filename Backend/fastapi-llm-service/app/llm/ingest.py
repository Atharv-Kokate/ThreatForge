"""Document ingestion: chunking, embedding, and storing vectors in FAISS with metadata.

This module lazy-loads heavy ML libraries (sentence-transformers, numpy, faiss)
to avoid import-time failures when starting the webserver. The embedding model
and index are created/loaded on first use.
"""
import os
import json
import uuid
from typing import Dict, Any, List
from app.utils.logger import logger

BASE_DIR = os.path.dirname(__file__)
DATA_DIR = os.path.join(BASE_DIR, "_faiss")
INDEX_PATH = os.path.join(DATA_DIR, "index.faiss")
META_PATH = os.path.join(DATA_DIR, "metadata.json")

os.makedirs(DATA_DIR, exist_ok=True)

# Model name can be overridden via env
EMBED_MODEL_NAME = os.getenv("EMBED_MODEL", "all-MiniLM-L6-v2")

# Lazy-loaded handles
_embed_model = None
_splitter = None


def _get_embed_model():
    global _embed_model
    if _embed_model is None:
        try:
            from sentence_transformers import SentenceTransformer
        except Exception as e:
            logger.error("Failed to import SentenceTransformer: %s", e)
            raise
        _embed_model = SentenceTransformer(EMBED_MODEL_NAME)
    return _embed_model


def _get_splitter():
    global _splitter
    if _splitter is None:
        try:
            from langchain.text_splitter import RecursiveCharacterTextSplitter
        except Exception as e:
            logger.error("Failed to import RecursiveCharacterTextSplitter: %s", e)
            raise
        _splitter = RecursiveCharacterTextSplitter(chunk_size=800, chunk_overlap=150)
    return _splitter


def _load_metadata() -> Dict[str, Dict[str, Any]]:
    if os.path.exists(META_PATH):
        with open(META_PATH, "r", encoding="utf-8") as f:
            return json.load(f)
    return {}


def _save_metadata(meta: Dict[str, Dict[str, Any]]):
    with open(META_PATH, "w", encoding="utf-8") as f:
        json.dump(meta, f, ensure_ascii=False, indent=2)


def _init_index(dim: int):
    try:
        import faiss
    except Exception as e:
        logger.error("Failed to import faiss: %s", e)
        raise
    # Create a simple flat index for POC
    index = faiss.IndexFlatL2(dim)
    return index


def _load_index(dim: int):
    try:
        import faiss
    except Exception as e:
        logger.error("Failed to import faiss: %s", e)
        raise

    if os.path.exists(INDEX_PATH):
        try:
            return faiss.read_index(INDEX_PATH)
        except Exception:
            logger.warning("Failed to read existing FAISS index; recreating")
    return _init_index(dim)


def persist_index(index):
    try:
        import faiss
    except Exception as e:
        logger.error("Failed to import faiss: %s", e)
        raise
    faiss.write_index(index, INDEX_PATH)


def ingest_document(doc_id: str, text: str, metadata: Dict[str, Any] = None) -> List[str]:
    """Chunk `text`, embed chunks, add to FAISS index and save metadata.
    Returns list of chunk ids added.
    """
    metadata = metadata or {}
    splitter = _get_splitter()
    chunks = splitter.split_text(text)
    if not chunks:
        return []

    model = _get_embed_model()
    try:
        import numpy as np
    except Exception as e:
        logger.error("Failed to import numpy: %s", e)
        raise

    vectors = model.encode(chunks)
    dim = vectors.shape[1]
    index = _load_index(dim)

    meta = _load_metadata()
    ids = []
    for i, (chunk, vec) in enumerate(zip(chunks, vectors)):
        chunk_id = f"{doc_id}_{i}_{uuid.uuid4().hex[:8]}"
        # FAISS expects float32
        vec32 = np.asarray(vec, dtype=np.float32)
        index.add(np.expand_dims(vec32, axis=0))
        # Keep metadata mapping by insertion order using an incremental counter
        meta[chunk_id] = {
            "doc_id": doc_id,
            "text": chunk,
            "metadata": metadata
        }
        ids.append(chunk_id)

    persist_index(index)
    _save_metadata(meta)
    logger.info(f"Ingested {len(ids)} chunks for document {doc_id}")
    return ids


def query_index(query: str, top_k: int = 2):
    """Return top_k chunks and metadata for a query."""
    model = _get_embed_model()
    try:
        import numpy as np
    except Exception as e:
        logger.error("Failed to import numpy: %s", e)
        raise

    q_vec = model.encode([query])[0].astype("float32")
    # load any index (we infer dim)
    # If index not exists, return empty
    try:
        # infer dim from model
        dim = q_vec.shape[0]
        index = _load_index(dim)
    except Exception:
        return []

    if index.ntotal == 0:
        return []

    D, I = index.search(np.expand_dims(q_vec, axis=0), top_k)
    meta = _load_metadata()
    results = []
    # FAISS returns indices in insertion order; we don't have ids mapping by position, so
    # we will map by retrieval order using meta keys preserved insertion order (best-effort).
    # For POC, simply return the first top_k metadata items.
    # A production implementation should store a parallel id->position mapping.
    keys = list(meta.keys())
    for idx in I[0]:
        if idx < len(keys):
            k = keys[idx]
            results.append({"id": k, "text": meta[k]["text"], "metadata": meta[k]["metadata"]})
    return results
