<p align="center">
  <img src="https://img.shields.io/badge/🔥-ThreatForge-FF4500?style=for-the-badge&labelColor=1a1a2e" alt="ThreatForge" height="60"/>
</p>

<h1 align="center">⚔️ ThreatForge</h1>

<p align="center">
  <strong>AI-Powered Security Risk Assessment for LLM & AI/ML Systems</strong>
</p>

<p align="center">
  <em>Identify vulnerabilities. Quantify risks. Fortify your AI systems.</em>
</p>

<p align="center">
  <a href="#-features"><img src="https://img.shields.io/badge/Features-8A2BE2?style=for-the-badge" alt="Features"/></a>
  <a href="#-tech-stack"><img src="https://img.shields.io/badge/Tech_Stack-00D4AA?style=for-the-badge" alt="Tech Stack"/></a>
  <a href="#-quick-start"><img src="https://img.shields.io/badge/Quick_Start-FF6B35?style=for-the-badge" alt="Quick Start"/></a>
  <a href="#-api-reference"><img src="https://img.shields.io/badge/API_Docs-0078D4?style=for-the-badge" alt="API Docs"/></a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Python-3.10+-3776AB?style=flat-square&logo=python&logoColor=white" alt="Python"/>
  <img src="https://img.shields.io/badge/FastAPI-0.104-009688?style=flat-square&logo=fastapi&logoColor=white" alt="FastAPI"/>
  <img src="https://img.shields.io/badge/React-18.2-61DAFB?style=flat-square&logo=react&logoColor=black" alt="React"/>
  <img src="https://img.shields.io/badge/LangChain-0.3-1C3C3C?style=flat-square&logo=langchain&logoColor=white" alt="LangChain"/>
  <img src="https://img.shields.io/badge/OWASP-Top_10_LLM-000000?style=flat-square&logo=owasp&logoColor=white" alt="OWASP"/>
  <img src="https://img.shields.io/badge/License-MIT-green?style=flat-square" alt="License"/>
</p>

---

## 🎯 What is ThreatForge?

**ThreatForge** is a full-stack security assessment platform that leverages **Retrieval-Augmented Generation (RAG)** and multiple LLM providers to perform comprehensive risk analysis of AI/ML systems against the **OWASP Top 10 for LLM Applications**.

It combines a curated knowledge base with real-time web intelligence to deliver contextual, evidence-backed vulnerability reports — complete with risk scoring, actionable recommendations, and source provenance.

```
┌─────────────────────────────────────────────────────────────────┐
│                        ThreatForge                              │
│                                                                 │
│   ┌──────────┐    ┌──────────────┐    ┌────────────────────┐   │
│   │  React    │───▶│  FastAPI      │───▶│  LLM Engine        │   │
│   │  Frontend │◀───│  Backend      │◀───│  (Multi-Provider)  │   │
│   └──────────┘    └──────┬───────┘    └────────┬───────────┘   │
│                          │                     │               │
│                   ┌──────▼───────┐    ┌────────▼───────────┐   │
│                   │  PostgreSQL  │    │  RAG Pipeline       │   │
│                   │  + Auth/JWT  │    │  FAISS + Web Search │   │
│                   └──────────────┘    └────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

---

## ✨ Features

### 🛡️ Intelligent Risk Assessment
| Feature | Description |
|---------|-------------|
| **OWASP Top 10 LLM Coverage** | Full coverage of all OWASP Top 10 risks for LLM applications |
| **RAG-Powered Analysis** | Combines knowledge base retrieval with real-time web search for context-rich assessments |
| **Multi-LLM Support** | Seamlessly switch between **Groq**, **OpenAI**, **Anthropic**, and **Google Gemini** |
| **9-Step Questionnaire** | Comprehensive intake covering product info, data handling, architecture, threats & compliance |
| **Quantified Risk Scoring** | 0-10 risk scale with severity classification (Low → Critical) |
| **Source Provenance** | Every finding is traced back to KB documents or web sources |

### 📊 Analytics Dashboard
| Feature | Description |
|---------|-------------|
| **Real-time Metrics** | Total assessments, critical findings %, average risk scores |
| **Severity Distribution** | Visual breakdown of risk levels across all assessments |
| **Risk Trend Charts** | Track risk posture over time with interactive Recharts visualizations |
| **Assessment History** | Searchable, filterable history with one-click report access |

### 🔐 Enterprise-Ready Security
| Feature | Description |
|---------|-------------|
| **JWT Authentication** | Secure token-based auth with configurable expiry |
| **User Management** | Registration, login, and protected route system |
| **PostgreSQL Backend** | Reliable, ACID-compliant data persistence |
| **PDF Export** | Download detailed risk reports for offline consumption |

---

## 🏗️ Tech Stack

<table>
<tr>
<td align="center" width="50%">

### 🖥️ Frontend
| Technology | Purpose |
|:----------:|:--------|
| <img src="https://img.shields.io/badge/-React_18-61DAFB?style=flat-square&logo=react&logoColor=black" /> | UI Framework |
| <img src="https://img.shields.io/badge/-Vite_5-646CFF?style=flat-square&logo=vite&logoColor=white" /> | Build Tool |
| <img src="https://img.shields.io/badge/-React_Router_6-CA4245?style=flat-square&logo=reactrouter&logoColor=white" /> | Client Routing |
| <img src="https://img.shields.io/badge/-Recharts-22B5BF?style=flat-square" /> | Data Visualization |
| <img src="https://img.shields.io/badge/-Lucide-F56565?style=flat-square" /> | Icon System |
| <img src="https://img.shields.io/badge/-jsPDF-red?style=flat-square" /> | PDF Generation |

</td>
<td align="center" width="50%">

### ⚙️ Backend
| Technology | Purpose |
|:----------:|:--------|
| <img src="https://img.shields.io/badge/-FastAPI-009688?style=flat-square&logo=fastapi&logoColor=white" /> | API Framework |
| <img src="https://img.shields.io/badge/-LangChain-1C3C3C?style=flat-square&logo=langchain&logoColor=white" /> | LLM Orchestration |
| <img src="https://img.shields.io/badge/-FAISS-0467DF?style=flat-square&logo=meta&logoColor=white" /> | Vector Search |
| <img src="https://img.shields.io/badge/-PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white" /> | Database |
| <img src="https://img.shields.io/badge/-SQLAlchemy-D71F00?style=flat-square" /> | ORM |
| <img src="https://img.shields.io/badge/-Alembic-6BA81E?style=flat-square" /> | Migrations |

</td>
</tr>
</table>

### 🤖 Supported LLM Providers

```
╭──────────────────────────────────────────────────────────────╮
│                    LLM Provider Matrix                       │
├──────────────┬───────────────────────┬───────────────────────┤
│   Provider   │    Default Model      │    Status             │
├──────────────┼───────────────────────┼───────────────────────┤
│  🟢 Groq     │  llama-3.1-8b-instant │  Primary (fastest)    │
│  🟢 OpenAI   │  gpt-4o-mini          │  Supported            │
│  🟢 Anthropic│  claude-3.5-sonnet    │  Supported            │
│  🟢 Google   │  gemini-1.5-flash     │  Supported            │
╰──────────────┴───────────────────────┴───────────────────────╯
```

---

## 🚀 Quick Start

### Prerequisites

- **Python 3.10+** — Backend runtime
- **Node.js 18+** — Frontend runtime
- **PostgreSQL** — Database (or use SQLite for development)
- **API Key** — At least one LLM provider (Groq recommended — free tier available)

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/Atharv-Kokate/ThreatForge.git
cd ThreatForge
```

### 2️⃣ Backend Setup

```bash
cd Backend/fastapi-llm-service

# Create virtual environment
python -m venv venv
source venv/bin/activate        # Linux/Mac
# venv\Scripts\activate         # Windows

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp env.example .env
# Edit .env with your API keys and database URL
```

**Required `.env` Configuration:**
```env
# LLM Provider (at least one required)
GROQ_API_KEY=your-groq-api-key

# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/owasp_risks

# Authentication
SECRET_KEY=your-secret-key-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=43200
```

```bash
# Start the backend server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### 3️⃣ Frontend Setup

```bash
cd Frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

### 4️⃣ Open the App

```
🌐 Frontend:  http://localhost:5173
📡 API Docs:  http://localhost:8000/docs
❤️ Health:    http://localhost:8000/health
```

---

## 📡 API Reference

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/auth/register` | Register a new user |
| `POST` | `/auth/login` | Login & receive JWT token |
| `GET`  | `/auth/me` | Get current user profile |

### Risk Analysis
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/analysis/analyze` | Standard LLM risk analysis |
| `POST` | `/analysis/analyze_rag` | **RAG-powered** risk analysis (recommended) |
| `GET`  | `/analysis/status/{id}` | Get assessment status & results |
| `GET`  | `/analysis/models` | List available LLM providers & models |

### Knowledge Base & History
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET`  | `/history` | Retrieve assessment history |
| `POST` | `/kb/ingest` | Ingest documents into knowledge base |
| `GET`  | `/kb/status` | Knowledge base health & stats |

> 📖 **Full interactive API documentation** available at `http://localhost:8000/docs` (Swagger UI)

---

## 🔄 How It Works

```
                          User Submits Assessment
                                   │
                                   ▼
                     ┌──────────────────────────┐
                     │   9-Step Questionnaire    │
                     │  ┌─────────────────────┐  │
                     │  │ Product Info         │  │
                     │  │ Application Context  │  │
                     │  │ Data Handling        │  │
                     │  │ Model Details        │  │
                     │  │ Architecture         │  │
                     │  │ Interaction Control  │  │
                     │  │ Security Practices   │  │
                     │  │ Threat Surface       │  │
                     │  │ Compliance           │  │
                     │  └─────────────────────┘  │
                     └─────────────┬────────────┘
                                   │
                                   ▼
              ┌────────────────────────────────────────┐
              │          RAG Retrieval Pipeline         │
              │                                        │
              │  ┌──────────┐      ┌───────────────┐   │
              │  │  FAISS   │      │  DuckDuckGo   │   │
              │  │  KB      │      │  Web Search   │   │
              │  │  Search  │      │               │   │
              │  └────┬─────┘      └──────┬────────┘   │
              │       │    Merge & Dedup   │           │
              │       └────────┬───────────┘           │
              │                │                       │
              └────────────────┼───────────────────────┘
                               │
                               ▼
              ┌────────────────────────────────────────┐
              │       LLM Analysis Engine              │
              │                                        │
              │  System Prompt (Security Expert)       │
              │  + Questionnaire Data                  │
              │  + Retrieved Context (KB + Web)        │
              │         │                              │
              │         ▼                              │
              │  ┌─────────────────────────────────┐   │
              │  │ Groq / OpenAI / Anthropic /     │   │
              │  │ Google Gemini                    │   │
              │  └────────────────┬────────────────┘   │
              └───────────────────┼────────────────────┘
                                  │
                                  ▼
              ┌────────────────────────────────────────┐
              │        Response Parser                 │
              │                                        │
              │   ✦ Executive Summary                  │
              │   ✦ Vulnerabilities (with evidence)    │
              │   ✦ Recommendations (actionable)       │
              │   ✦ Risk Score (0-10)                  │
              │   ✦ Source Provenance                  │
              └────────────────────────────────────────┘
```

---

## 📁 Project Structure

```
ThreatForge/
├── Backend/
│   └── fastapi-llm-service/
│       ├── app/
│       │   ├── auth/            # JWT authentication system
│       │   ├── database/        # SQLAlchemy models & session
│       │   ├── llm/             # LLM engine & RAG pipeline
│       │   │   ├── groq_client.py      # Groq LLM client
│       │   │   ├── model_registry.py   # Multi-provider registry
│       │   │   ├── retriever.py        # RAG retriever (FAISS + Web)
│       │   │   ├── prompt_templates.py # Expert system prompts
│       │   │   ├── parser.py           # Response parser
│       │   │   ├── ingest.py           # Document ingestion
│       │   │   ├── web_search.py       # DuckDuckGo integration
│       │   │   └── _faiss/             # Vector index storage
│       │   ├── routes/          # API route handlers
│       │   │   ├── analyze.py          # Standard analysis
│       │   │   ├── rag.py              # RAG-powered analysis
│       │   │   ├── history.py          # Assessment history
│       │   │   └── kb.py              # Knowledge base management
│       │   ├── schemas/         # Pydantic request/response models
│       │   └── utils/           # Logger & helpers
│       ├── alembic/             # Database migrations
│       ├── requirements.txt
│       └── Dockerfile
│
├── Frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Sidebar.jsx             # App navigation
│   │   │   ├── Navbar.jsx              # Top bar
│   │   │   ├── RiskCard.jsx            # Risk display cards
│   │   │   ├── SeverityBadge.jsx       # Color-coded badges
│   │   │   ├── MetricsCard.jsx         # Dashboard metrics
│   │   │   └── Chart/                  # Recharts visualizations
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx           # Analytics & history
│   │   │   ├── NewAssessment.jsx       # 9-step assessment wizard
│   │   │   ├── Report.jsx             # Detailed report view + PDF
│   │   │   ├── Login.jsx              # Authentication
│   │   │   └── Register.jsx           # User registration
│   │   ├── services/            # API client layer
│   │   ├── context/             # React auth context
│   │   └── utils/               # Formatters & helpers
│   ├── package.json
│   └── vite.config.js
│
├── ARCHITECTURE.md              # Detailed architecture docs
├── CHANGELOG.md                 # Version history
└── TESTING_GUIDE.md             # Testing instructions
```

---

## 🧪 Risk Assessment Categories

ThreatForge evaluates systems across **5 critical risk dimensions**:

```
  ┌─────────────────────────────────────────────────────────┐
  │                                                         │
  │  🔴  DATA SECURITY        PII/PHI exposure, breaches,  │
  │                           unauthorized data access      │
  │                                                         │
  │  🟠  MODEL SECURITY       Model poisoning, adversarial  │
  │                           attacks, prompt injection     │
  │                                                         │
  │  🟡  INFRASTRUCTURE       Deployment vulns, access      │
  │                           control, misconfigurations    │
  │                                                         │
  │  🔵  COMPLIANCE           Regulatory violations,        │
  │                           audit failures, governance    │
  │                                                         │
  │  🟣  OPERATIONAL          System failures, misuse,      │
  │                           monitoring gaps               │
  │                                                         │
  └─────────────────────────────────────────────────────────┘
```

### Risk Scoring Scale

| Score Range | Level | Badge | Action Required |
|:-----------:|:-----:|:-----:|:----------------|
| 0 – 2 | **Low** | 🟢 | Minimal concerns, routine monitoring |
| 3 – 5 | **Medium** | 🟡 | Some gaps, planned remediation |
| 6 – 7 | **High** | 🟠 | Significant issues, prioritize fixes |
| 8 – 10 | **Critical** | 🔴 | Severe vulnerabilities, immediate action |

---

## 🐳 Docker Deployment

```bash
cd Backend/fastapi-llm-service

# Build the image
docker build -t threatforge-api .

# Run with environment variables
docker run -p 8000:8000 \
  -e GROQ_API_KEY=your-key \
  -e DATABASE_URL=postgresql://user:pass@host:5432/db \
  -e SECRET_KEY=your-secret \
  threatforge-api
```

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Commit** your changes: `git commit -m 'Add amazing feature'`
4. **Push** to the branch: `git push origin feature/amazing-feature`
5. **Open** a Pull Request

---

## 📜 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<p align="center">
  <strong>Built with ❤️ for the security community</strong>
</p>

<p align="center">
  <a href="https://github.com/Atharv-Kokate/ThreatForge/issues">Report Bug</a>
  ·
  <a href="https://github.com/Atharv-Kokate/ThreatForge/issues">Request Feature</a>
  ·
  <a href="https://github.com/Atharv-Kokate/ThreatForge/stargazers">⭐ Star this repo</a>
</p>

<p align="center">
  <img src="https://img.shields.io/github/stars/Atharv-Kokate/ThreatForge?style=social" alt="Stars"/>
  <img src="https://img.shields.io/github/forks/Atharv-Kokate/ThreatForge?style=social" alt="Forks"/>
  <img src="https://img.shields.io/github/watchers/Atharv-Kokate/ThreatForge?style=social" alt="Watchers"/>
</p>
