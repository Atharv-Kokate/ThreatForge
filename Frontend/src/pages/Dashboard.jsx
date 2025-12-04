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

  return (
    <div className="card">
      <div className="row space-between">
        <h2>Dashboard</h2>
        <Link to="/new" className="btn">New Assessment</Link>
      </div>
      <div className="metrics">
        {Object.entries(severityCounts).map(([k,v]) => (
          <div key={k} className="metric">
            <div className="metric-title">{k.toUpperCase()}</div>
            <div className="metric-value">{v}</div>
          </div>
        ))}
      </div>
      <h3>History</h3>
      {loading ? <p>Loading...</p> : (
        <table className="table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Product</th>
              <th>Risk Level</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {history.map(h => (
              <tr key={h.id}>
                <td>{new Date(h.created_at).toLocaleString()}</td>
                <td>{h?.input_data?.product?.name}</td>
                <td><span className={`badge ${h?.output_data?.riskLevel}`}>{h?.output_data?.riskLevel}</span></td>
                <td>
                  <Link to={`/report/${h.id}`} className="btn small">View Report</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
