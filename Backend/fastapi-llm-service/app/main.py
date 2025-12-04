"""
FastAPI application bootstrap
OWASP Risk Analysis Platform - Backend
"""

import os
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.openapi.utils import get_openapi
from dotenv import load_dotenv

from app.routes import analyze, status, rag, kb, ingest
from app.auth import routes as auth_routes
from app.llm.groq_client import initialize_llm
from app.database.session import init_db
from app.utils.logger import logger

# DEBUG mode: set environment variable DEBUG=true to enable detailed error responses
DEBUG = os.getenv("DEBUG", "false").lower() in ("1", "true", "yes")

# Load environment variables
load_dotenv()

# Initialize FastAPI app
app = FastAPI(
    title="OWASP Risk Analysis LLM Service",
    description="AI-powered risk assessment using Groq LLM",
    version="1.0.0"
)


def custom_openapi():
    """Custom OpenAPI schema with Bearer token authentication"""
    if app.openapi_schema:
        return app.openapi_schema
    
    openapi_schema = get_openapi(
        title=app.title,
        version=app.version,
        description=app.description,
        routes=app.routes,
    )
    
    # Add Bearer token authentication to OpenAPI schema
    openapi_schema.setdefault("components", {})
    openapi_schema["components"].setdefault("securitySchemes", {})
    openapi_schema["components"]["securitySchemes"]["Bearer"] = {
        "type": "http",
        "scheme": "bearer",
        "bearerFormat": "JWT",
        "description": "Enter JWT token obtained from /auth/login endpoint. Format: Bearer <token> or just <token>"
    }

    # Add a global security requirement so Swagger UI shows the Authorize dialog
    openapi_schema.setdefault("security", [])
    # Only add if not already present
    if {"Bearer": []} not in openapi_schema["security"]:
        openapi_schema["security"].append({"Bearer": []})
    
    app.openapi_schema = openapi_schema
    return app.openapi_schema


app.openapi = custom_openapi

# CORS middleware
allowed_origins = os.getenv(
    "ALLOWED_ORIGINS",
    "*"
).split(",") if os.getenv("ALLOWED_ORIGINS") != "*" else ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Log unhandled exceptions and return a JSON error. In DEBUG mode include exception text."""
    logger.exception("Unhandled exception while handling request %s %s: %s", request.method, request.url, exc)
    if DEBUG:
        return JSONResponse(status_code=500, content={"detail": str(exc)})
    return JSONResponse(status_code=500, content={"detail": "Internal Server Error"})

# Include routers
app.include_router(auth_routes.router)
app.include_router(analyze.router)
app.include_router(status.router)
app.include_router(rag.router)
app.include_router(kb.router)
app.include_router(ingest.router)


@app.on_event("startup")
async def startup_event():
    """Initialize services on startup"""
    logger.info("Starting up OWASP Risk Analysis Service...")
    
    # Initialize database
    try:
        init_db()
        logger.info("Database initialized successfully")
    except Exception as e:
        logger.error(f"Database initialization failed: {str(e)}")
        # Continue startup even if DB fails (for development)
    
    # Initialize LLM
    llm = initialize_llm()
    if llm:
        logger.info("LLM service initialized successfully")
    else:
        logger.warning("LLM service not available - GROQ_API_KEY may be missing")


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "OWASP Risk Analysis LLM Service",
        "version": "1.0.0",
        "status": "operational"
    }


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "OWASP Risk Analysis LLM Service"
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

