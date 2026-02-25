
import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getStatus } from '../services/analysis.js'
import {
  ArrowLeft, Download, Shield, AlertTriangle,
  CheckCircle, Share2, Printer, FileText
} from 'lucide-react'
import jsPDF from 'jspdf'
import ReactMarkdown from 'react-markdown'

export default function Report() {
  const { id } = useParams()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadReport()
  }, [id])

  const loadReport = async () => {
    try {
      setLoading(true)
      const res = await getStatus(id)
      setData(res)
    } catch (e) {
      setError('Failed to load report')
    } finally {
      setLoading(false)
    }
  }

  const exportPDF = () => {
    if (!data) return
    const doc = new jsPDF()
    const product = data.input_data?.product?.name || 'Assessment'

    doc.setFontSize(20)
    doc.text(`Risk Assessment Report: ${product}`, 14, 20)

    doc.setFontSize(12)
    doc.text(`Date: ${new Date(data.created_at).toLocaleDateString()}`, 14, 30)
    doc.text(`Risk Score: ${data.output_data?.riskScore}/10`, 14, 38)
    doc.text(`Risk Level: ${data.output_data?.riskLevel}`, 14, 46)

    doc.setFontSize(14)
    doc.text("Executive Summary", 14, 60)
    doc.setFontSize(10)
    const splitSummary = doc.splitTextToSize(data.output_data?.summary || '', 180)
    doc.text(splitSummary, 14, 70)

    doc.save(`${product.replace(/\s+/g, '_')}_Report.pdf`)
  }

  if (loading) return <div className="flex items-center justify-center h-screen"><div className="spinner" /></div>
  if (error) return <div className="card critical">{error}</div>
  if (!data) return <div>No data</div>

  const output = data.output_data || {}
  const input = data.input_data || {}
  const riskColor = output.riskScore > 7 ? '#ef4444' : output.riskScore > 4 ? '#f59e0b' : '#22c55e'

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <Link to="/dashboard" className="btn btn-ghost"><ArrowLeft size={20} /></Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 style={{ marginBottom: 0 }}>{input.product?.name || 'Security Report'}</h1>
              <span className="badge" style={{ background: '#f1f5f9', border: '1px solid #cbd5e1' }}>v{input.product?.version || '1.0'}</span>
            </div>
            <p className="text-secondary" style={{ margin: 0, marginTop: '15px', marginBottom: '10px' }}>
              Generated on {new Date(data.created_at).toLocaleString()}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={exportPDF} className="btn btn-secondary">
            <Download size={18} /> Export PDF
          </button>
          <button className="btn btn-secondary" onClick={() => window.print()}>
            <Printer size={18} /> Print
          </button>
        </div>
      </div>

      {/* Executive Summary Card */}
      <div className="card mb-6" style={{ borderTop: `4px solid ${riskColor}` }}>
        <div className="grid grid-2 gap-4">
          <div>
            {/* <h3>Executive Summary</h3> */}

            <div className="text-secondary markdown-content" style={{ whiteSpace: 'normal' }}>
              <ReactMarkdown>{output.summary}</ReactMarkdown>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center p-4" style={{ background: '#f8fafc', borderRadius: '8px' }}>
            <div style={{ fontSize: '14px', fontWeight: 600, color: '#64748b', marginBottom: '8px', paddingTop: '40px' }}>OVERALL RISK SCORE</div>
            <div style={{ position: 'relative', width: '120px', height: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: '20px' }}>
              <svg viewBox="0 0 36 36" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#e2e8f0" strokeWidth="3" />
                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke={riskColor} strokeWidth="3" strokeDasharray={`${output.riskScore * 10}, 100`} />
              </svg>
              <div style={{ position: 'absolute', fontSize: '32px', fontWeight: 'bold', color: riskColor }}>
                {output.riskScore}
              </div>
            </div>
            <div className={`badge ${output.riskLevel?.toLowerCase()}`} style={{ marginTop: '12px', fontSize: '14px', padding: '6px 16px' }}>
              {output.riskLevel?.toUpperCase()}
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-6" style={{ paddingTop: '20px' }}>
        {/* Vulnerabilities */}
        {/* Vulnerabilities */}
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="text-critical" />
            <div>
              <h3 style={{ marginBottom: 0, paddingTop: '1px', fontSize: '20px' }}>Identified Vulnerabilities</h3>
            </div>
          </div>
          <div className="flex flex-col gap-4" >
            {output.vulnerabilities && output.vulnerabilities.map((vuln, idx) => {
              // Format category headers (e.g., "Data Security Risks:") to be bold and on their own line
              // Then ensure bullet points are on new lines
              const formattedVuln = vuln
                .replace(/(.*?Risks:)/g, '\n\n**$1**\n\n') // Make headers bold with spacing
                .replace(/•/g, '\n* '); // Convert bullet chars to markdown list items

              return (
                <div key={idx} style={{
                  padding: '12px',
                  background: '#fff1f2',
                  borderLeft: '4px solid #f43f5e',
                  borderRadius: '4px',
                  fontSize: '14px'
                }}>
                  <ReactMarkdown components={{
                    ul: ({ node, ...props }) => <ul style={{ margin: '8px 0', paddingLeft: '20px', listStyleType: 'disc' }} {...props} />,
                    li: ({ node, ...props }) => <li style={{ marginBottom: '4px' }} {...props} />,
                    p: ({ node, ...props }) => <p style={{ marginBottom: '8px' }} {...props} />
                  }}>
                    {formattedVuln}
                  </ReactMarkdown>
                </div>
              )
            })}
            {(!output.vulnerabilities || output.vulnerabilities.length === 0) && (
              <p className="text-secondary">No specific vulnerabilities detected.</p>
            )}
          </div>
        </div>

        {/* Recommendations */}
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="text-success" color="#16a34a" />
            <div>
              <h3 style={{ marginBottom: 0, fontSize: '20px' }}>Recommendations</h3>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            {output.recommendations && output.recommendations.flatMap(rec =>
              rec.split('•').map(r => r.trim()).filter(r => r.length > 0)
            ).map((rec, idx) => {
              // Bold any text before a colon roughly to act as a header if present, similar to vulnerabilities
              // or just render the markdown. 
              // The user generic request "point by point just like the identified vulnerabilities"
              return (
                <div key={idx} style={{
                  padding: '12px',
                  background: '#f0fdf4',
                  borderLeft: '4px solid #22c55e',
                  borderRadius: '4px',
                  fontSize: '14px'
                }}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <CheckCircle size={16} color="#22c55e" style={{ marginTop: '2px', flexShrink: 0 }} />
                    <ReactMarkdown components={{ p: ({ node, ...props }) => <div {...props} /> }}>
                      {rec}
                    </ReactMarkdown>
                  </div>
                </div>
              )
            })}
            {(!output.recommendations || output.recommendations.length === 0) && (
              <p className="text-secondary">No specific recommendations.</p>
            )}
          </div>
        </div>
      </div>

      {/* KB Provenance (if available) */}
      {data.provenance && (
        <div className="card mt-6">
          <h3 style={{ fontSize: '20px' }}>Knowledge Base Context</h3>
          <p className="text-secondary text-sm mb-4">This analysis was augmented by the following sources:</p>
          <div className="grid gap-2">
            {data.provenance.map((source, i) => (
              <div key={i} style={{ padding: '12px', border: '1px solid #e2e8f0', borderRadius: '6px' }}>
                <div style={{ fontWeight: 600, fontSize: '13px', color: '#475569' }}>SOURCE: {source.source.toUpperCase()}</div>
                {source.title && <div style={{ fontWeight: 600 }}>{source.title}</div>}
                <div style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>{source.snippet}</div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  )
}
