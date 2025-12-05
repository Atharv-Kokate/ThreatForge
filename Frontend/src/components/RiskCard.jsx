import React from 'react'
import SeverityBadge from './SeverityBadge.jsx'

export default function RiskCard({ severity, title, description, index }) {
  return (
    <div className="risk-card">
      <div className="risk-card-header">
        <SeverityBadge value={severity} />
        {index !== undefined && <span className="risk-card-index">#{index + 1}</span>}
      </div>
      {title && <h4 className="risk-card-title">{title}</h4>}
      {description && <p className="risk-card-description">{description}</p>}
    </div>
  )
}

