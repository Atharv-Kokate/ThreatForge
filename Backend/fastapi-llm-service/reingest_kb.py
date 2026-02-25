
import os
import sys

# Ensure app is in path
sys.path.append(os.getcwd())

from app.llm.ingest import ingest_path as direct_ingest_path

# Path to the file
kb_path = os.path.abspath("app/llm/sample_docs/sample_doc.txt")

print(f"Re-ingesting fresh KB from: {kb_path}")

try:
    ids = direct_ingest_path("owasp_kb_v2", kb_path, {"type": "knowledge_base", "source": "OWASP_Top_10"})
    
    if ids:
        print(f"SUCCESS: Ingested {len(ids)} chunks.")
    else:
        print("FAILURE: No chunks were ingested.")
except Exception as e:
    print(f"ERROR: {e}")
