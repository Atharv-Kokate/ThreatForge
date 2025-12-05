import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getStatus } from '../services/analysis.js'
import jsPDF from 'jspdf'

export default function Report() {
  const { id } = useParams()
  const nav = useNavigate()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showAnalysis, setShowAnalysis] = useState(false)

  useEffect(() => {
    (async () => {
      setLoading(true)
      try {
        const res = await getStatus(id)
        setData(res)
      } finally {
        setLoading(false)
      }
    })()
  }, [id])

  function downloadPdf() {
    const doc = new jsPDF()
    let y = 20
    
    doc.setFontSize(18)
    doc.text(`Risk Assessment Report`, 10, y)
    y += 10
    
    doc.setFontSize(12)
    doc.text(`ID: ${id}`, 10, y)
    y += 7
    doc.text(`Risk Level: ${data?.riskLevel || 'N/A'}`, 10, y)
    y += 7
    doc.text(`Risk Score: ${data?.riskScore || 'N/A'}/10`, 10, y)
    y += 7
    doc.text(`Confidence: ${data?.confidence || 'N/A'}%`, 10, y)
    y += 10
    
    doc.setFontSize(14)
    doc.text('Summary', 10, y)
    y += 7
    doc.setFontSize(10)
    const summary = doc.splitTextToSize(data?.summary || 'N/A', 180)
    doc.text(summary, 10, y)
    y += summary.length * 5 + 5
    
    doc.setFontSize(14)
    doc.text('Vulnerabilities', 10, y)
    y += 7
    doc.setFontSize(10)
    ;(data?.vulnerabilities || []).slice(0, 10).forEach((v, i) => {
      if (y > 270) {
        doc.addPage()
        y = 20
      }
      const lines = doc.splitTextToSize(`${i + 1}. ${v}`, 180)
      doc.text(lines, 10, y)
      y += lines.length * 5 + 2
    })
    
    y += 5
    doc.setFontSize(14)
    if (y > 270) {
      doc.addPage()
      y = 20
    }
    doc.text('Recommendations', 10, y)
    y += 7
    doc.setFontSize(10)
    ;(data?.recommendations || []).slice(0, 10).forEach((r, i) => {
      if (y > 270) {
        doc.addPage()
        y = 20
      }
      const lines = doc.splitTextToSize(`${i + 1}. ${r}`, 180)
      doc.text(lines, 10, y)
      y += lines.length * 5 + 2
    })
    
    doc.save(`risk-report-${id}.pdf`)
  }

  if (loading) return <div className="card"><p>Loading...</p></div>
  if (!data) return <div className="card"><p>No report found</p></div>

  return (
    <div className="grid">
      <div className="row space-between" style={{ alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ margin: 0 }}>Assessment Report</h2>
          <p style={{ margin: '4px 0 0 0', color: '#666', fontSize: '14px' }}>
            ID: {id}
          </p>
        </div>
        <button className="btn" style={{ background: '#ddd', color: '#333' }} onClick={() => nav('/dashboard')}>
          ← Back to Dashboard
        </button>
      </div>

      {/* Metrics Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
        <div style={{ padding: '20px', background: '#f5f5f5', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <div style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>Risk Level</div>
          <div style={{ fontSize: '28px', fontWeight: 'bold' }}>
            <span className={`badge ${data.riskLevel}`} style={{ fontSize: '24px', padding: '8px 16px' }}>
              {data.riskLevel?.toUpperCase()}
            </span>
          </div>
        </div>
        <div style={{ padding: '20px', background: '#f5f5f5', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <div style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>Risk Score</div>
          <div style={{ fontSize: '28px', fontWeight: 'bold' }}>{data.riskScore}/10</div>
        </div>
        <div style={{ padding: '20px', background: '#f5f5f5', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <div style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>Confidence</div>
          <div style={{ fontSize: '28px', fontWeight: 'bold' }}>{data.confidence}%</div>
        </div>
      </div>

      {/* Summary Section */}
      <div className="card" style={{ marginBottom: '16px' }}>
        <h3 style={{ marginTop: 0 }}>Summary</h3>
        <p style={{ lineHeight: '1.6' }}>{data.summary}</p>
        {data.model && (
          <p style={{ fontSize: '14px', color: '#666', marginTop: '12px' }}>
            <strong>Model:</strong> {data.model}
          </p>
        )}
      </div>

      {/* Vulnerabilities Section */}
      <div className="card" style={{ marginBottom: '16px' }}>
        <h3 style={{ marginTop: 0 }}>Vulnerabilities ({data.vulnerabilities?.length || 0})</h3>
        {data.vulnerabilities?.length > 0 ? (
          <div style={{ display: 'grid', gap: '12px' }}>
            {data.vulnerabilities.map((v, i) => (
              <div key={i} style={{ padding: '12px', background: '#fff3cd', border: '1px solid #ffc107', borderRadius: '4px', lineHeight: '1.5', color: '#856404' }}>
                <strong>{i + 1}.</strong> {v}
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color: '#666' }}>No vulnerabilities identified</p>
        )}
      </div>

      {/* Recommendations Section */}
      <div className="card" style={{ marginBottom: '16px' }}>
        <h3 style={{ marginTop: 0 }}>Recommendations ({data.recommendations?.length || 0})</h3>
        {data.recommendations?.length > 0 ? (
          <div style={{ display: 'grid', gap: '12px' }}>
            {data.recommendations.map((r, i) => (
              <div key={i} style={{ padding: '12px', background: '#d1ecf1', border: '1px solid #0dcaf0', borderRadius: '4px', lineHeight: '1.5', color: '#0c5460' }}>
                <strong>{i + 1}.</strong> {r}
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color: '#666' }}>No recommendations available</p>
        )}
      </div>

      {/* Full LLM Analysis Section */}
      {data.analysisText && (
        <div className="card" style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0 }}>Full LLM Analysis</h3>
            <button 
              className="btn" 
              style={{ background: '#6c757d', padding: '8px 16px' }}
              onClick={() => setShowAnalysis(!showAnalysis)}
            >
              {showAnalysis ? 'Hide' : 'Show'} Analysis
            </button>
          </div>
          {showAnalysis && (
            <div style={{ 
              marginTop: '16px', 
              padding: '16px', 
              background: '#f8f9fa', 
              border: '1px solid #dee2e6', 
              borderRadius: '4px', 
              whiteSpace: 'pre-wrap', 
              fontSize: '14px', 
              lineHeight: '1.6',
              maxHeight: '500px', 
              overflow: 'auto' 
            }}>
              {data.analysisText}
            </div>
          )}
        </div>
      )}

      {/* Provenance Section */}
      {data.provenance && (
        <div className="card" style={{ marginBottom: '16px' }}>
          <h3 style={{ marginTop: 0 }}>Knowledge Sources</h3>
          <div style={{ fontSize: '14px' }}>
            <p><strong>RAG Documents:</strong> {data.provenance.ragDocuments || 0}</p>
            <p><strong>Web Search Results:</strong> {data.provenance.webSearchResults || 0}</p>
            {data.provenance.sources?.length > 0 && (
              <div style={{ marginTop: '12px' }}>
                <strong>Sources:</strong>
                <ul style={{ marginTop: '8px' }}>
                  {data.provenance.sources.map((src, i) => (
                    <li key={i}>{src}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Actions */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
        <button className="btn" onClick={downloadPdf}>
          📄 Download PDF
        </button>
        <button className="btn" onClick={() => nav('/new')}>
          🔍 New Assessment
        </button>
      </div>
    </div>
  )
}
