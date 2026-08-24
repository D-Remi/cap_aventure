import { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)
  const [loading, setLoading] = useState(true)

  // Restauration de session au chargement.
  // Plus de localStorage : l'authentification repose sur le cookie httpOnly
  // (invisible au JS, donc protégé du vol XSS). On demande simplement au
  // serveur qui on est ; si le cookie est valide, il renvoie l'utilisateur.
  useEffect(() => {
    axios.get('/api/auth/me')
      .then(({ data }) => setUser(data.user))
      .catch(() => setUser(null))     // pas de session valide
      .finally(() => setLoading(false))
  }, [])

  const login = async (email, password) => {
    // le serveur pose les cookies ; la réponse ne contient que l'utilisateur
    const { data } = await axios.post('/api/auth/login', { email, password })
    setUser(data.user)
    return data.user
  }

  const register = async (payload) => {
    const { data } = await axios.post('/api/auth/register', payload)
    setUser(data.user)
    return data.user
  }

  const logout = async () => {
    // révoque le refresh token côté serveur et efface les cookies
    try { await axios.post('/api/auth/logout') } catch { /* ignore */ }
    setUser(null)
    window.location.href = '/'
  }

  // Déconnexion de tous les appareils (révoque toutes les sessions)
  const logoutAll = async () => {
    try { await axios.post('/api/auth/logout-all') } catch { /* ignore */ }
    setUser(null)
    window.location.href = '/'
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, logoutAll }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
