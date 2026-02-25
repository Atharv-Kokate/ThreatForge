
import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Shield, Lock, Mail, ArrowRight, Loader2 } from 'lucide-react'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(username, password)
      navigate('/dashboard')
    } catch (err) {
      setError('Invalid credentials. Please check your username and password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-form-box fade-in">
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(37, 99, 235, 0.1)', color: 'var(--primary)', marginBottom: '16px' }}>
            <Shield size={32} />
          </div>
          <h2 style={{ marginBottom: '8px' }}>Welcome Back</h2>
          <p className="text-muted">Sign in to OWASP Risk Assessment</p>
        </div>

        <form onSubmit={handleSubmit}>
          {error && (
            <div className="badge critical" style={{ width: '100%', marginBottom: '20px', padding: '12px', textAlign: 'center', display: 'block' }}>
              {error}
            </div>
          )}

          <div className="form-group">
            <label>Username / Email</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: '#94a3b8' }} />
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="name@gmail.com"
                style={{ paddingLeft: '40px' }}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: '#94a3b8' }} />
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{ paddingLeft: '40px' }}
                required
              />
            </div>
          </div>

          <div className="flex justify-between items-center mb-4">
            <label className="flex items-center gap-2" style={{ marginBottom: 0, cursor: 'pointer' }}>
              <input type="checkbox" style={{ width: 'auto' }} />
              <span className="text-secondary text-sm">Remember me</span>
            </label>
            <a href="#" className="text-sm" style={{ color: 'var(--primary)', textDecoration: 'none' }}>Forgot password?</a>
          </div>

          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? <Loader2 className="spinner" size={18} /> : <>Sign In <ArrowRight size={18} /></>}
          </button>
        </form>

        <div style={{ marginTop: '24px', textAlign: 'center' }}>
          <p className="text-sm text-secondary">
            Don't have an account? <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 500, textDecoration: 'none' }}>Register</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
