import os
from typing import Optional


def get_llm_client(provider: Optional[str] = None, model: Optional[str] = None):
    p = (provider or "groq").lower()
    if p == "groq":
        try:
            from langchain_groq import ChatGroq
        except Exception:
            return None
        key = os.getenv("GROQ_API_KEY")
        if not key:
            return None
        return ChatGroq(groq_api_key=key, model_name=model or "llama-3.1-8b-instant")
    if p == "openai":
        try:
            from langchain_openai import ChatOpenAI
        except Exception:
            return None
        key = os.getenv("OPENAI_API_KEY")
        if not key:
            return None
        return ChatOpenAI(api_key=key, model=model or "gpt-4o-mini")
    if p == "anthropic":
        try:
            from langchain_anthropic import ChatAnthropic
        except Exception:
            return None
        key = os.getenv("ANTHROPIC_API_KEY")
        if not key:
            return None
        return ChatAnthropic(api_key=key, model=model or "claude-3-5-sonnet-20241022")
    return None
