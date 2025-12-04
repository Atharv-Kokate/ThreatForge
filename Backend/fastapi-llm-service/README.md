# FastAPI LLM Service for OWASP Risk Analysis

This FastAPI service uses Groq LLM with LangChain to provide intelligent risk assessment for AI/ML systems. The backend is built with a modular, scalable architecture including PostgreSQL database, JWT authentication, and comprehensive API routes.

## 🚀 Features

- **Groq LLM Integration**: Uses Llama 3 and Mixtral models via Groq API
- **LangChain Framework**: Structured prompts and response handling
- **Comprehensive Risk Analysis**: Multi-dimensional security assessment
- **Structured Output**: JSON responses with risk scores and recommendations
- **Async Processing**: Fast, non-blocking analysis
- **CORS Support**: Ready for frontend integration
- **PostgreSQL Database**: Persistent storage with SQLAlchemy ORM
- **JWT Authentication**: Secure user authentication and authorization
- **Modular Architecture**: Clean, scalable codebase structure

## 📁 Project Structure

```
backend/
├── app/
│   ├── main.py                 # FastAPI app bootstrap
│   ├── routes/
│   │   ├── analyze.py          # Risk analysis endpoints
│   │   └── status.py           # Analysis status endpoints
│   ├── schemas/
│   │   ├── analysis_request.py # Request validation schemas
│   │   └── analysis_response.py # Response schemas
│   ├── llm/
│   │   ├── prompt_templates.py # LLM prompt templates
│   │   ├── parser.py           # Response parsing utilities
│   │   └── groq_client.py      # Groq LLM client
│   ├── auth/
│   │   ├── models.py           # Auth Pydantic models
│   │   ├── routes.py           # Login & register endpoints
│   │   └── utils.py            # JWT, password hashing utilities
│   ├── database/
│   │   ├── session.py          # SQLAlchemy session & engine
│   │   └── models.py           # Database models (User, RiskAssessment)
│   └── utils/
│       └── logger.py            # Logging configuration
├── alembic/                     # Database migrations
├── requirements.txt
├── env.example
└── README.md
```

## 🛠️ Setup

### Prerequisites

- Python 3.8+
- PostgreSQL 12+ (for production)
- Groq API key

### Installation

1. **Navigate to the service directory:**
   ```bash
   cd Backend/fastapi-llm-service
   ```

2. **Create virtual environment:**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables:**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` with your configuration:
   ```env
   GROQ_API_KEY=your-actual-groq-api-key
   DATABASE_URL=postgresql://postgres:postgres@localhost:5432/owasp_risks
   SECRET_KEY=your-secret-key-change-in-production-use-a-long-random-string
   ```

5. **Set up PostgreSQL database:**
   
   Create a PostgreSQL database:
   ```sql
   CREATE DATABASE owasp_risks;
   ```
   
   Or using psql command line:
   ```bash
   createdb owasp_risks
   ```

6. **Run database migrations:**
   ```bash
   # Initialize Alembic (if not already done)
   alembic init alembic
   
   # Create initial migration
   alembic revision --autogenerate -m "Initial migration"
   
   # Apply migrations
   alembic upgrade head
   ```

7. **Start the service:**
   ```bash
   # Using Python
   python -m app.main
   
   # Or with uvicorn directly
   uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
   ```

## 📡 API Endpoints

### Authentication

#### Register User
```bash
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "username": "username",
  "password": "securepassword",
  "full_name": "John Doe"
}
```

#### Login
```bash
POST /auth/login
Content-Type: application/x-www-form-urlencoded

username=user@example.com
password=securepassword
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

### Risk Analysis (Protected)

#### Analyze System
```bash
POST /analysis/analyze
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "product": {
    "name": "AI Chatbot",
    "description": "Customer service chatbot",
    "category": "web-application",
    "technology": "Python, FastAPI, OpenAI",
    "version": "1.0.0"
  },
  "questionnaire": {
    "applicationContext": {
      "systemType": "llm-chatbot",
      "domain": "finance",
      "criticality": "business-critical"
    },
    "dataHandling": {
      "sources": ["user-input", "apis"],
      "containsSensitive": ["pii", "financial"],
      "sanitizeBeforeModelUse": true
    },
    "modelDetails": {
      "modelType": "foundation-api",
      "maintenance": "periodic",
      "visibility": "black-box"
    },
    "systemArchitecture": {
      "deployment": "cloud",
      "access": ["public-api", "web-ui"],
      "integrations": ["external-apis"]
    },
    "interactionControl": {
      "inputs": ["free-text", "structured"],
      "outputs": ["end-user-display"],
      "promptGuardrails": true
    },
    "securityPractices": {
      "auth": ["rbac", "oauth"],
      "logging": "masked",
      "encryption": true
    },
    "threatSurface": {
      "multiTenant": true,
      "externalQuery": true,
      "adversarialProtection": true
    },
    "complianceGovernance": {
      "frameworks": ["gdpr", "soc2"],
      "explainability": true,
      "retentionPolicies": true
    }
  }
}
```

**Response:**
```json
{
  "success": true,
  "summary": "Risk analysis summary...",
  "vulnerabilities": ["Vulnerability 1", "Vulnerability 2"],
  "recommendations": ["Recommendation 1", "Recommendation 2"],
  "riskScore": 7.5,
  "riskLevel": "high",
  "processingTime": 2500,
  "model": "llama-3.1-8b-instant",
  "confidence": 0.85,
  "requestId": "uuid-here",
  "timestamp": "2025-10-21T06:00:00Z"
}
```

#### Get Analysis Status
```bash
GET /analysis/status/{request_id}
Authorization: Bearer <access_token>
```

#### Get Available Models
```bash
GET /analysis/models
```

### Health Check
```bash
GET /
GET /health
```

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication. To access protected endpoints:

1. Register a user via `/auth/register`
2. Login via `/auth/login` to get an access token
3. Include the token in the `Authorization` header:
   ```
   Authorization: Bearer <your-access-token>
   ```

Tokens expire after 30 days by default (configurable via `ACCESS_TOKEN_EXPIRE_MINUTES`).

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `GROQ_API_KEY` | Groq API key | - | Yes |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://postgres:postgres@localhost:5432/owasp_risks` | Yes |
| `SECRET_KEY` | JWT secret key | - | Yes |
| `HOST` | Server host | `0.0.0.0` | No |
| `PORT` | Server port | `8000` | No |
| `ALLOWED_ORIGINS` | CORS allowed origins (comma-separated) | `*` | No |
| `LOG_LEVEL` | Logging level | `INFO` | No |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | JWT token expiration (minutes) | `43200` (30 days) | No |
| `TAVILY_API_KEY` | Tavily web search API key | - | No |
| `TAVILY_ENDPOINT` | Tavily search endpoint | `https://api.tavily.ai/v1/search` | No |

### Database Models

#### User
- `id` (UUID): Primary key
- `email` (String): Unique email address
- `username` (String): Unique username
- `hashed_password` (String): Bcrypt hashed password
- `full_name` (String, optional): User's full name
- `is_active` (String): Account status ("true" or "false")
- `created_at` (DateTime): Account creation timestamp
- `updated_at` (DateTime): Last update timestamp

#### RiskAssessment
- `id` (UUID): Primary key
- `user_id` (UUID, optional): Foreign key to User
- `input_data` (JSONB): Analysis request data
- `output_data` (JSONB): Analysis response data
- `created_at` (DateTime): Analysis creation timestamp
- `updated_at` (DateTime): Last update timestamp

## 🗄️ Database Migrations

### Creating a Migration

```bash
# Auto-generate migration from model changes
alembic revision --autogenerate -m "Description of changes"

# Create empty migration
alembic revision -m "Description of changes"
```

### Applying Migrations

```bash
# Apply all pending migrations
alembic upgrade head

# Rollback last migration
alembic downgrade -1

# Apply specific migration
alembic upgrade <revision_id>
```

### Migration History

```bash
# View migration history
alembic history

# View current revision
alembic current
```

## 🧪 Testing

### Using curl:

#### Register a user:
```bash
curl -X POST "http://localhost:8000/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "username": "testuser",
    "password": "testpassword123",
    "full_name": "Test User"
  }'
```

#### Login:
```bash
curl -X POST "http://localhost:8000/auth/login" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=test@example.com&password=testpassword123"
```

#### Analyze (with token):
```bash
curl -X POST "http://localhost:8000/analysis/analyze" \
  -H "Authorization: Bearer <your-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "product": {
      "name": "Test System",
      "description": "Test AI system"
    },
    "questionnaire": {
      "applicationContext": {
        "systemType": "llm-chatbot",
        "domain": "general-purpose",
        "criticality": "experimental-internal"
      },
      "dataHandling": {
        "sources": ["user-input"],
        "containsSensitive": [],
        "sanitizeBeforeModelUse": true
      },
      "modelDetails": {
        "modelType": "foundation-api",
        "maintenance": "static",
        "visibility": "black-box"
      },
      "systemArchitecture": {
        "deployment": "cloud",
        "access": ["web-ui"],
        "integrations": []
      },
      "interactionControl": {
        "inputs": ["free-text"],
        "outputs": ["end-user-display"],
        "promptGuardrails": false
      },
      "securityPractices": {
        "auth": ["basic"],
        "logging": "none",
        "encryption": false
      },
      "threatSurface": {
        "multiTenant": false,
        "externalQuery": true,
        "adversarialProtection": false
      },
      "complianceGovernance": {
        "frameworks": [],
        "explainability": false,
        "retentionPolicies": false
      }
    }
  }'
```

## 🐛 Troubleshooting

### Database Connection Issues

If you see database connection errors:
1. Ensure PostgreSQL is running
2. Verify `DATABASE_URL` in `.env` is correct
3. Check database exists: `psql -l | grep owasp_risks`

### LLM Service Not Available

If you see "LLM service not available":
1. Check `GROQ_API_KEY` is set in `.env`
2. Verify the API key is valid
3. Check network connectivity

### Migration Errors

If migrations fail:
1. Ensure database exists
2. Check `DATABASE_URL` is correct
3. Verify all model imports are correct in `alembic/env.py`

### JWT Token Issues

If authentication fails:
1. Verify `SECRET_KEY` is set in `.env`
2. Check token hasn't expired
3. Ensure token is included in `Authorization` header with `Bearer ` prefix

## 🚀 Production Deployment

For production deployment:

1. **Use environment variables** for all configuration
2. **Set a strong SECRET_KEY** (use `openssl rand -hex 32`)
3. **Use a production database** (managed PostgreSQL service)
4. **Implement proper logging** and monitoring
5. **Add rate limiting** and request validation
6. **Use a production ASGI server** like Gunicorn with Uvicorn workers
7. **Enable HTTPS** with proper SSL certificates
8. **Set up database backups**
9. **Configure CORS** properly (don't use `*` in production)

### Running with Gunicorn

```bash
gunicorn app.main:app \
  --workers 4 \
  --worker-class uvicorn.workers.UvicornWorker \
  --bind 0.0.0.0:8000
```

## 📊 Risk Analysis Framework

The service analyzes systems across multiple dimensions:

1. **Data Security**: PII/PHI exposure, data breaches
2. **Model Security**: Adversarial attacks, prompt injection
3. **Infrastructure**: Deployment vulnerabilities, access control
4. **Compliance**: Regulatory violations, audit failures
5. **Operational**: System failures, misuse, monitoring gaps

## 🔎 RAG (Retrieval-Augmented Generation) Integration

This repository includes a minimal RAG proof-of-concept to combine local knowledge (FAISS) with web search (Tavily).

- Files: `app/llm/ingest.py`, `app/llm/retriever.py`, `app/llm/web_search.py`, `app/routes/rag.py`
- Env: set `TAVILY_API_KEY` and optionally `TAVILY_ENDPOINT` in `.env` to enable web search
- Index path: `app/llm/_faiss/index.faiss` and metadata at `app/llm/_faiss/metadata.json`

Quick dev steps:

1. Install extra deps: `pip install sentence-transformers faiss-cpu requests`
2. Ingest text via `ingest_document(doc_id, text, metadata)` (function in `app/llm/ingest.py`).
3. Start the server and call `POST /analysis/analyze_rag` with an authenticated request.

Notes:
- The FAISS usage here is a POC: for production use Qdrant/Pinecone/Weaviate and persist robust id↔vector mappings.
- The Tavily adapter normalizes responses; adapt if your Tavily plan returns a different JSON shape.
- Keep privacy considerations in mind: redact PII before sending to external services.

## 📝 License

MIT License
