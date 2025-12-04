import React, { useEffect, useState } from 'react'
import { analyzeRag, listModels } from '../services/analysis.js'
import { useNavigate } from 'react-router-dom'

export default function NewAssessment() {
  const nav = useNavigate()
  const [providers, setProviders] = useState([])
  const [provider, setProvider] = useState('groq')
  const [model, setModel] = useState('llama-3.1-8b-instant')
  const [loading, setLoading] = useState(false)

  const [product, setProduct] = useState({ name: '', description: '', category: '', technology: '', version: '' })
  const [q, setQ] = useState({
    applicationContext: { systemType: 'llm-chatbot', domain: 'general', criticality: 'medium' },
    dataHandling: { sources: ['user-input'], containsSensitive: [], sanitizeBeforeModelUse: true },
    modelDetails: { modelType: 'foundation-api', maintenance: 'periodic', visibility: 'black-box' },
    systemArchitecture: { deployment: 'cloud', access: ['web-ui'], integrations: [] },
    interactionControl: { inputs: ['free-text'], outputs: ['end-user-display'], promptGuardrails: true },
    securityPractices: { auth: ['oauth'], logging: 'masked', encryption: true },
    threatSurface: { multiTenant: false, externalQuery: true, adversarialProtection: true },
    complianceGovernance: { frameworks: ['gdpr'], explainability: true, retentionPolicies: true }
  })
  const [result, setResult] = useState(null)

  useEffect(() => {
    (async () => {
      const provs = await listModels()
      setProviders(provs)
      const groq = provs.find(p => p.provider === 'groq')
      if (groq) {
        setProvider('groq')
        setModel(groq.models[0]?.name || 'llama-3.1-8b-instant')
      }
    })()
  }, [])

  function provModels(p) {
    const pr = providers.find(x => x.provider === p)
    return pr?.models || []
  }

  async function onSubmit(e) {
    e.preventDefault()
    setLoading(true)
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
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card">
      <h2>New Assessment</h2>
      <form onSubmit={onSubmit} className="form grid-2">
        <div>
          <h3>Product</h3>
          <label>Name<input value={product.name} onChange={e=>setProduct({...product, name: e.target.value})} required /></label>
          <label>Description<textarea value={product.description} onChange={e=>setProduct({...product, description: e.target.value})} required /></label>
          <label>Category<input value={product.category} onChange={e=>setProduct({...product, category: e.target.value})} /></label>
          <label>Technology<input value={product.technology} onChange={e=>setProduct({...product, technology: e.target.value})} /></label>
          <label>Version<input value={product.version} onChange={e=>setProduct({...product, version: e.target.value})} /></label>
        </div>
        <div>
          <h3>Model</h3>
          <label>Provider
            <select value={provider} onChange={e=>setProvider(e.target.value)}>
              {providers.map(p => <option key={p.provider} value={p.provider}>{p.provider}</option>)}
            </select>
          </label>
          <label>Model
            <select value={model} onChange={e=>setModel(e.target.value)}>
              {provModels(provider).map(m=> <option key={m.name} value={m.name}>{m.name}</option>)}
            </select>
          </label>
          <h3>Deployment</h3>
          <label>System Type<input value={q.applicationContext.systemType} onChange={e=>setQ({...q, applicationContext: {...q.applicationContext, systemType: e.target.value}})} /></label>
          <label>Domain<input value={q.applicationContext.domain} onChange={e=>setQ({...q, applicationContext: {...q.applicationContext, domain: e.target.value}})} /></label>
          <label>Criticality<input value={q.applicationContext.criticality} onChange={e=>setQ({...q, applicationContext: {...q.applicationContext, criticality: e.target.value}})} /></label>
        </div>
        <button className="btn" disabled={loading}>{loading ? 'Analyzing...' : 'Analyze'}</button>
      </form>

      {result && (
        <div className="card">
          <h3>Results</h3>
          <p><strong>Risk Level:</strong> <span className={`badge ${result.riskLevel}`}>{result.riskLevel}</span></p>
          <p><strong>Score:</strong> {result.riskScore} | <strong>Confidence:</strong> {result.confidence}</p>
          <h4>Vulnerabilities</h4>
          <ul>
            {result.vulnerabilities.map((v, i) => <li key={i}>{v}</li>)}
          </ul>
          <h4>Recommendations</h4>
          <ul>
            {result.recommendations.map((r, i) => <li key={i}>{r}</li>)}
          </ul>
          <div className="row">
            <button className="btn" onClick={()=>nav('/dashboard')}>Back to Dashboard</button>
          </div>
        </div>
      )}
    </div>
  )
}
