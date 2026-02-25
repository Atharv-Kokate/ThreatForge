
import os
import sys
import json

# Ensure app is in path
sys.path.append(os.getcwd())

from app.llm.ingest import ingest_path as direct_ingest_path

kb_path = os.path.abspath("app/llm/sample_docs/OWASP_Top_10_LLM_Risks.md")
meta_path = os.path.abspath("app/llm/_faiss/metadata.json")

print(f"Target KB: {kb_path}")

try:
    # 1. Force Clear Metadata just in case
    with open(meta_path, "w") as f:
        json.dump({}, f)
    print("Cleared metadata.json")
    
    # 2. Ingest
    print("Ingesting...")
    ids = direct_ingest_path("owasp_kb_v3", kb_path, {"type": "knowledge_base", "source": "OWASP_Top_10"})
    
    if ids:
        print(f"SUCCESS: Ingested {len(ids)} chunks.")
    else:
        print("FAILURE: No chunks ingested.")
        
    # 3. Read back metadata to verify
    with open(meta_path, "r") as f:
        data = json.load(f)
        keys = list(data.keys())
        print(f"Metadata now has {len(keys)} entries.")
        if len(keys) > 0:
            print(f"Sample Entry: {data[keys[0]]['text'][:100]}...")

except Exception as e:
    print(f"ERROR: {e}")
