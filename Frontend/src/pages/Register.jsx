import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Register() {
  const { register } = useAuth()
  const nav = useNavigate()
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [loading, setLoading] = useState(false)

  async function onSubmit(e) {
    e.preventDefault()
    setLoading(true)
    try {
      await register({ email, username, password, full_name: fullName })
      alert('Registered. Please login.')
      nav('/login')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card">
      <h2>Register</h2>
      <form onSubmit={onSubmit} className="form">
        <label>Email<input type="email" value={email} onChange={e=>setEmail(e.target.value)} required /></label>
        <label>Username<input value={username} onChange={e=>setUsername(e.target.value)} required /></label>
        <label>Password<input type="password" value={password} onChange={e=>setPassword(e.target.value)} required /></label>
        <label>Full Name<input value={fullName} onChange={e=>setFullName(e.target.value)} /></label>
        <button className="btn" disabled={loading}>{loading ? 'Registering...' : 'Register'}</button>
      </form>
      <p>Have an account? <Link to="/login">Login</Link></p>
    </div>
  )
}
