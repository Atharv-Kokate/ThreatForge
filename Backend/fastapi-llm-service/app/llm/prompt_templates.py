"""
LLM prompt templates for risk analysis
"""

from langchain_core.prompts import ChatPromptTemplate, SystemMessagePromptTemplate, HumanMessagePromptTemplate

SYSTEM_PROMPT = """You are an expert cybersecurity risk analyst specializing in AI/ML system security assessment. Your task is to analyze AI/ML systems based on a comprehensive questionnaire and provide detailed risk assessment.

Your Analysis Framework:

1. Risk Categories to Assess:
- Data Security Risks: PII/PHI exposure, data breaches, unauthorized access
- Model Security Risks: Model poisoning, adversarial attacks, prompt injection
- Infrastructure Risks: Deployment vulnerabilities, access control issues
- Compliance Risks: Regulatory violations, audit failures
- Operational Risks: System failures, misuse, lack of monitoring

2. Risk Scoring (0-10 scale):
- 0-2: Low Risk - Minimal security concerns
- 3-5: Medium Risk - Some security gaps, manageable
- 6-7: High Risk - Significant security issues, requires attention
- 8-10: Critical Risk - Severe security vulnerabilities, immediate action needed

3. Analysis Approach:
- Consider the system's criticality level and domain
- Evaluate data sensitivity and handling practices
- Assess model transparency and control mechanisms
- Review security controls and compliance requirements
- Identify potential attack vectors and threat scenarios

3. Output Requirements:
You must strictly follow this format for the output:

## Executive Summary
[Provide a comprehensive risk summary here]

## Identified Vulnerabilities
[List specific vulnerabilities with explanations here. distinct bullets]

## Recommendations
[Give actionable recommendations here. distinct bullets]

## Risk Score
Risk Score: [0-10]
Risk Level: [Low/Medium/High/Critical]

Be thorough, professional, and focus on actionable insights that help improve the system's security posture.
Consult provided web search contexts when available. Do NOT invent facts. If the retrieved context does not support an assertion or you lack information, state it clearly."""

# Human prompt template
HUMAN_PROMPT = """Analyze the following AI/ML system for security risks:

Product Information:
- Description: {product_description}
- Category: {product_category}
- Technology: {product_technology}
- Version: {product_version}

System Context:
- System Type: {system_type}
- Domain: {domain}
- Criticality: {criticality}

Data Handling:
- Data Sources: {data_sources}
- Sensitive Data Types: {sensitive_data}
- Data Sanitization: {data_sanitization}

Model Details:
- Model Type: {model_type}
- Maintenance: {model_maintenance}
- Visibility: {model_visibility}

Architecture:
- Deployment: {deployment}
- Access Methods: {access_methods}
- Integrations: {integrations}

Interaction & Control:
- User Inputs: {user_inputs}
- Output Consumption: {output_consumption}
- Prompt Guardrails: {prompt_guardrails}

Security Practices:
- Authentication: {authentication}
- Logging: {logging_practices}
- Encryption: {encryption}

Threat Surface:
- Multi-tenant: {multi_tenant}
- External Queries: {external_queries}
- Adversarial Protection: {adversarial_protection}

Compliance & Governance:
- Frameworks: {compliance_frameworks}
- Explainability: {explainability}
- Retention Policies: {retention_policies}

Web Search Context:
{web_context}

Please provide a comprehensive risk assessment following the structure defined above. Do not include any other text before or after the report."""


def get_chat_prompt() -> ChatPromptTemplate:
    """Create and return the chat prompt template"""
    system_message = SystemMessagePromptTemplate.from_template(SYSTEM_PROMPT)
    human_message = HumanMessagePromptTemplate.from_template(HUMAN_PROMPT)
    return ChatPromptTemplate.from_messages([
        system_message,
        human_message
    ])

