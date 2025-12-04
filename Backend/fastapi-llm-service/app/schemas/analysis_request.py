"""
Pydantic schemas for analysis requests
"""

from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any


class ApplicationContext(BaseModel):
    systemType: str = Field(..., description="Type of system being built")
    domain: str = Field(..., description="Domain/use case")
    criticality: str = Field(..., description="Criticality level")
    otherSystemType: Optional[str] = None
    otherDomain: Optional[str] = None


class DataHandling(BaseModel):
    sources: List[str] = Field(..., description="Primary data sources")
    containsSensitive: List[str] = Field(..., description="Types of sensitive data")
    sanitizeBeforeModelUse: bool = Field(..., description="Data validation/sanitization")


class ModelDetails(BaseModel):
    modelType: str = Field(..., description="Type of model being used")
    maintenance: str = Field(..., description="How model is maintained")
    visibility: str = Field(..., description="Visibility into model internals")


class SystemArchitecture(BaseModel):
    deployment: str = Field(..., description="Where system is deployed")
    access: List[str] = Field(..., description="How access is provided")
    integrations: List[str] = Field(..., description="Enabled integrations")


class InteractionControl(BaseModel):
    inputs: List[str] = Field(..., description="Allowed user inputs")
    outputs: List[str] = Field(..., description="How outputs are consumed")
    promptGuardrails: bool = Field(..., description="Use of prompt guardrails")


class SecurityPractices(BaseModel):
    auth: List[str] = Field(..., description="Authentication methods")
    logging: str = Field(..., description="Logging practices")
    encryption: bool = Field(..., description="Data encryption")


class ThreatSurface(BaseModel):
    multiTenant: bool = Field(..., description="Multi-tenant system")
    externalQuery: bool = Field(..., description="External user queries")
    adversarialProtection: bool = Field(..., description="Adversarial protections")


class ComplianceGovernance(BaseModel):
    frameworks: List[str] = Field(..., description="Compliance frameworks")
    explainability: bool = Field(..., description="Need for explainability")
    retentionPolicies: bool = Field(..., description="Data retention policies")


class Questionnaire(BaseModel):
    applicationContext: ApplicationContext
    dataHandling: DataHandling
    modelDetails: ModelDetails
    systemArchitecture: SystemArchitecture
    interactionControl: InteractionControl
    securityPractices: SecurityPractices
    threatSurface: ThreatSurface
    complianceGovernance: ComplianceGovernance


class Product(BaseModel):
    name: str
    description: str
    category: Optional[str] = None
    technology: Optional[str] = None
    version: Optional[str] = None


class AnalysisRequest(BaseModel):
    product: Product
    analysis: Dict[str, Any] = Field(default_factory=dict)
    questionnaire: Questionnaire
    context: Dict[str, Any] = Field(default_factory=dict)
    metadata: Dict[str, Any] = Field(default_factory=dict)
    class LLMConfig(BaseModel):
        provider: Optional[str] = None
        model: Optional[str] = None
        temperature: Optional[float] = None
    llm: Optional[LLMConfig] = None

