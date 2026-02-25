"""
Parser functions for extracting structured data from LLM responses
"""

from typing import List
import re


def extract_section(text: str, section_name: str, next_section_names: List[str]) -> str:
    """Extract text content between section headers"""
    pattern = f"## {section_name}(.*?)(?:## |$)"
    # We construct a regex that looks for the section header, captures everything until
    # the next section header (indicated by ##) or end of string.
    # The DOTALL flag allows . to match newlines.
    match = re.search(pattern, text, re.DOTALL | re.IGNORECASE)
    if match:
        return match.group(1).strip()
    return ""


def extract_summary(text: str) -> str:
    """Extract executive summary from analysis text"""
    return extract_section(text, "Executive Summary", ["Identified Vulnerabilities", "Recommendations", "Risk Score"])


def extract_vulnerabilities(text: str) -> List[str]:
    """Extract vulnerabilities from analysis text using section matching"""
    section_text = extract_section(text, "Identified Vulnerabilities", ["Recommendations", "Risk Score"])
    
    if not section_text:
        # Fallback for legacy format or if section missing
        return _legacy_extract_list(text, ['vulnerability', 'risk', 'threat', 'weakness', 'exposure'])

    # Split by bullets/numbers and clean up
    items = []
    # Regex to split by markdown list markers (-, *, 1.)
    # This splits on newline followed by a marker
    raw_items = re.split(r'\n(?:\s*[-*]|\s*\d+\.)\s+', '\n' + section_text)
    
    for item in raw_items:
        clean_item = item.strip()
        if clean_item and not clean_item.lower().startswith("identified vulnerabilities"):
            items.append(clean_item)
            
    return items[:15]


def extract_recommendations(text: str) -> List[str]:
    """Extract recommendations from analysis text using section matching"""
    section_text = extract_section(text, "Recommendations", ["Risk Score"])
    
    if not section_text:
         # Fallback for legacy format
        return _legacy_extract_list(text, ['recommend', 'suggest', 'should', 'implement', 'consider'])

    items = []
    raw_items = re.split(r'\n(?:\s*[-*]|\s*\d+\.)\s+', '\n' + section_text)
    
    for item in raw_items:
        clean_item = item.strip()
        if clean_item and not clean_item.lower().startswith("recommendations"):
            items.append(clean_item)
            
    return items[:15]


def _legacy_extract_list(text: str, keywords: List[str]) -> List[str]:
    """Legacy line-based extraction (fallback)"""
    items = []
    lines = text.split('\n')
    for line in lines:
        if any(keyword in line.lower() for keyword in keywords):
            if line.strip():
                items.append(line.strip())
    return items[:10]


def extract_risk_score(text: str) -> float:
    """Extract risk score from analysis text"""
    # Look for explicit "Risk Score: X" pattern first
    score_pattern = r'Risk Score:\s*(\d+(?:\.\d+)?)'
    match = re.search(score_pattern, text, re.IGNORECASE)
    if match:
        return float(match.group(1))
    
    # Fallback to searching for just the number near "Risk Score"
    # or existing keyword logic
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

