
import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Shield, LayoutDashboard, FilePlus, LogOut, User } from 'lucide-react'

export default function Sidebar() {
  const { logout, user } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="sidebar" style={{
      width: '260px',
      background: 'white',
      borderRight: '1px solid var(--border)',
      display: 'flex',
      flexDirection: 'column',
      padding: '30px',
      position: 'sticky',
      top: 0,
      height: '100vh'
    }}>
      {/* Brand */}
      <div className="flex items-center gap-2 mb-12" style={{ paddingLeft: '8px', paddingBottom: '30px' }}>
        <Shield className="text-primary" size={28} />
        <div>
          <div style={{ fontWeight: 'bold', fontSize: '20px' }}>OWASP Risks</div>
        </div>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `btn btn-block ${isActive ? 'btn-primary' : 'btn-ghost'}`
          }
          style={{ justifyContent: 'flex-start' }}
        >
          <LayoutDashboard size={20} /> Dashboard
        </NavLink>

        <NavLink
          to="/new"
          className={({ isActive }) =>
            `btn btn-block ${isActive ? 'btn-primary' : 'btn-ghost'}`
          }
          style={{ justifyContent: 'flex-start' }}
        >
          <FilePlus size={20} /> New Assessment
        </NavLink>
      </nav>

      {/* User Profile */}
      <div style={{
        borderTop: '1px solid var(--border)',
        paddingTop: '16px',
        marginTop: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}>
        <div className="flex items-center gap-3" style={{ padding: '0 8px' }}>
          <div style={{
            width: '32px', height: '32px',
            background: '#eff6ff', borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--primary)'
          }}>
            <User size={16} />
          </div>
          <div style={{ overflow: 'hidden' }}>
            <div style={{ fontSize: '14px', fontWeight: 500, whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{user?.email?.split('@')[0] || 'User'}</div>
            <div style={{ fontSize: '12px', color: '#64748b' }}>{user?.email || 'No email'}</div>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="btn btn-ghost btn-block"
          style={{ justifyContent: 'flex-start', color: '#ef4444' }}
        >
          <LogOut size={20} /> Sign Out
        </button>
      </div>
    </div>
  )
}
