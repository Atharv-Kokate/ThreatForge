"""
Analysis routes for risk assessment
"""

import uuid
from datetime import datetime
from fastapi import APIRouter, HTTPException, BackgroundTasks, Depends
from sqlalchemy.orm import Session
from typing import Optional

from app.schemas.analysis_request import AnalysisRequest
from app.schemas.analysis_response import AnalysisResponse
from app.llm.groq_client import get_llm
from app.llm.prompt_templates import get_chat_prompt
from app.llm.parser import (
    extract_vulnerabilities,
    extract_recommendations,
    extract_risk_score,
    determine_risk_level
)
from app.database.session import get_db
from app.database.models import RiskAssessment
from app.auth.utils import get_current_active_user
from app.database.models import User
from app.utils.logger import logger

router = APIRouter(prefix="/analysis", tags=["analysis"])


@router.post("/analyze", response_model=AnalysisResponse)
async def analyze_risk(
    request: AnalysisRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Analyze AI/ML system for security risks using Groq LLM
    Requires authentication
    """
    start_time = datetime.utcnow()
    request_id = str(uuid.uuid4())
    
    try:
        # Get LLM instance
        llm = get_llm()
        if llm is None:
            logger.error("LLM not initialized - GROQ_API_KEY may be missing or initialization failed")
            raise HTTPException(status_code=503, detail="LLM service not available")
        
        # Extract questionnaire data
        q = request.questionnaire
        
        # Get prompt template
        chat_prompt = get_chat_prompt()
        
        # Format the prompt with questionnaire data
        formatted_prompt = chat_prompt.format_messages(
            product_name=request.product.name,
            product_description=request.product.description,
            product_category=request.product.category or "Not specified",
            product_technology=request.product.technology or "Not specified",
            product_version=request.product.version or "Not specified",
            system_type=q.applicationContext.systemType,
            domain=q.applicationContext.domain,
            criticality=q.applicationContext.criticality,
            data_sources=", ".join(q.dataHandling.sources),
            sensitive_data=", ".join(q.dataHandling.containsSensitive),
            data_sanitization="Yes" if q.dataHandling.sanitizeBeforeModelUse else "No",
            model_type=q.modelDetails.modelType,
            model_maintenance=q.modelDetails.maintenance,
            model_visibility=q.modelDetails.visibility,
            deployment=q.systemArchitecture.deployment,
            access_methods=", ".join(q.systemArchitecture.access),
            integrations=", ".join(q.systemArchitecture.integrations),
            user_inputs=", ".join(q.interactionControl.inputs),
            output_consumption=", ".join(q.interactionControl.outputs),
            prompt_guardrails="Yes" if q.interactionControl.promptGuardrails else "No",
            authentication=", ".join(q.securityPractices.auth),
            logging_practices=q.securityPractices.logging,
            encryption="Yes" if q.securityPractices.encryption else "No",
            multi_tenant="Yes" if q.threatSurface.multiTenant else "No",
            external_queries="Yes" if q.threatSurface.externalQuery else "No",
            adversarial_protection="Yes" if q.threatSurface.adversarialProtection else "No",
            compliance_frameworks=", ".join(q.complianceGovernance.frameworks),
            explainability="Yes" if q.complianceGovernance.explainability else "No",
            retention_policies="Yes" if q.complianceGovernance.retentionPolicies else "No"
        )
        
        # Get LLM response
        logger.info(f"Starting analysis for request {request_id}")
        response = await llm.ainvoke(formatted_prompt)
        
        # Parse the response
        analysis_text = response.content
        
        # Extract structured information from the response
        vulnerabilities = extract_vulnerabilities(analysis_text)
        recommendations = extract_recommendations(analysis_text)
        risk_score = extract_risk_score(analysis_text)
        risk_level = determine_risk_level(risk_score)
        
        processing_time = int((datetime.utcnow() - start_time).total_seconds() * 1000)
        
        # Create response
        result = AnalysisResponse(
            success=True,
            summary=analysis_text[:500] + "..." if len(analysis_text) > 500 else analysis_text,
            vulnerabilities=vulnerabilities,
            recommendations=recommendations,
            riskScore=risk_score,
            riskLevel=risk_level,
            processingTime=processing_time,
            model="llama-3.1-8b-instant",
            confidence=0.85,  # You can calculate this based on response quality
            requestId=request_id,
            timestamp=datetime.utcnow().isoformat()
        )
        
        # Store in database
        try:
            assessment = RiskAssessment(
                id=uuid.UUID(request_id),
                user_id=current_user.id,
                input_data=request.dict(),
                output_data=result.dict()
            )
            db.add(assessment)
            db.commit()
            logger.info(f"Analysis stored in database for request {request_id}")
        except Exception as e:
            db.rollback()
            logger.error(f"Failed to store analysis in database: {str(e)}")
            # Don't fail the request if DB storage fails
        
        logger.info(f"Analysis completed for request {request_id}")
        return result
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Analysis failed for request {request_id}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")


@router.get("/models")
async def get_available_models():
    """Get available Groq models"""
    return {
        "models": [
            {
                "name": "llama-3.1-8b-instant",
                "description": "Llama 3 8B model with 8K context",
                "max_tokens": 8192
            },
            {
                "name": "mixtral-8x7b-32768",
                "description": "Mixtral 8x7B model with 32K context",
                "max_tokens": 32768
            }
        ]
    }

