import axios from 'axios'

// En dev : proxy Vite (/api → localhost:3001)
// En prod : VITE_API_URL si le backend est sur un autre domaine
const baseURL = import.meta.env.VITE_API_URL || ''

// Configuration de l'instance axios globale.
// Tous les composants utilisent `axios` directement, donc on configure
// l'instance par défaut plutôt qu'une instance séparée.
axios.defaults.baseURL = baseURL

// Injection du token à chaque requête, depuis localStorage.
// Cela couvre le rechargement de page et les onglets multiples.
axios.interceptors.request.use(config => {
  const token = localStorage.getItem('cap_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Déconnexion automatique si le token est invalide ou expiré.
// On ignore la route de login pour ne pas boucler.
axios.interceptors.response.use(
  r => r,
  err => {
    const status = err.response?.status
    const url    = err.config?.url || ''
    const isAuthRoute = url.includes('/auth/login') || url.includes('/auth/register')

    if (status === 401 && !isAuthRoute) {
      localStorage.removeItem('cap_token')
      localStorage.removeItem('cap_user')
      if (!window.location.pathname.startsWith('/login')) {
        window.location.href = '/login'
      }
    }
    return Promise.reject(err)
  }
)

export default axios
