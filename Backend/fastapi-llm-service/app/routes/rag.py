"""
RAG endpoint: combines KB retrieval (FAISS) and Tavily web search, builds a prompt and calls the Groq LLM.
"""
from fastapi import APIRouter, HTTPException, BackgroundTasks, Depends
from sqlalchemy.orm import Session
from datetime import datetime
import uuid
from app.schemas.analysis_request import AnalysisRequest
from app.schemas.analysis_response import AnalysisResponse
from app.llm.groq_client import get_llm
from app.llm.retriever import retrieve
from app.llm.parser import extract_vulnerabilities, extract_recommendations, extract_risk_score, determine_risk_level
from app.database.session import get_db
from app.auth.utils import get_current_active_user
from app.database.models import User
from app.database.models import RiskAssessment
from app.utils.logger import logger
from app.llm.prompt_templates import get_chat_prompt

router = APIRouter(prefix="/analysis", tags=["analysis"])


@router.post("/analyze_rag", response_model=AnalysisResponse)
async def analyze_rag(
    request: AnalysisRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Perform RAG-powered analysis: retrieve contexts, assemble prompt, call LLM."""
    start_time = datetime.utcnow()
    request_id = str(uuid.uuid4())

    try:
        # Retrieve contexts (top 2 total: KB + web)
        query_text = f"{request.product.name} {request.product.description}"
        contexts = retrieve(query_text, kb_k=2, web_k=2)
        # Build the base prompt using the same chat template as /analysis/analyze
        chat_prompt = get_chat_prompt()
        formatted_prompt = chat_prompt.format_messages(
            product_name=request.product.name,
            product_description=request.product.description,
            product_category=request.product.category or "Not specified",
            product_technology=request.product.technology or "Not specified",
            product_version=request.product.version or "Not specified",
            system_type=request.questionnaire.applicationContext.systemType,
            domain=request.questionnaire.applicationContext.domain,
            criticality=request.questionnaire.applicationContext.criticality,
            data_sources=", ".join(request.questionnaire.dataHandling.sources),
            sensitive_data=", ".join(request.questionnaire.dataHandling.containsSensitive),
            data_sanitization="Yes" if request.questionnaire.dataHandling.sanitizeBeforeModelUse else "No",
            model_type=request.questionnaire.modelDetails.modelType,
            model_maintenance=request.questionnaire.modelDetails.maintenance,
            model_visibility=request.questionnaire.modelDetails.visibility,
            deployment=request.questionnaire.systemArchitecture.deployment,
            access_methods=", ".join(request.questionnaire.systemArchitecture.access),
            integrations=", ".join(request.questionnaire.systemArchitecture.integrations),
            user_inputs=", ".join(request.questionnaire.interactionControl.inputs),
            output_consumption=", ".join(request.questionnaire.interactionControl.outputs),
            prompt_guardrails="Yes" if request.questionnaire.interactionControl.promptGuardrails else "No",
            authentication=", ".join(request.questionnaire.securityPractices.auth),
            logging_practices=request.questionnaire.securityPractices.logging,
            encryption="Yes" if request.questionnaire.securityPractices.encryption else "No",
            multi_tenant="Yes" if request.questionnaire.threatSurface.multiTenant else "No",
            external_queries="Yes" if request.questionnaire.threatSurface.externalQuery else "No",
            adversarial_protection="Yes" if request.questionnaire.threatSurface.adversarialProtection else "No",
            compliance_frameworks=", ".join(request.questionnaire.complianceGovernance.frameworks),
            explainability="Yes" if request.questionnaire.complianceGovernance.explainability else "No",
            retention_policies="Yes" if request.questionnaire.complianceGovernance.retentionPolicies else "No"
        )

        # Build retrieved context block (numbered) and provenance list
        provenance = []
        context_lines = []
        if contexts:
            for i, c in enumerate(contexts, start=1):
                src = c.get("source") or c.get("url") or "kb"
                url = c.get("url")
                title = c.get("title") or None
                text = c.get("text") or ""
                snippet = text if len(text) <= 1000 else text[:1000] + "..."
                context_lines.append(f"{i}. Source: {src} {f'| {url}' if url else ''}\n{snippet}")
                provenance.append({
                    "id": c.get("id") or str(i),
                    "source": src,
                    "url": url,
                    "title": title,
                    "snippet": snippet
                })

        context_block = "\n\n".join(context_lines) if context_lines else "(no retrieved context available)"

        # Append retrieved contexts and anti-hallucination guard to the formatted prompt
        # Try to render the chat prompt into plain text for a single-call LLM client
        original_prompt_text = ""
        try:
            to_messages = getattr(formatted_prompt, "to_messages", None)
            if callable(to_messages):
                msgs = formatted_prompt.to_messages()
                original_prompt_text = "\n\n".join([getattr(m, "content", str(m)) for m in msgs])
            elif isinstance(formatted_prompt, list):
                original_prompt_text = "\n\n".join([getattr(m, "content", str(m)) for m in formatted_prompt])
            else:
                original_prompt_text = str(formatted_prompt)
        except Exception:
            original_prompt_text = str(formatted_prompt)
        prompt = (
            "You are an expert cybersecurity risk analyst. Use the original prompt below and consult the retrieved contexts only when needed. "
            "Do NOT invent facts. If the retrieved context does not support an assertion, respond with 'Insufficient context'.\n\n"
            f"Original Prompt:\n{original_prompt_text}\n\n"
            f"Retrieved context (top {len(contexts)}):\n{context_block}\n\n"
            "Provide a concise risk analysis, list vulnerabilities, recommendations, and a numeric risk score (0-10)."
        )

        llm = get_llm()
        if llm is None:
            logger.error("LLM not initialized - GROQ_API_KEY may be missing or initialization failed")
            raise HTTPException(status_code=503, detail="LLM service not available")

        logger.info(f"Starting RAG analysis for request {request_id}")
        response = await llm.ainvoke(prompt)
        analysis_text = response.content

        vulnerabilities = extract_vulnerabilities(analysis_text)
        recommendations = extract_recommendations(analysis_text)
        risk_score = extract_risk_score(analysis_text)
        risk_level = determine_risk_level(risk_score)

        processing_time = int((datetime.utcnow() - start_time).total_seconds() * 1000)

        result = AnalysisResponse(
            success=True,
            summary=analysis_text[:500] + "..." if len(analysis_text) > 500 else analysis_text,
            vulnerabilities=vulnerabilities,
            recommendations=recommendations,
            riskScore=risk_score,
            riskLevel=risk_level,
            processingTime=processing_time,
            model="rag-groq",
            confidence=0.7,
            requestId=request_id,
            timestamp=datetime.utcnow().isoformat()
        )

        # Attach provenance if available
        if provenance:
            result.provenance = provenance
        

        # Store in DB similar to /analysis/analyze so the result is queryable by history/status endpoints
        try:
            assessment = RiskAssessment(
                id=uuid.UUID(request_id),
                user_id=current_user.id,
                input_data=request.dict(),
                output_data=result.dict()
            )
            db.add(assessment)
            db.commit()
            logger.info(f"RAG analysis stored in database for request {request_id}")
        except Exception as db_exc:
            db.rollback()
            logger.error(f"Failed to store RAG analysis in DB for request {request_id}: {db_exc}")
            # Do not fail the API call if DB storage fails

        logger.info(f"RAG analysis completed for request {request_id}")
        return result

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"RAG analysis failed for request {request_id}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"RAG analysis failed: {str(e)}")
