import React, { createContext, useContext, useEffect, useState } from 'react'
import { login as apiLogin, register as apiRegister } from '../services/auth.js'

const AuthCtx = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token'))
  const [user, setUser] = useState(null)

  function setAuth(t) {
    setToken(t)
    if (t) localStorage.setItem('token', t)
    else localStorage.removeItem('token')
  }

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
