import axios from 'axios'

// En dev : proxy Vite (/api → localhost:3001)
// En prod : VITE_API_URL si le backend est sur un autre domaine
const baseURL = import.meta.env.VITE_API_URL || ''

axios.defaults.baseURL = baseURL

// IMPORTANT : envoie les cookies (httpOnly) à chaque requête.
// Le token n'est plus dans localStorage (invisible au JS = protégé du vol XSS).
axios.defaults.withCredentials = true

// Pages publiques : un 401 n'y provoque JAMAIS de redirection.
// (le site vitrine doit rester accessible sans être connecté)
const PAGES_PUBLIQUES = ['/', '/services', '/documentation', '/confidentialite', '/login', '/register', '/mot-de-passe-oublie', '/reset-password']

function surPagePublique() {
  return PAGES_PUBLIQUES.includes(window.location.pathname)
}

// ── Refresh automatique du token ──────────────────────────────────
// Quand l'access token (15 min) expire, une requête renvoie 401.
// On tente alors UN refresh (via le cookie refresh_token), puis on
// rejoue la requête. Si le refresh échoue → déconnexion.
let refreshing = null

axios.interceptors.response.use(
  r => r,
  async err => {
    const status = err.response?.status
    const original = err.config || {}
    const url = original.url || ''

    // Ces routes ne doivent jamais déclencher de refresh ni de redirection :
    // - login/register : l'échec est une erreur de saisie normale
    // - refresh : évite la boucle
    // - me : simple vérification de session au démarrage (échoue si non connecté)
    // - logout : peut renvoyer 401 si déjà déconnecté
    const isAuthRoute =
      url.includes('/auth/login') ||
      url.includes('/auth/register') ||
      url.includes('/auth/refresh') ||
      url.includes('/auth/me') ||
      url.includes('/auth/logout')

    // 401 sur une route normale → on tente un refresh une seule fois
    if (status === 401 && !isAuthRoute && !original._retried) {
      original._retried = true
      try {
        refreshing = refreshing || axios.post('/api/auth/refresh')
        await refreshing
        refreshing = null
        return axios(original)   // rejoue la requête d'origine
      } catch (e) {
        refreshing = null
        // refresh échoué → session vraiment terminée.
        // On ne redirige QUE si on est sur une page privée (pas le site vitrine).
        if (!surPagePublique()) {
          window.location.href = '/login'
        }
        return Promise.reject(e)
      }
    }

    return Promise.reject(err)
  }
)

export default axios
