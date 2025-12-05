# Frontend Architecture Overview

## Component Hierarchy

```
App.jsx (Root)
├── AuthProvider (Context)
├── Sidebar (Navigation)
└── Routes
    ├── /login → Login.jsx
    ├── /register → Register.jsx
    ├── /dashboard → Dashboard.jsx (Protected)
    ├── /new → NewAssessment.jsx (Protected)
    └── /report/:id → Report.jsx (Protected)
```

## Data Flow

### Authentication Flow
```
Login.jsx
  ↓ (submit credentials)
POST /auth/login
  ↓ (returns JWT)
localStorage.setItem('token')
  ↓
AuthContext.token updated
  ↓
Redirect to /dashboard
```

### Assessment Creation Flow
```
NewAssessment.jsx
  ↓ (user fills form)
Form State (product + 8 questionnaire sections)
  ↓ (submit)
POST /analysis/analyze_rag
  ↓ (RAG processing 10-30s)
AnalysisResponse received
  ↓
Display results inline OR
  ↓
Navigate to /report/:requestId
```

### Dashboard Flow
```
Dashboard.jsx
  ↓ (mount)
GET /history
  ↓ (returns assessments[])
Calculate metrics (total, critical, low, info)
  ↓
Render metrics cards + history table
  ↓ (user clicks "View Report")
Navigate to /report/:id
```

### Report View Flow
```
Report.jsx
  ↓ (mount with :id param)
GET /analysis/status/:id
  ↓ (returns assessment data)
Display metrics, vulnerabilities, recommendations
  ↓ (user clicks "Download PDF")
jsPDF.generate() → save PDF file
```

## State Management

### Global State (AuthContext)
```javascript
{
  token: string | null,          // JWT from localStorage
  user: object | null,            // User profile data
  login: (token) => void,         // Store token & update state
  logout: () => void,             // Clear token & redirect
  loading: boolean                // Auth initialization state
}
```

### NewAssessment State
```javascript
{
  loading: boolean,
  error: string,
  provider: string,               // LLM provider (groq, openai, etc.)
  model: string,                  // Specific model name
  availableModels: Provider[],    // From GET /analysis/models
  
  product: {
    name: string,
    description: string,
    category: string,
    technology: string,
    version: string
  },
  
  questionnaire: {
    applicationContext: { systemType, domain, criticality },
    dataHandling: { sources[], containsSensitive[], sanitizeBeforeModelUse },
    modelDetails: { modelType, maintenance, visibility },
    systemArchitecture: { deployment, access[], integrations[] },
    interactionControl: { inputs[], outputs[], promptGuardrails },
    securityPractices: { auth[], logging, encryption },
    threatSurface: { multiTenant, externalQuery, adversarialProtection },
    complianceGovernance: { frameworks[], explainability, retentionPolicies }
  },
  
  result: AnalysisResponse | null  // After submission
}
```

### Dashboard State
```javascript
{
  loading: boolean,
  history: Assessment[],           // From GET /history
  severityCounts: {
    critical: number,
    high: number,
    medium: number,
    low: number,
    info: number,
    unknown: number
  }
}
```

### Report State
```javascript
{
  loading: boolean,
  data: AnalysisResponse | null,   // From GET /analysis/status/:id
  showAnalysis: boolean            // Toggle for full analysis text
}
```

## API Service Layer

### api.js (Base Axios Instance)
```javascript
const api = axios.create({
  baseURL: 'http://localhost:8000',
  headers: { 'Content-Type': 'application/json' }
})

// Request interceptor: Add Bearer token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Response interceptor: Handle errors
api.interceptors.response.use(
  response => response,
  error => {
    // Display actual backend error or generic message
    throw new Error(error.response?.data?.detail || 'Server error')
  }
)
```

### auth.js
```javascript
export async function register(username, email, password)
export async function login(username, password)
export async function getProfile()
```

### analysis.js
```javascript
export async function listModels()              // GET /analysis/models
export async function analyzeRag(payload)       // POST /analysis/analyze_rag
export async function getStatus(requestId)      // GET /analysis/status/:id
```

### history.js
```javascript
export async function getHistory({ limit })     // GET /history
```

## Component Communication

### Parent → Child (Props)
```javascript
// App.jsx passes token check to Protected wrapper
<Protected>
  <Dashboard />
</Protected>

// No complex prop drilling needed due to Context API
```

### Child → Parent (Callbacks)
```javascript
// Not heavily used; most communication via navigation
// Example: NewAssessment → Dashboard via nav('/dashboard')
```

### Sibling Communication (Context)
```javascript
// Login.jsx sets token → AuthContext → Sidebar updates
Login.jsx: login(token)
  ↓
AuthContext.token = token
  ↓
Sidebar.jsx: useAuth() gets updated token
  ↓
Sidebar shows "Logout" button
```

## Form Validation Strategy

### Client-Side Validation
```javascript
// HTML5 required attribute
<input required value={product.name} />

// Custom validation (arrays must have items)
onSubmit = (e) => {
  e.preventDefault()
  if (q.dataHandling.sources.length === 0) {
    setError('Select at least one data source')
    return
  }
  // ... submit
}
```

### Backend Validation
```python
# Pydantic models validate on API side
# Errors returned as 422 Unprocessable Entity
# Frontend displays actual error message
```

## Styling Approach

### CSS Structure
```
styles.css (Global)
├── Layout (.app, .sidebar, .content)
├── Components (.card, .btn, .badge)
├── Form (.form, input, select, textarea)
├── Table (.table)
├── Utilities (.row, .grid, .spacer)
└── States (.error, .success, .loading)
```

### Color Theming (Dark Mode)
```css
:root {
  --bg-primary: #0f172a;      /* Body background */
  --bg-secondary: #0b1220;    /* Card background */
  --bg-tertiary: #111827;     /* Sidebar background */
  --border: #1f2937;          /* Border color */
  --text-primary: #e5e7eb;    /* Primary text */
  --text-muted: #9ca3af;      /* Muted text */
  --accent: #2563eb;          /* Button/link color */
}
```

### Badge Color System
```css
.badge.critical → Red (#7f1d1d bg, #fee2e2 text)
.badge.high → Orange (#7c2d12 bg, #ffedd5 text)
.badge.medium → Yellow (#713f12 bg, #fde68a text)
.badge.low → Green (#064e3b bg, #d1fae5 text)
.badge.info → Blue (#1e3a8a bg, #bfdbfe text)
```

## Route Protection

### Protected HOC Pattern
```javascript
function Protected({ children }) {
  const { token } = useAuth()
  if (!token) return <Navigate to="/login" replace />
  return children
}

// Usage
<Route path="/dashboard" element={
  <Protected>
    <Dashboard />
  </Protected>
} />
```

### Token Persistence
```javascript
// Stored in localStorage (survives page refresh)
localStorage.setItem('token', jwt)
localStorage.getItem('token')
localStorage.removeItem('token')  // On logout
```

## Error Handling Strategy

### API Error Display
```javascript
try {
  const result = await analyzeRag(payload)
  setResult(result)
} catch (err) {
  setError(err.message || 'Analysis failed')  // Show to user
}
```

### Network Error Fallback
```javascript
// Axios interceptor catches network errors
// Displays "Server error. Please try again later."
// Unless backend provides specific error detail
```

### Form Validation Errors
```javascript
// HTML5 validation prevents submit
<input required />  // Browser shows error

// Custom validation shows in UI
{error && <div className="error">{error}</div>}
```

## Performance Considerations

### Lazy Loading (Future Enhancement)
```javascript
// Not yet implemented, but could be added:
const Dashboard = lazy(() => import('./pages/Dashboard.jsx'))
<Suspense fallback={<Loading />}>
  <Dashboard />
</Suspense>
```

### Memoization (Future Enhancement)
```javascript
// Not yet implemented, but useful for:
const memoizedMetrics = useMemo(() => 
  calculateMetrics(history), 
  [history]
)
```

### API Request Caching (Future Enhancement)
```javascript
// React Query would be ideal for caching /history calls
// Currently fetches on every Dashboard mount
```

## Security Features

### XSS Protection
```javascript
// React escapes by default
// No dangerouslySetInnerHTML used
```

### CSRF Protection
```javascript
// Not needed (JWT-based auth)
// No cookies used
```

### Token Storage
```javascript
// localStorage (vulnerable to XSS but acceptable for demo)
// Production should use httpOnly cookies
```

### Input Sanitization
```javascript
// Backend handles validation
// Frontend sends raw user input
// Pydantic models validate types and formats
```

## Responsive Design Notes

### Current State
- Optimized for desktop (1024px+)
- Form uses grid layouts (breaks down on mobile)
- Sidebar fixed width (240px)

### Mobile Improvements Needed
```css
@media (max-width: 768px) {
  .sidebar { display: none; }  /* Or hamburger menu */
  .form { grid-template-columns: 1fr; }
  .metrics { grid-template-columns: 1fr; }
}
```

## Accessibility Considerations

### Current Implementation
- Semantic HTML (nav, aside, main, form)
- Form labels properly associated
- Button roles implicit
- Color contrast meets AA (dark theme)

### Improvements Needed
- ARIA labels for icon buttons
- Focus management for modals
- Keyboard navigation for dropdowns
- Screen reader announcements for dynamic content

## Future Enhancements Architecture

### Real-time Updates
```javascript
// WebSocket connection for live analysis progress
const ws = new WebSocket('ws://localhost:8000/ws')
ws.onmessage = (event) => {
  setProgress(event.data.progress)  // 0-100%
}
```

### Comparison View
```javascript
// /compare?ids=123,456
// Load multiple assessments
// Display side-by-side diff
```

### Saved Templates
```javascript
// Store common configurations
localStorage.setItem('template-1', JSON.stringify(formData))
// Quick load on new assessment
```

### Advanced Filtering
```javascript
// /dashboard?risk=critical&domain=healthcare&from=2024-01-01
// Filter history by multiple criteria
// Persist filter state in URL params
```
