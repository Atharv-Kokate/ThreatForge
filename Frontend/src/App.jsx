
import React from 'react'
import { Routes, Route, Navigate, Link, Outlet } from 'react-router-dom'
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

function Layout() {
  return (
    <div className="app">
      <Sidebar />
      <main className="content">
        <Outlet />
      </main>
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public Routes - Full Screen */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected app routes - With Sidebar */}
        <Route element={<Protected><Layout /></Protected>}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/new" element={<NewAssessment />} />
          <Route path="/report/:id" element={<Report />} />
        </Route>

        {/* Catch all */}
        <Route path="*" element={<div className="card"><h2>Not Found</h2><Link to="/dashboard">Go Home</Link></div>} />
      </Routes>
    </AuthProvider>
  )
}
