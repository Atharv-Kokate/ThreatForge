"""
Pydantic schemas for analysis responses
"""

from pydantic import BaseModel, Field
from typing import List
from typing import Optional


class AnalysisResponse(BaseModel):
    success: bool
    summary: str
    vulnerabilities: List[str]
    recommendations: List[str]
    riskScore: float = Field(ge=0, le=10)
    riskLevel: str = Field(..., pattern="^(low|medium|high|critical)$")
    processingTime: int
    model: str
    confidence: float = Field(ge=0, le=1)
    requestId: str
    timestamp: str
    provenance: Optional[List[dict]] = None

