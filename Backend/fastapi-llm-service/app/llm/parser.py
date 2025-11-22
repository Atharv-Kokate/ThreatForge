"""
Parser functions for extracting structured data from LLM responses
"""

from typing import List
import re


def extract_vulnerabilities(text: str) -> List[str]:
    """Extract vulnerabilities from analysis text"""
    # Simple extraction - in production, use more sophisticated parsing
    vulnerabilities = []
    lines = text.split('\n')
    for line in lines:
        if any(keyword in line.lower() for keyword in ['vulnerability', 'risk', 'threat', 'weakness', 'exposure']):
            if line.strip():
                vulnerabilities.append(line.strip())
    return vulnerabilities[:10]  # Limit to 10 vulnerabilities


def extract_recommendations(text: str) -> List[str]:
    """Extract recommendations from analysis text"""
    # Simple extraction - in production, use more sophisticated parsing
    recommendations = []
    lines = text.split('\n')
    for line in lines:
        if any(keyword in line.lower() for keyword in ['recommend', 'suggest', 'should', 'implement', 'consider']):
            if line.strip():
                recommendations.append(line.strip())
    return recommendations[:10]  # Limit to 10 recommendations


def extract_risk_score(text: str) -> float:
    """Extract risk score from analysis text"""
    # Simple extraction - in production, use more sophisticated parsing
    score_pattern = r'risk score[:\s]*(\d+(?:\.\d+)?)'
    match = re.search(score_pattern, text.lower())
    if match:
        return float(match.group(1))
    
    # Default scoring based on keywords
    high_risk_keywords = ['critical', 'severe', 'high risk', 'urgent']
    medium_risk_keywords = ['medium', 'moderate', 'significant']
    
    text_lower = text.lower()
    if any(keyword in text_lower for keyword in high_risk_keywords):
        return 8.0
    elif any(keyword in text_lower for keyword in medium_risk_keywords):
        return 5.0
    else:
        return 3.0


def determine_risk_level(score: float) -> str:
    """Determine risk level based on score"""
    if score >= 8:
        return "critical"
    elif score >= 6:
        return "high"
    elif score >= 3:
        return "medium"
    else:
        return "low"

