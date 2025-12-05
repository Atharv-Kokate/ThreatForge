import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getHistory } from '../services/history.js'

export default function Dashboard() {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    (async () => {
      setLoading(true)
      try {
        const res = await getHistory({ limit: 100 })
        setHistory(res.history || [])
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const severityCounts = history.reduce((acc, h) => {
    const lvl = h?.output_data?.riskLevel || 'unknown'
    acc[lvl] = (acc[lvl] || 0) + 1
    return acc
  }, {})

  const totalAssessments = history.length
  const criticalCount = (severityCounts.critical || 0) + (severityCounts.high || 0)

  return (
    <div className="grid">
      <div className="row space-between" style={{ alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ margin: 0 }}>Dashboard</h2>
          <p style={{ margin: '4px 0 0 0', color: '#666', fontSize: '14px' }}>
            Overview of your security assessments
          </p>
        </div>
        <Link to="/new" className="btn">
          🔍 New Assessment
        </Link>
      </div>

      {/* Summary Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div style={{ padding: '20px', background: '#f5f5f5', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <div style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>Total Assessments</div>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#333' }}>{totalAssessments}</div>
        </div>
        <div style={{ padding: '20px', background: '#fff3cd', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <div style={{ fontSize: '14px', color: '#856404', marginBottom: '8px' }}>Critical/High Risk</div>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#856404' }}>{criticalCount}</div>
        </div>
        <div style={{ padding: '20px', background: '#d1ecf1', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <div style={{ fontSize: '14px', color: '#0c5460', marginBottom: '8px' }}>Low Risk</div>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#0c5460' }}>{severityCounts.low || 0}</div>
        </div>
        <div style={{ padding: '20px', background: '#d4edda', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <div style={{ fontSize: '14px', color: '#155724', marginBottom: '8px' }}>Info</div>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#155724' }}>{severityCounts.info || 0}</div>
        </div>
      </div>

      {/* History Table */}
      <div className="card">
        <h3 style={{ marginTop: 0, marginBottom: '16px' }}>Assessment History</h3>
      {loading ? (
        <p style={{ textAlign: 'center', padding: '40px', color: '#666' }}>Loading assessments...</p>
      ) : history.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <p style={{ color: '#666', marginBottom: '16px' }}>No assessments yet</p>
          <Link to="/new" className="btn">Create Your First Assessment</Link>
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #ddd' }}>
                <th style={{ padding: '12px', textAlign: 'left' }}>Date</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Product</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>System Type</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Risk Level</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Risk Score</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {history.map(h => (
                <tr key={h.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '12px' }}>{new Date(h.created_at).toLocaleDateString()}</td>
                  <td style={{ padding: '12px', fontWeight: 500 }}>{h?.input_data?.product?.name || 'N/A'}</td>
                  <td style={{ padding: '12px', fontSize: '14px', color: '#666' }}>
                    {h?.input_data?.questionnaire?.applicationContext?.systemType || 'N/A'}
                  </td>
                  <td style={{ padding: '12px' }}>
                    <span className={`badge ${h?.output_data?.riskLevel || 'unknown'}`}>
                      {(h?.output_data?.riskLevel || 'unknown').toUpperCase()}
                    </span>
                  </td>
                  <td style={{ padding: '12px', fontWeight: 'bold' }}>
                    {h?.output_data?.riskScore || 'N/A'}/10
                  </td>
                  <td style={{ padding: '12px' }}>
                    <Link to={`/report/${h.id}`} className="btn" style={{ padding: '6px 12px', fontSize: '14px' }}>
                      View Report
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      </div>
    </div>
  )
}
