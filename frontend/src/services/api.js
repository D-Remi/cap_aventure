import axios from 'axios'

// En production : pointe vers le backend Railway
// En développement : le proxy Vite redirige /api → localhost:3001
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
})

// Injecter le token JWT automatiquement sur chaque requête
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('cap_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Gérer les erreurs 401 globalement (token expiré)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('cap_token')
      localStorage.removeItem('cap_user')
      // Rediriger vers login si pas déjà dessus
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export default api
