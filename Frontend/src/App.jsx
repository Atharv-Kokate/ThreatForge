import React from 'react'
import { Routes, Route, Navigate, Link } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Dashboard from './pages/Dashboard.jsx'
import NewAssessment from './pages/NewAssessment.jsx'
import Report from './pages/Report.jsx'
import Sidebar from './components/Sidebar.jsx'

function Protected({ children }) {
  const { token } = useAuth()
  if (!token) return <Navigate to="/login" replace />
  return children
}

export default function App() {
  return (
    <AuthProvider>
      <div className="app">
        <Sidebar />
        <main className="content">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Protected><Dashboard /></Protected>} />
            <Route path="/new" element={<Protected><NewAssessment /></Protected>} />
            <Route path="/report/:id" element={<Protected><Report /></Protected>} />
            <Route path="*" element={<div className="card"><h2>Not Found</h2><Link to="/dashboard">Go Home</Link></div>} />
          </Routes>
        </main>
      </div>
    </AuthProvider>
  )
}
