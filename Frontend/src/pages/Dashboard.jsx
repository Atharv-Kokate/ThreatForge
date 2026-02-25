
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getHistory } from '../services/history.js'
import {
  Plus, Search, Filter, MoreVertical, FileText,
  LayoutDashboard, ShieldAlert, Activity, Calendar
} from 'lucide-react'
// Charts removed

export default function Dashboard() {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await getHistory({ limit: 100 })
      // Sort by date desc
      const sorted = (res.assessments || []).sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      setHistory(sorted)
    } finally {
      setLoading(false)
    }
  }

  // --- Analytics Logic ---
  const totalAssessments = history.length

  // Severity Counts
  const severityCounts = history.reduce((acc, h) => {
    const lvl = (h?.output_data?.riskLevel || 'unknown').toLowerCase()
    acc[lvl] = (acc[lvl] || 0) + 1
    return acc
  }, {})

  const criticalCount = (severityCounts.critical || 0) + (severityCounts.high || 0)
  const criticalPercent = totalAssessments ? Math.round((criticalCount / totalAssessments) * 100) : 0

  // Avg Score
  const totalScore = history.reduce((sum, h) => sum + (h?.output_data?.riskScore || 0), 0)
  const avgScore = totalAssessments ? (totalScore / totalAssessments).toFixed(1) : 0

  // Last Assessment
  const lastDate = history.length > 0 ? new Date(history[0].created_at).toLocaleDateString() : 'N/A'

  // Chart Data: Severity
  const severityData = [
    { name: 'critical', value: severityCounts.critical || 0 },
    { name: 'high', value: severityCounts.high || 0 },
    { name: 'medium', value: severityCounts.medium || 0 },
    { name: 'low', value: severityCounts.low || 0 },
    { name: 'info', value: severityCounts.info || 0 },
  ].filter(d => d.value > 0)

  // Chart Data: Trend (Simple: avg score by date)
  // Group by date
  const trendMap = history.reduce((acc, h) => {
    const date = new Date(h.created_at).toLocaleDateString()
    if (!acc[date]) acc[date] = { date, count: 0, totalScore: 0 }
    acc[date].count += 1
    acc[date].totalScore += (h?.output_data?.riskScore || 0)
    return acc
  }, {})

  const trendData = Object.values(trendMap)
    .map(d => ({ date: d.date, avgScore: parseFloat((d.totalScore / d.count).toFixed(1)) }))
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(-30) // Last 30 points

  return (
    <div className="grid">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1>Security Dashboard</h1>
          <p className="text-secondary">Overview of your AI system risks and vulnerabilities</p>
        </div>
        <Link to="/new" className="btn btn-primary">
          <Plus size={18} /> New Assessment
        </Link>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-4 gap-4">
        <div className="card flex items-center gap-4">
          <div style={{ background: '#eff6ff', padding: '12px', borderRadius: '8px', color: '#2563eb' }}>
            <LayoutDashboard size={24} />
          </div>
          <div>
            <div className="text-sm text-secondary">Total Assessments</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{totalAssessments}</div>
          </div>
        </div>

        <div className="card flex items-center gap-4">
          <div style={{ background: '#fef2f2', padding: '12px', borderRadius: '8px', color: '#dc2626' }}>
            <ShieldAlert size={24} />
          </div>
          <div>
            <div className="text-sm text-secondary">Critical / High Risk</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{criticalPercent}%</div>
          </div>
        </div>

        <div className="card flex items-center gap-4">
          <div style={{ background: '#fffbeb', padding: '12px', borderRadius: '8px', color: '#d97706' }}>
            <Activity size={24} />
          </div>
          <div>
            <div className="text-sm text-secondary">Avg Risk Score</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{avgScore}<span style={{ fontSize: '14px', color: '#94a3b8' }}>/10</span></div>
          </div>
        </div>

        <div className="card flex items-center gap-4">
          <div style={{ background: '#f0fdf4', padding: '12px', borderRadius: '8px', color: '#16a34a' }}>
            <Calendar size={24} />
          </div>
          <div>
            <div className="text-sm text-secondary">Last Assessment</div>
            <div style={{ fontSize: '18px', fontWeight: 'bold' }}>{lastDate}</div>
          </div>
        </div>
      </div>

      {/* Charts Section Removed as per request */}

      {/* Recent Assessments Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3>Recent Assessments</h3>
          <div className="flex gap-2">
            <div style={{ position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: '10px', top: '10px', color: '#94a3b8' }} />
              <input type="text" placeholder="Search..." style={{ paddingLeft: '32px', paddingRight: '12px', width: '200px' }} />
            </div>
            <button className="btn btn-secondary btn-ghost"><Filter size={16} /> Filter</button>
          </div>
        </div>

        <div className="table-container" style={{ border: 'none', borderRadius: 0 }}>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Product Name</th>
                <th>System Type</th>
                <th>Risk Level</th>
                <th>Risk Score</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" style={{ textAlign: 'center', padding: '40px' }}>Loading...</td></tr>
              ) : history.length === 0 ? (
                <tr><td colSpan="6" style={{ textAlign: 'center', padding: '40px' }}>No assessments found.</td></tr>
              ) : (
                history.map(h => (
                  <tr key={h.id}>
                    <td className="text-secondary">{new Date(h.created_at).toLocaleDateString()}</td>
                    <td style={{ fontWeight: 500 }}>{h?.input_data?.product?.name || 'Untitled'}</td>
                    <td><span style={{ background: '#f1f5f9', padding: '4px 8px', borderRadius: '4px', fontSize: '12px' }}>{h?.input_data?.questionnaire?.applicationContext?.systemType || 'N/A'}</span></td>
                    <td>
                      <span className={`badge ${(h?.output_data?.riskLevel || 'unknown').toLowerCase()}`}>
                        {h?.output_data?.riskLevel || 'UNKNOWN'}
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <span style={{ fontWeight: 'bold', width: '20px' }}>{h?.output_data?.riskScore}</span>
                        <div style={{ width: '80px', height: '6px', background: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
                          <div style={{
                            width: `${(h?.output_data?.riskScore || 0) * 10}%`,
                            background: h?.output_data?.riskScore > 7 ? '#ef4444' : h?.output_data?.riskScore > 4 ? '#f59e0b' : '#22c55e',
                            height: '100%'
                          }} />
                        </div>
                      </div>
                    </td>
                    <td>
                      <Link to={`/report/${h.id}`} className="btn btn-ghost" style={{ padding: '6px' }}>
                        <FileText size={16} /> View
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
