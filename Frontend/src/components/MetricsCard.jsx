import React from 'react'

export default function MetricsCard({ title, value, percentage, trend, icon }) {
  return (
    <div className="metrics-card">
      <div className="metrics-card-header">
        <span className="metrics-card-title">{title}</span>
        {icon && <span className="metrics-card-icon">{icon}</span>}
      </div>
      <div className="metrics-card-value">{value}</div>
      {percentage !== undefined && (
        <div className="metrics-card-progress">
          <div className="chartbar">
            <div className="fill" style={{ width: `${Math.min(100, Math.max(0, percentage))}%` }} />
          </div>
          <span className="metrics-card-percentage">{percentage}%</span>
        </div>
      )}
      {trend && <div className="metrics-card-trend">{trend}</div>}
    </div>
  )
}

