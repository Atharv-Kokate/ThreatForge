import React from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import { useNavigate } from 'react-router-dom'

export default function Navbar() {
  const { token, logout } = useAuth()
  const nav = useNavigate()

  return (
    <header className="navbar">
      <div className="navbar-content">
        <div className="navbar-brand">
          <h1>OWASP LLM Risk Desk</h1>
          <span className="navbar-subtitle">Enterprise Security Assessments</span>
        </div>
        {token && (
          <button className="btn-text" onClick={() => { logout(); nav('/login') }}>
            Logout
          </button>
        )}
      </div>
    </header>
  )
}

