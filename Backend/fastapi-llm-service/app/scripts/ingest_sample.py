"""Simple script to ingest the sample RAG document into the FAISS index.

Run from the repository root with PYTHONPATH set to the project root:

Windows (cmd):
    cd Backend\fastapi-llm-service
    set PYTHONPATH=.
    venv\Scripts\activate
    python app\scripts\ingest_sample.py

"""
from pathlib import Path
import os

from app.llm.ingest import ingest_document


def main():
    # script is located at <repo>/app/scripts/ingest_sample.py
    # parent.parent -> <repo>/app, so append 'llm/sample_docs' from there
    base = Path(__file__).resolve().parent.parent / "llm" / "sample_docs"
    sample = base / "sample_doc.txt"
    if not sample.exists():
        print(f"Sample document not found at {sample}")
        return

    text = sample.read_text(encoding="utf-8")
    # Provide a simple metadata dictionary
    metadata = {"source": "sample_docs", "title": "RAG Sample Document"}

    print("Ingesting sample document into FAISS index...")
    ids = ingest_document("sample_doc", text, metadata=metadata)
    print(f"Ingested {len(ids)} chunks. Example ids:\n{ids[:5]}")


if __name__ == "__main__":
    main()
