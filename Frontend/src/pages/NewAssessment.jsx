import React, { useEffect, useState } from 'react'
import { analyzeRag, listModels } from '../services/analysis.js'
import { useNavigate } from 'react-router-dom'

export default function NewAssessment() {
  const nav = useNavigate()
  const [providers, setProviders] = useState([])
  const [provider, setProvider] = useState('groq')
  const [model, setModel] = useState('llama-3.1-8b-instant')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [product, setProduct] = useState({ name: '', description: '', category: '', technology: '', version: '' })
  const [q, setQ] = useState({
    applicationContext: { systemType: '', domain: '', criticality: '' },
    dataHandling: { sources: [], containsSensitive: [], sanitizeBeforeModelUse: true },
    modelDetails: { modelType: '', maintenance: '', visibility: '' },
    systemArchitecture: { deployment: '', access: [], integrations: [] },
    interactionControl: { inputs: [], outputs: [], promptGuardrails: false },
    securityPractices: { auth: [], logging: '', encryption: false },
    threatSurface: { multiTenant: false, externalQuery: false, adversarialProtection: false },
    complianceGovernance: { frameworks: [], explainability: false, retentionPolicies: false }
  })
  const [result, setResult] = useState(null)

  useEffect(() => {
    (async () => {
      try {
        const provs = await listModels()
        setProviders(provs)
        const groq = provs.find(p => p.provider === 'groq')
        if (groq) {
          setProvider('groq')
          setModel(groq.models[0]?.name || 'llama-3.1-8b-instant')
        }
      } catch (err) {
        console.error('Failed to load models:', err)
      }
    })()
  }, [])

  function provModels(p) {
    const pr = providers.find(x => x.provider === p)
    return pr?.models || []
  }

  function toggleArray(section, field, value) {
    setQ(prev => {
      const arr = [...prev[section][field]]
      const idx = arr.indexOf(value)
      if (idx > -1) arr.splice(idx, 1)
      else arr.push(value)
      return {...prev, [section]: {...prev[section], [field]: arr}}
    })
  }

  async function onSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const payload = {
        product,
        questionnaire: q,
        analysis: {},
        context: {},
        metadata: { model: `${provider}:${model}` }
      }
      const res = await analyzeRag(payload)
      setResult(res)
    } catch (err) {
      setError(err.message || 'Analysis failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid">
      <div className="row space-between" style={{ alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ margin: 0 }}>New Risk Assessment</h2>
          <p style={{ margin: '4px 0 0 0', color: '#666', fontSize: '14px' }}>
            Comprehensive OWASP ML/LLM security analysis using RAG
          </p>
        </div>
        <button className="btn" style={{ background: '#ddd', color: '#333' }} onClick={() => nav('/dashboard')}>
          ← Cancel
        </button>
      </div>

      {error && <div style={{padding: '12px', background: '#fee', border: '1px solid #fcc', borderRadius: '4px', color: '#c33', marginBottom: '16px'}}>{error}</div>}

      <form onSubmit={onSubmit}>
        {/* Product Information */}
        <div className="card" style={{marginBottom: '16px'}}>
          <h3 style={{ marginTop: 0 }}>Product Information</h3>
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px'}}>
            <div>
              <label style={{display: 'block', marginBottom: '4px', fontWeight: 500}}>Product Name *</label>
              <input style={{width: '100%'}} required value={product.name} onChange={e => setProduct({...product, name: e.target.value})} placeholder="e.g., AI Chatbot" />
            </div>
            <div>
              <label style={{display: 'block', marginBottom: '4px', fontWeight: 500}}>Technology Stack</label>
              <input style={{width: '100%'}} value={product.technology} onChange={e => setProduct({...product, technology: e.target.value})} placeholder="e.g., Python, FastAPI, OpenAI" />
            </div>
          </div>
          <div style={{marginTop: '16px'}}>
            <label style={{display: 'block', marginBottom: '4px', fontWeight: 500}}>Description *</label>
            <textarea style={{width: '100%'}} required rows={3} value={product.description} onChange={e => setProduct({...product, description: e.target.value})} placeholder="Describe the system's purpose and functionality" />
          </div>
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '16px'}}>
            <div>
              <label style={{display: 'block', marginBottom: '4px', fontWeight: 500}}>Category</label>
              <select style={{width: '100%'}} value={product.category} onChange={e => setProduct({...product, category: e.target.value})}>
                <option value="">Select category</option>
                <option value="web-application">Web Application</option>
                <option value="mobile-app">Mobile App</option>
                <option value="api-service">API Service</option>
                <option value="chatbot">Chatbot</option>
                <option value="data-analytics">Data Analytics</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label style={{display: 'block', marginBottom: '4px', fontWeight: 500}}>Version</label>
              <input style={{width: '100%'}} value={product.version} onChange={e => setProduct({...product, version: e.target.value})} placeholder="e.g., 1.0.0" />
            </div>
          </div>
        </div>

        {/* LLM Model Selection */}
        <div className="card" style={{marginBottom: '16px'}}>
          <h3 style={{ marginTop: 0 }}>LLM Model Configuration</h3>
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px'}}>
            <div>
              <label style={{display: 'block', marginBottom: '4px', fontWeight: 500}}>Provider</label>
              <select style={{width: '100%'}} value={provider} onChange={e=>setProvider(e.target.value)}>
                {providers.map(p => <option key={p.provider} value={p.provider}>{p.provider}</option>)}
              </select>
            </div>
            <div>
              <label style={{display: 'block', marginBottom: '4px', fontWeight: 500}}>Model</label>
              <select style={{width: '100%'}} value={model} onChange={e=>setModel(e.target.value)}>
                {provModels(provider).map(m=> <option key={m.name} value={m.name}>{m.name}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Application Context */}
        <div className="card" style={{marginBottom: '16px'}}>
          <h3 style={{ marginTop: 0 }}>Application Context</h3>
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px'}}>
            <div>
              <label style={{display: 'block', marginBottom: '4px', fontWeight: 500}}>System Type *</label>
              <select style={{width: '100%'}} required value={q.applicationContext.systemType} onChange={e => setQ({...q, applicationContext: {...q.applicationContext, systemType: e.target.value}})}>
                <option value="">Select type</option>
                <option value="llm-chatbot">LLM Chatbot</option>
                <option value="recommendation-engine">Recommendation Engine</option>
                <option value="computer-vision">Computer Vision</option>
                <option value="nlp-processing">NLP Processing</option>
                <option value="predictive-analytics">Predictive Analytics</option>
                <option value="generative-ai">Generative AI</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label style={{display: 'block', marginBottom: '4px', fontWeight: 500}}>Domain *</label>
              <select style={{width: '100%'}} required value={q.applicationContext.domain} onChange={e => setQ({...q, applicationContext: {...q.applicationContext, domain: e.target.value}})}>
                <option value="">Select domain</option>
                <option value="healthcare">Healthcare</option>
                <option value="finance">Finance</option>
                <option value="education">Education</option>
                <option value="e-commerce">E-Commerce</option>
                <option value="government">Government</option>
                <option value="customer-support">Customer Support</option>
                <option value="general-purpose">General Purpose</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label style={{display: 'block', marginBottom: '4px', fontWeight: 500}}>Criticality Level *</label>
              <select style={{width: '100%'}} required value={q.applicationContext.criticality} onChange={e => setQ({...q, applicationContext: {...q.applicationContext, criticality: e.target.value}})}>
                <option value="">Select level</option>
                <option value="business-critical">Business Critical</option>
                <option value="high-impact">High Impact</option>
                <option value="moderate">Moderate</option>
                <option value="experimental-internal">Experimental/Internal</option>
              </select>
            </div>
          </div>
        </div>

        {/* Data Handling */}
        <div className="card" style={{marginBottom: '16px'}}>
          <h3 style={{ marginTop: 0 }}>Data Handling</h3>
          <div>
            <label style={{display: 'block', marginBottom: '8px', fontWeight: 500}}>Data Sources (select all that apply) *</label>
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px'}}>
              {['user-input', 'apis', 'databases', 'files', 'third-party', 'sensors'].map(src => (
                <label key={src} style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                  <input type="checkbox" checked={q.dataHandling.sources.includes(src)} onChange={() => toggleArray('dataHandling', 'sources', src)} />
                  {src}
                </label>
              ))}
            </div>
          </div>
          <div style={{marginTop: '16px'}}>
            <label style={{display: 'block', marginBottom: '8px', fontWeight: 500}}>Sensitive Data Types</label>
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px'}}>
              {['pii', 'phi', 'financial', 'credentials', 'none'].map(type => (
                <label key={type} style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                  <input type="checkbox" checked={q.dataHandling.containsSensitive.includes(type)} onChange={() => toggleArray('dataHandling', 'containsSensitive', type)} />
                  {type.toUpperCase()}
                </label>
              ))}
            </div>
          </div>
          <div style={{marginTop: '16px'}}>
            <label style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
              <input type="checkbox" checked={q.dataHandling.sanitizeBeforeModelUse} onChange={e => setQ({...q, dataHandling: {...q.dataHandling, sanitizeBeforeModelUse: e.target.checked}})} />
              Data sanitization/validation before model use
            </label>
          </div>
        </div>

        {/* Model Details */}
        <div className="card" style={{marginBottom: '16px'}}>
          <h3 style={{ marginTop: 0 }}>Model Details</h3>
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px'}}>
            <div>
              <label style={{display: 'block', marginBottom: '4px', fontWeight: 500}}>Model Type *</label>
              <select style={{width: '100%'}} required value={q.modelDetails.modelType} onChange={e => setQ({...q, modelDetails: {...q.modelDetails, modelType: e.target.value}})}>
                <option value="">Select type</option>
                <option value="foundation-api">Foundation Model (API)</option>
                <option value="fine-tuned">Fine-tuned Model</option>
                <option value="custom-trained">Custom Trained</option>
                <option value="open-source">Open Source</option>
                <option value="ensemble">Ensemble</option>
              </select>
            </div>
            <div>
              <label style={{display: 'block', marginBottom: '4px', fontWeight: 500}}>Maintenance *</label>
              <select style={{width: '100%'}} required value={q.modelDetails.maintenance} onChange={e => setQ({...q, modelDetails: {...q.modelDetails, maintenance: e.target.value}})}>
                <option value="">Select maintenance</option>
                <option value="static">Static (no updates)</option>
                <option value="periodic">Periodic Updates</option>
                <option value="continuous">Continuous Retraining</option>
                <option value="managed">Vendor Managed</option>
              </select>
            </div>
            <div>
              <label style={{display: 'block', marginBottom: '4px', fontWeight: 500}}>Model Visibility *</label>
              <select style={{width: '100%'}} required value={q.modelDetails.visibility} onChange={e => setQ({...q, modelDetails: {...q.modelDetails, visibility: e.target.value}})}>
                <option value="">Select visibility</option>
                <option value="black-box">Black Box</option>
                <option value="white-box">White Box (full access)</option>
                <option value="gray-box">Gray Box (partial)</option>
              </select>
            </div>
          </div>
        </div>

        {/* System Architecture */}
        <div className="card" style={{marginBottom: '16px'}}>
          <h3 style={{ marginTop: 0 }}>System Architecture</h3>
          <div>
            <label style={{display: 'block', marginBottom: '4px', fontWeight: 500}}>Deployment *</label>
            <select style={{width: '100%', maxWidth: '300px'}} required value={q.systemArchitecture.deployment} onChange={e => setQ({...q, systemArchitecture: {...q.systemArchitecture, deployment: e.target.value}})}>
              <option value="">Select deployment</option>
              <option value="cloud">Cloud (public)</option>
              <option value="on-premise">On-Premise</option>
              <option value="hybrid">Hybrid</option>
              <option value="edge">Edge</option>
            </select>
          </div>
          <div style={{marginTop: '16px'}}>
            <label style={{display: 'block', marginBottom: '8px', fontWeight: 500}}>Access Methods (select all that apply) *</label>
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px'}}>
              {['public-api', 'web-ui', 'mobile-app', 'admin-console', 'internal-only'].map(acc => (
                <label key={acc} style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                  <input type="checkbox" checked={q.systemArchitecture.access.includes(acc)} onChange={() => toggleArray('systemArchitecture', 'access', acc)} />
                  {acc}
                </label>
              ))}
            </div>
          </div>
          <div style={{marginTop: '16px'}}>
            <label style={{display: 'block', marginBottom: '8px', fontWeight: 500}}>Integrations</label>
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px'}}>
              {['external-apis', 'databases', 'auth-providers', 'payment-gateways', 'crm', 'knowledge-base', 'none'].map(int => (
                <label key={int} style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                  <input type="checkbox" checked={q.systemArchitecture.integrations.includes(int)} onChange={() => toggleArray('systemArchitecture', 'integrations', int)} />
                  {int}
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Interaction Control */}
        <div className="card" style={{marginBottom: '16px'}}>
          <h3 style={{ marginTop: 0 }}>Interaction Control</h3>
          <div>
            <label style={{display: 'block', marginBottom: '8px', fontWeight: 500}}>User Inputs (select all that apply) *</label>
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px'}}>
              {['free-text', 'structured', 'files', 'voice', 'images'].map(inp => (
                <label key={inp} style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                  <input type="checkbox" checked={q.interactionControl.inputs.includes(inp)} onChange={() => toggleArray('interactionControl', 'inputs', inp)} />
                  {inp}
                </label>
              ))}
            </div>
          </div>
          <div style={{marginTop: '16px'}}>
            <label style={{display: 'block', marginBottom: '8px', fontWeight: 500}}>Output Consumption (select all that apply) *</label>
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px'}}>
              {['end-user-display', 'automated-actions', 'downstream-systems', 'reports'].map(out => (
                <label key={out} style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                  <input type="checkbox" checked={q.interactionControl.outputs.includes(out)} onChange={() => toggleArray('interactionControl', 'outputs', out)} />
                  {out}
                </label>
              ))}
            </div>
          </div>
          <div style={{marginTop: '16px'}}>
            <label style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
              <input type="checkbox" checked={q.interactionControl.promptGuardrails} onChange={e => setQ({...q, interactionControl: {...q.interactionControl, promptGuardrails: e.target.checked}})} />
              Prompt guardrails implemented
            </label>
          </div>
        </div>

        {/* Security Practices */}
        <div className="card" style={{marginBottom: '16px'}}>
          <h3 style={{ marginTop: 0 }}>Security Practices</h3>
          <div>
            <label style={{display: 'block', marginBottom: '8px', fontWeight: 500}}>Authentication Methods (select all that apply) *</label>
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px'}}>
              {['basic', 'oauth', 'oauth2', 'saml', 'api-keys', 'mfa', 'rbac', 'none'].map(auth => (
                <label key={auth} style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                  <input type="checkbox" checked={q.securityPractices.auth.includes(auth)} onChange={() => toggleArray('securityPractices', 'auth', auth)} />
                  {auth.toUpperCase()}
                </label>
              ))}
            </div>
          </div>
          <div style={{marginTop: '16px'}}>
            <label style={{display: 'block', marginBottom: '4px', fontWeight: 500}}>Logging Practices *</label>
            <select style={{width: '100%', maxWidth: '300px'}} required value={q.securityPractices.logging} onChange={e => setQ({...q, securityPractices: {...q.securityPractices, logging: e.target.value}})}>
              <option value="">Select logging</option>
              <option value="comprehensive">Comprehensive</option>
              <option value="masked">Masked (PII removed)</option>
              <option value="basic">Basic</option>
              <option value="none">None</option>
            </select>
          </div>
          <div style={{marginTop: '16px'}}>
            <label style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
              <input type="checkbox" checked={q.securityPractices.encryption} onChange={e => setQ({...q, securityPractices: {...q.securityPractices, encryption: e.target.checked}})} />
              Data encryption (at rest and in transit)
            </label>
          </div>
        </div>

        {/* Threat Surface */}
        <div className="card" style={{marginBottom: '16px'}}>
          <h3 style={{ marginTop: 0 }}>Threat Surface</h3>
          <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
            <label style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
              <input type="checkbox" checked={q.threatSurface.multiTenant} onChange={e => setQ({...q, threatSurface: {...q.threatSurface, multiTenant: e.target.checked}})} />
              Multi-tenant system
            </label>
            <label style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
              <input type="checkbox" checked={q.threatSurface.externalQuery} onChange={e => setQ({...q, threatSurface: {...q.threatSurface, externalQuery: e.target.checked}})} />
              Allows external user queries
            </label>
            <label style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
              <input type="checkbox" checked={q.threatSurface.adversarialProtection} onChange={e => setQ({...q, threatSurface: {...q.threatSurface, adversarialProtection: e.target.checked}})} />
              Adversarial protection implemented
            </label>
          </div>
        </div>

        {/* Compliance & Governance */}
        <div className="card" style={{marginBottom: '16px'}}>
          <h3 style={{ marginTop: 0 }}>Compliance & Governance</h3>
          <div>
            <label style={{display: 'block', marginBottom: '8px', fontWeight: 500}}>Compliance Frameworks</label>
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px'}}>
              {['gdpr', 'hipaa', 'pci-dss', 'soc2', 'iso27001', 'ccpa', 'none'].map(fw => (
                <label key={fw} style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                  <input type="checkbox" checked={q.complianceGovernance.frameworks.includes(fw)} onChange={() => toggleArray('complianceGovernance', 'frameworks', fw)} />
                  {fw.toUpperCase()}
                </label>
              ))}
            </div>
          </div>
          <div style={{marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '12px'}}>
            <label style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
              <input type="checkbox" checked={q.complianceGovernance.explainability} onChange={e => setQ({...q, complianceGovernance: {...q.complianceGovernance, explainability: e.target.checked}})} />
              Model explainability required
            </label>
            <label style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
              <input type="checkbox" checked={q.complianceGovernance.retentionPolicies} onChange={e => setQ({...q, complianceGovernance: {...q.complianceGovernance, retentionPolicies: e.target.checked}})} />
              Data retention policies implemented
            </label>
          </div>
        </div>

        <div style={{display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px'}}>
          <button type="button" className="btn" style={{background: '#ddd', color: '#333'}} onClick={() => nav('/dashboard')} disabled={loading}>
            Cancel
          </button>
          <button type="submit" className="btn" disabled={loading}>
            {loading ? 'Analyzing...' : '🔍 Analyze System'}
          </button>
        </div>
      </form>

      {result && (
        <div className="card" style={{marginTop: '24px'}}>
          <h3 style={{marginTop: 0}}>Analysis Results</h3>
          <div style={{display: 'flex', gap: '16px', marginBottom: '16px'}}>
            <div style={{flex: 1, padding: '16px', background: '#f5f5f5', borderRadius: '8px'}}>
              <div style={{fontSize: '14px', color: '#666'}}>Risk Level</div>
              <div style={{fontSize: '24px', fontWeight: 'bold', marginTop: '4px'}}>
                <span className={`badge ${result.riskLevel}`}>{result.riskLevel?.toUpperCase()}</span>
              </div>
            </div>
            <div style={{flex: 1, padding: '16px', background: '#f5f5f5', borderRadius: '8px'}}>
              <div style={{fontSize: '14px', color: '#666'}}>Risk Score</div>
              <div style={{fontSize: '24px', fontWeight: 'bold', marginTop: '4px'}}>{result.riskScore}/10</div>
            </div>
            <div style={{flex: 1, padding: '16px', background: '#f5f5f5', borderRadius: '8px'}}>
              <div style={{fontSize: '14px', color: '#666'}}>Confidence</div>
              <div style={{fontSize: '24px', fontWeight: 'bold', marginTop: '4px'}}>{result.confidence}%</div>
            </div>
          </div>

          <h4>Summary</h4>
          <p>{result.summary}</p>

          <h4>Vulnerabilities ({result.vulnerabilities?.length || 0})</h4>
          <div style={{display: 'grid', gap: '12px'}}>
            {result.vulnerabilities?.map((v, i) => (
              <div key={i} style={{padding: '12px', background: '#fff3cd', border: '1px solid #ffc107', borderRadius: '4px', color: '#856404'}}>
                {v}
              </div>
            ))}
          </div>

          <h4 style={{marginTop: '24px'}}>Recommendations ({result.recommendations?.length || 0})</h4>
          <div style={{display: 'grid', gap: '12px'}}>
            {result.recommendations?.map((r, i) => (
              <div key={i} style={{padding: '12px', background: '#d1ecf1', border: '1px solid #0dcaf0', borderRadius: '4px', color: '#0c5460'}}>
                {r}
              </div>
            ))}
          </div>

          {result.analysisText && (
            <div style={{marginTop: '24px'}}>
              <h4>Full LLM Analysis</h4>
              <div style={{padding: '16px', background: '#f8f9fa', border: '1px solid #dee2e6', borderRadius: '4px', whiteSpace: 'pre-wrap', fontSize: '14px', maxHeight: '400px', overflow: 'auto'}}>
                {result.analysisText}
              </div>
            </div>
          )}

          <div style={{display: 'flex', justifyContent: 'space-between', marginTop: '24px'}}>
            <button className="btn" style={{background: '#ddd', color: '#333'}} onClick={() => setResult(null)}>
              New Assessment
            </button>
            <button className="btn" onClick={() => nav('/dashboard')}>
              Back to Dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
