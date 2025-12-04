from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from typing import Optional
import os
import tempfile
import json
from app.llm.ingest import ingest_path

router = APIRouter(prefix="/kb", tags=["knowledge-base"])


@router.post("/ingest")
async def ingest(doc_id: str = Form(...), path: Optional[str] = Form(None), metadata: Optional[str] = Form(None), file: Optional[UploadFile] = File(None)):
    meta = {}
    try:
        if metadata:
            meta = json.loads(metadata)
    except Exception:
        meta = {}
    target_path = None
    if path:
        target_path = path
    elif file:
        try:
            suffix = os.path.splitext(file.filename or "upload")[1]
            fd, tmp_path = tempfile.mkstemp(suffix=suffix)
            with os.fdopen(fd, "wb") as f:
                f.write(await file.read())
            target_path = tmp_path
        except Exception:
            raise HTTPException(status_code=400, detail="Upload failed")
    else:
        raise HTTPException(status_code=400, detail="Provide file or path")

    ids = ingest_path(doc_id, target_path, meta)
    if not ids:
        raise HTTPException(status_code=400, detail="No content ingested")
    return {"doc_id": doc_id, "chunks": len(ids), "ids": ids}
