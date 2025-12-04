import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Sidebar() {
  const { token, logout } = useAuth()
  const loc = useLocation()
  return (
    <aside className="sidebar">
      <div className="brand">OWASP Risk Analyzer</div>
      <nav>
        <Link className={loc.pathname.includes('dashboard') ? 'active' : ''} to="/dashboard">Dashboard</Link>
        <Link className={loc.pathname.includes('new') ? 'active' : ''} to="/new">New Assessment</Link>
        <Link to="/dashboard">History</Link>
      </nav>
      <div className="spacer" />
      {token ? <button className="btn" onClick={logout}>Logout</button> : <Link className="btn" to="/login">Login</Link>}
    </aside>
  )
}
