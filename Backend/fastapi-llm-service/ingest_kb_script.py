
import os
import sys

# Ensure app is in path
sys.path.append(os.getcwd())

from app.routes.ingest import ingest_path
from app.llm.ingest import ingest_path as direct_ingest_path

# Path to the file
kb_path = os.path.abspath("app/llm/sample_docs/sample_doc.txt")

print(f"Ingesting KB from: {kb_path}")

try:
    # We can call the logic directly instead of via API router to be simpler in a script
    ids = direct_ingest_path("owasp_kb_v1", kb_path, {"type": "knowledge_base", "source": "OWASP"})
    
    if ids:
        print(f"SUCCESS: Ingested {len(ids)} chunks.")
    else:
        print("FAILURE: No chunks were ingested.")
except Exception as e:
    print(f"ERROR: {e}")
