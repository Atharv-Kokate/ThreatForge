import React from 'react'

const COLORS = {
  critical: { bg: '#FDE7E9', text: '#D32F2F', border: '#F8BBD0' },
  high: { bg: '#FDECEA', text: '#D32F2F', border: '#F8BBD0' },
  medium: { bg: '#FFF4E5', text: '#ED6C02', border: '#FFE0B2' },
  low: { bg: '#E8F5E9', text: '#2E7D32', border: '#C8E6C9' },
  unknown: { bg: '#E3F2FD', text: '#0052CC', border: '#BBDEFB' }
}

export default function SeverityBadge({ value }) {
  const sev = (value || 'unknown').toLowerCase()
  const colors = COLORS[sev] || COLORS.unknown

  return (
    <span
      className="severity-badge"
      style={{
        background: colors.bg,
        color: colors.text,
        borderColor: colors.border
      }}
    >
      {sev.toUpperCase()}
    </span>
  )
}


