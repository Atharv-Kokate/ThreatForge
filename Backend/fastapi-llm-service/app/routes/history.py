"""
History routes for fetching user assessment history
"""

from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import desc

from app.database.session import get_db
from app.database.models import RiskAssessment
from app.auth.utils import get_current_active_user
from app.database.models import User
from app.utils.logger import logger

router = APIRouter(prefix="/analysis", tags=["analysis"])


@router.get("/history")
async def get_assessment_history(
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(100, ge=1, le=100, description="Maximum number of records to return"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Get assessment history for the current user
    Returns a list of assessments ordered by creation date (newest first)
    """
    try:
        # Query assessments for the current user
        assessments = db.query(RiskAssessment)\
            .filter(RiskAssessment.user_id == current_user.id)\
            .order_by(desc(RiskAssessment.created_at))\
            .offset(skip)\
            .limit(limit)\
            .all()
        
        # Format response
        history = []
        for assessment in assessments:
            history.append({
                "id": str(assessment.id),
                "requestId": str(assessment.id),
                "created_at": assessment.created_at.isoformat(),
                "updated_at": assessment.updated_at.isoformat(),
                "input_data": assessment.input_data,
                "output_data": assessment.output_data
            })
        
        # Get total count
        total_count = db.query(RiskAssessment)\
            .filter(RiskAssessment.user_id == current_user.id)\
            .count()
        
        logger.info(f"Retrieved {len(history)} assessments for user {current_user.email}")
        
        return {
            "assessments": history,
            "total": total_count,
            "skip": skip,
            "limit": limit
        }
        
    except Exception as e:
        logger.error(f"Error fetching assessment history: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to fetch assessment history: {str(e)}")

