# Quick Start Guide - Testing the Updated Frontend

## Prerequisites
- Backend running on `http://localhost:8000`
- Node.js installed
- Git repository cloned

## Step 1: Start the Backend (if not running)
```bash
cd Backend/fastapi-llm-service
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
python main.py
```

Backend should be running on: http://localhost:8000

## Step 2: Install Frontend Dependencies
```bash
cd Frontend
npm install
```

## Step 3: Start the Frontend Dev Server
```bash
npm run dev
```

Frontend will start on: http://localhost:5175

## Step 4: Test the Application

### 1. Register a New Account
- Navigate to http://localhost:5175
- You'll be redirected to /login
- Click "Register" or navigate to /register
- Fill in username, email, password
- Submit and login

### 2. View Dashboard
- After login, you'll see the Dashboard
- **Metrics Cards**: Shows total assessments, critical/high count, low count, info count
- **History Table**: Shows past assessments (empty if first time)
- Click "🔍 New Assessment" button

### 3. Create a New Assessment
Fill out the comprehensive form with ALL sections:

**Product Information** (Required):
- Product Name: e.g., "AI Chatbot"
- Description: Brief description of your system
- Category: Select from dropdown
- Technology: e.g., "Python, FastAPI, OpenAI"
- Version: e.g., "1.0.0"

**LLM Model Configuration**:
- Provider: Select (Groq, OpenAI, Anthropic)
- Model: Select from available models

**Application Context** (All Required):
- System Type: Select type (LLM Chatbot, etc.)
- Domain: Select domain (Healthcare, Finance, etc.)
- Criticality Level: Select level

**Data Handling**:
- Check data sources (user-input, apis, databases, etc.)
- Check sensitive data types if applicable
- Toggle sanitization checkbox

**Model Details** (All Required):
- Model Type: Select type
- Maintenance: Select maintenance approach
- Model Visibility: Select visibility level

**System Architecture**:
- Deployment: Select deployment type (Required)
- Access Methods: Check all that apply (Required)
- Integrations: Check all that apply

**Interaction Control**:
- User Inputs: Check all that apply (Required)
- Output Consumption: Check all that apply (Required)
- Toggle prompt guardrails checkbox

**Security Practices**:
- Authentication Methods: Check all that apply (Required)
- Logging Practices: Select from dropdown (Required)
- Toggle encryption checkbox

**Threat Surface**:
- Toggle multi-tenant checkbox
- Toggle external query checkbox
- Toggle adversarial protection checkbox

**Compliance & Governance**:
- Check applicable frameworks (GDPR, HIPAA, etc.)
- Toggle explainability checkbox
- Toggle retention policies checkbox

Click **"🔍 Analyze System"** button

### 4. View Results
After analysis completes (10-30 seconds):
- **Metrics Cards**: Risk Level, Risk Score, Confidence displayed
- **Summary**: Brief overview of findings
- **Vulnerabilities**: Color-coded warning cards (yellow)
- **Recommendations**: Color-coded info cards (blue)
- **Full LLM Analysis**: Collapsible section with complete analysis text

Options:
- Click "New Assessment" to create another
- Click "Back to Dashboard" to return

### 5. View Report from Dashboard
- Return to Dashboard
- History table shows the new assessment
- Click "View Report" on any row
- See detailed report with:
  - Large metric cards
  - Summary with model info
  - Vulnerabilities list
  - Recommendations list
  - Full analysis (toggle to show/hide)
  - Knowledge sources (if available)
- Click "📄 Download PDF" to export
- Click "🔍 New Assessment" to create another

## Expected Behavior

### Form Validation
- Product name and description are required
- Application Context fields are required
- At least one data source must be selected
- At least one access method must be selected
- At least one input and output type must be selected
- At least one auth method must be selected
- Logging practice must be selected

### Error Handling
- If backend returns error, actual error message displays in red box
- If network fails, connection error shown
- If token expires, redirected to login

### Loading States
- "Analyzing..." button text during submission
- "Loading assessments..." message in dashboard
- "Loading..." message in report view

### Risk Level Color Coding
- **Critical**: Red badge
- **High**: Orange badge
- **Medium/Moderate**: Yellow badge
- **Low**: Green badge
- **Info/Informational**: Blue badge
- **Unknown**: Gray badge

## Troubleshooting

### CORS Error
If you see CORS errors:
1. Check backend is running on port 8000
2. Verify `.env` has: `ALLOWED_ORIGINS=http://localhost:5175`
3. Restart backend after env changes

### "Server error" Message
- Check browser console for actual error
- Verify backend logs for Python errors
- Check that GROQ_API_KEY and TAVILY_API_KEY are set in backend .env

### Form Doesn't Submit
- Open browser console (F12)
- Check for validation errors (red required field indicators)
- Verify all required fields are filled
- Check network tab for failed API calls

### Models Not Loading
- Verify `/analysis/models` endpoint returns data
- Check browser console for errors
- Ensure backend is running and accessible

### PDF Export Issues
- jsPDF dependency should be installed: `npm install jspdf`
- Check browser console for PDF generation errors
- Try with smaller datasets if PDF fails

### Authentication Issues
- Clear localStorage: Open console and run `localStorage.clear()`
- Register a new account
- Verify JWT token is stored: `localStorage.getItem('token')`

## API Endpoints Used

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/auth/register` | POST | Create new user account |
| `/auth/login` | POST | Login and get JWT token |
| `/auth/profile` | GET | Get current user info |
| `/analysis/models` | GET | List available LLM providers |
| `/analysis/analyze_rag` | POST | Run RAG-powered analysis |
| `/analysis/status/{id}` | GET | Get assessment by ID |
| `/history` | GET | Get assessment history |

## Sample Test Data

Quick fill for testing:

**Product**:
- Name: "Customer Support AI"
- Description: "AI-powered customer support chatbot using GPT-4"
- Category: "chatbot"
- Technology: "Python, FastAPI, OpenAI GPT-4"
- Version: "1.0.0"

**Application Context**:
- System Type: "llm-chatbot"
- Domain: "customer-support"
- Criticality: "high-impact"

**Data Handling**:
- Sources: user-input, databases
- Sensitive: pii
- Sanitize: true

**Model Details**:
- Type: "foundation-api"
- Maintenance: "managed"
- Visibility: "black-box"

**System Architecture**:
- Deployment: "cloud"
- Access: web-ui, public-api
- Integrations: external-apis, databases

**Interaction Control**:
- Inputs: free-text
- Outputs: end-user-display
- Guardrails: true

**Security Practices**:
- Auth: oauth2, mfa
- Logging: "masked"
- Encryption: true

**Threat Surface**:
- Multi-tenant: true
- External query: true
- Adversarial protection: true

**Compliance**:
- Frameworks: gdpr, soc2
- Explainability: true
- Retention: true

## Success Criteria

✅ User can register and login  
✅ Dashboard displays metrics and history  
✅ Assessment form collects all required fields  
✅ Form validates required fields  
✅ Model selection works  
✅ Analysis completes and shows results  
✅ Report view displays detailed assessment  
✅ PDF export generates file  
✅ History table shows past assessments  
✅ Navigation works between all pages  
✅ Logout clears token and redirects  

## Notes

- First analysis may take 30+ seconds due to RAG processing
- Backend must have GROQ_API_KEY configured
- Frontend uses port 5175 by default (Vite)
- All data is stored in PostgreSQL via backend
- JWT tokens stored in browser localStorage
