import React from 'react'

export default function SectionWrapper({ title, subtitle, children, actions }) {
  return (
    <div className="section-wrapper">
      <div className="section-wrapper__header">
        <div>
          <h3>{title}</h3>
          {subtitle && <p className="section-wrapper__subtitle">{subtitle}</p>}
        </div>
        {actions && <div className="section-wrapper__actions">{actions}</div>}
      </div>
      <div className="section-wrapper__body">
        {children}
      </div>
    </div>
  )
}


