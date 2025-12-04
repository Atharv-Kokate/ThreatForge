import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getStatus } from '../services/analysis.js'
import jsPDF from 'jspdf'

export default function Report() {
  const { id } = useParams()
  const nav = useNavigate()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

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
    doc.text(`Risk Report ${id}`, 10, 10)
    doc.text(`Risk Level: ${data?.riskLevel}`, 10, 20)
    doc.text(`Risk Score: ${data?.riskScore}`, 10, 30)
    doc.text('Vulnerabilities:', 10, 40)
    ;(data?.vulnerabilities || []).slice(0,10).forEach((v, i) => doc.text(`- ${v}`, 10, 50 + i*8))
    doc.save(`report-${id}.pdf`)
  }

  if (loading) return <div className="card"><p>Loading...</p></div>
  if (!data) return <div className="card"><p>No report found</p></div>

  return (
    <div className="card">
      <h2>Assessment Report</h2>
      <p><strong>Risk Level:</strong> <span className={`badge ${data.riskLevel}`}>{data.riskLevel}</span></p>
      <p><strong>Score:</strong> {data.riskScore}</p>
      <h3>Summary</h3>
      <p>{data.summary}</p>
      <h3>Vulnerabilities</h3>
      <ul>{data.vulnerabilities.map((v, i)=> <li key={i}>{v}</li>)}</ul>
      <h3>Recommendations</h3>
      <ul>{data.recommendations.map((r, i)=> <li key={i}>{r}</li>)}</ul>
      <div className="row">
        <button className="btn" onClick={downloadPdf}>Download PDF</button>
        <button className="btn" onClick={()=>nav('/dashboard')}>Back to Dashboard</button>
      </div>
    </div>
  )
}
