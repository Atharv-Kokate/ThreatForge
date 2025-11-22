"""
Status routes for checking analysis status
"""

import uuid
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import Optional

from app.database.session import get_db
from app.database.models import RiskAssessment
from app.auth.utils import get_current_active_user
from app.database.models import User
from app.utils.logger import logger

router = APIRouter(prefix="/analysis", tags=["analysis"])


@router.get("/status/{request_id}")
async def get_analysis_status(
    request_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Get analysis status by request ID
    Requires authentication
    """
    try:
        # Convert string to UUID
        assessment_id = uuid.UUID(request_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid request ID format")
    
    # Query database
    assessment = db.query(RiskAssessment).filter(RiskAssessment.id == assessment_id).first()
    
    if not assessment:
        raise HTTPException(status_code=404, detail="Analysis not found")
    
    # Check if user has access (if assessment has a user_id, only that user can access)
    if assessment.user_id and assessment.user_id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="You don't have permission to access this analysis"
        )
    
    # Return the output data
    return assessment.output_data

