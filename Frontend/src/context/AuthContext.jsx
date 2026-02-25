import React, { createContext, useContext, useEffect, useState } from 'react'
import { login as apiLogin, register as apiRegister } from '../services/auth.js'
import { jwtDecode } from 'jwt-decode'

const AuthCtx = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token'))
  const [user, setUser] = useState(null)

  function setAuth(t) {
    setToken(t)
    if (t) {
      localStorage.setItem('token', t)
      try {
        const decoded = jwtDecode(t)
        setUser({ email: decoded.sub, username: 'User' })
      } catch (e) {
        setUser(null)
      }
    } else {
      localStorage.removeItem('token')
      setUser(null)
    }
  }

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token)
        setUser({ email: decoded.sub, username: 'User' })
      } catch (e) {
        setUser(null)
      }
    }
  }, [token])

  async function login(username, password) {
    const t = await apiLogin(username, password)
    setAuth(t)
    return t
  }

  async function register(payload) {
    const res = await apiRegister(payload)
    return res
  }

  function logout() {
    setAuth(null)
  }

  return (
    <AuthCtx.Provider value={{ token, user, setUser, login, logout, register }}>
      {children}
    </AuthCtx.Provider>
  )
}

export function useAuth() {
  return useContext(AuthCtx)
}
