'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import {
  clearToken,
  getMe,
  getToken,
  setToken,
  type AuthResponse,
  type User,
} from '@/lib/api'

type AuthContextValue = {
  user: User | null
  loading: boolean
  setSession: (res: AuthResponse) => void
  logout: () => void
  displayName: string
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // On mount, try to restore the session from a stored token.
  useEffect(() => {
    const token = getToken()
    if (!token) {
      setLoading(false)
      return
    }
    getMe(token)
      .then((u) => setUser(u))
      .catch(() => {
        // Invalid/expired token: treat as logged out without crashing.
        clearToken()
        setUser(null)
      })
      .finally(() => setLoading(false))
  }, [])

  const setSession = useCallback((res: AuthResponse) => {
    setToken(res.access_token)
    setUser(res.user)
  }, [])

  const logout = useCallback(() => {
    clearToken()
    setUser(null)
  }, [])

  const displayName = user
    ? user.type_compte === 'institution'
      ? user.nom_institution || user.email
      : [user.prenom, user.nom].filter(Boolean).join(' ') || user.email
    : ''

  return (
    <AuthContext.Provider
      value={{ user, loading, setSession, logout, displayName }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
