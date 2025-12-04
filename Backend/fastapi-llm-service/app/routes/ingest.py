from fastapi import APIRouter, HTTPException, Body, Depends
from app.llm.ingest import ingest_document, ingest_path
from app.auth.utils import get_current_active_user
from app.database.models import User

router = APIRouter(prefix="/ingest", tags=["ingestion"])


@router.post("/text")
async def ingest_text(docId: str = Body(...), text: str = Body(...), metadata: dict = Body(default_factory=dict), current_user: User = Depends(get_current_active_user)):
    ids = ingest_document(docId, text, metadata or {})
    if not ids:
        raise HTTPException(status_code=400, detail="No chunks ingested")
    return {"docId": docId, "chunks": len(ids)}


@router.post("/path")
async def ingest_from_path(docId: str = Body(...), path: str = Body(...), metadata: dict = Body(default_factory=dict), current_user: User = Depends(get_current_active_user)):
    ids = ingest_path(docId, path, metadata or {})
    if not ids:
        raise HTTPException(status_code=400, detail="No chunks ingested")
    return {"docId": docId, "chunks": len(ids)}
