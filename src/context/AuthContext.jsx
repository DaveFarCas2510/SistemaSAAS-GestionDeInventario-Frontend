import { createContext, useContext, useState, useCallback } from 'react'
import { loginApi } from '../api/authApi'

const AuthContext = createContext(null)

// Minimal JWT payload decoder (no library needed)
function decodeToken(token) {
  try {
    const payload = token.split('.')[1]
    const decoded = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')))
    return decoded
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token'))
  const [user, setUser] = useState(() => {
    const t = localStorage.getItem('token')
    return t ? decodeToken(t) : null
  })

  const login = useCallback(async (username, password) => {
    const res = await loginApi({ username, password })
    const { token: newToken } = res.data
    localStorage.setItem('token', newToken)
    const decoded = decodeToken(newToken)
    setToken(newToken)
    setUser(decoded)
    return decoded
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('token')
    setToken(null)
    setUser(null)
  }, [])

  const isAdmin = user?.role === 'ADMIN' || user?.roles?.includes('ROLE_ADMIN')

  return (
    <AuthContext.Provider value={{ token, user, isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
