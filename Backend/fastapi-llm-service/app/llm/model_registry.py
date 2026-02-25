from typing import Optional
import os


def get_model(model_id: Optional[str] = None):
    provider = None
    name = None
    if model_id:
        parts = model_id.split(":", 1)
        if len(parts) == 2:
            provider, name = parts[0].lower(), parts[1]
        else:
            provider = model_id.lower()
    if not provider:
        provider = "groq"
        name = name or "llama-3.1-8b-instant"

    if provider == "groq":
        try:
            from langchain_groq import ChatGroq
        except Exception:
            return None
        api_key = os.getenv("GROQ_API_KEY")
        if not api_key:
            return None
        return ChatGroq(groq_api_key=api_key, model_name=name or "llama-3.1-8b-instant")

    if provider == "openai":
        try:
            from langchain_openai import ChatOpenAI
        except Exception:
            return None
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key:
            return None
        return ChatOpenAI(api_key=api_key, model=name or "gpt-4o-mini")

    if provider == "anthropic":
        try:
            from langchain_anthropic import ChatAnthropic
        except Exception:
            return None
        api_key = os.getenv("ANTHROPIC_API_KEY")
        if not api_key:
            return None
        return ChatAnthropic(api_key=api_key, model=name or "claude-3-5-sonnet-20241022")

    if provider == "google":
        try:
            from langchain_google_genai import ChatGoogleGenerativeAI
        except Exception:
            return None
        api_key = os.getenv("GOOGLE_API_KEY")
        if not api_key:
            return None
        target_model = name or "gemini-1.5-flash"
        if target_model == "gemini-1.5-pro":
            target_model = "gemini-1.5-pro-latest"
        elif target_model == "gemini-1.5-flash":
            target_model = "gemini-1.5-flash-latest"
        return ChatGoogleGenerativeAI(google_api_key=api_key, model=target_model, convert_system_message_to_human=True)

    return None
