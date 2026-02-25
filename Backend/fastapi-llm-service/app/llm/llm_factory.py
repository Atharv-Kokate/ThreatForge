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
    if p == "google":
        try:
            from langchain_google_genai import ChatGoogleGenerativeAI
        except Exception:
            return None
        key = os.getenv("GOOGLE_API_KEY")
        if not key:
            return None
        target_model = model or "gemini-1.5-flash"
        if target_model == "gemini-1.5-pro":
            target_model = "gemini-1.5-pro-latest"
        elif target_model == "gemini-1.5-flash":
            target_model = "gemini-1.5-flash-latest"
        return ChatGoogleGenerativeAI(google_api_key=key, model=target_model, convert_system_message_to_human=True)
    return None
