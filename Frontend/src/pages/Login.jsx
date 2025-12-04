import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Login() {
  const { login } = useAuth()
  const nav = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  async function onSubmit(e) {
    e.preventDefault()
    setLoading(true)
    try {
      await login(username, password)
      nav('/dashboard')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card">
      <h2>Login</h2>
      <form onSubmit={onSubmit} className="form">
        <label>Username or Email<input value={username} onChange={e=>setUsername(e.target.value)} required /></label>
        <label>Password<input type="password" value={password} onChange={e=>setPassword(e.target.value)} required /></label>
        <button className="btn" disabled={loading}>{loading ? 'Logging in...' : 'Login'}</button>
      </form>
      <p>New here? <Link to="/register">Register</Link></p>
    </div>
  )
}
