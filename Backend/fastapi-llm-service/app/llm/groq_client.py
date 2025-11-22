"""
Groq LLM client initialization and management
"""

import os
from typing import Optional
from langchain_groq import ChatGroq
from dotenv import load_dotenv
from app.utils.logger import logger

load_dotenv()

# Global LLM instance
llm: Optional[ChatGroq] = None


def initialize_llm() -> Optional[ChatGroq]:
    """
    Initialize Groq LLM client at startup
    Returns the LLM instance or None if initialization fails
    """
    global llm
    groq_api_key = os.environ.get("GROQ_API_KEY")
    
    if not groq_api_key:
        logger.warning("GROQ_API_KEY not set; LLM features will be disabled until set.")
        return None
    
    try:
        llm = ChatGroq(
            groq_api_key=groq_api_key,
            model_name="llama-3.1-8b-instant"
        )
        logger.info("Groq LLM initialized successfully with llama-3.1-8b-instant")
        return llm
    except Exception as e:
        logger.warning(f"Failed to initialize llama-3.1-8b-instant, trying mixtral-8x7b: {str(e)}")
        try:
            llm = ChatGroq(
                groq_api_key=groq_api_key,
                model_name="mixtral-8x7b"
            )
            logger.info("Groq LLM initialized successfully with mixtral-8x7b")
            return llm
        except Exception as e2:
            logger.error(f"Failed to initialize Groq LLM: {str(e2)}")
            return None


def get_llm() -> Optional[ChatGroq]:
    """Get the initialized LLM instance"""
    return llm

