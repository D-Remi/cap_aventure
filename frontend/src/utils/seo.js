const SITE = 'https://educetvous74.fr'

// Met à jour le titre, la description, l'adresse canonique et leurs équivalents Open Graph.
// L'adresse canonique suit la page affichée : sans ça, Google prend toutes les pages pour des copies de l'accueil.
export function setMeta(title, description, { image } = {}) {
  document.title = title
  const set = (selector, value) => {
    const el = document.querySelector(selector)
    if (el && value) el.setAttribute('content', value)
  }
  const url = SITE + (window.location.pathname === '/' ? '/' : window.location.pathname.replace(/\/$/, ''))
  set('meta[name="description"]', description)
  set('meta[property="og:title"]', title)
  set('meta[property="og:description"]', description)
  set('meta[property="og:url"]', url)
  set('meta[property="og:image"]', image || `${SITE}/og-image.png`)
  let canon = document.querySelector('link[rel="canonical"]')
  if (!canon) {
    canon = document.createElement('link')
    canon.setAttribute('rel', 'canonical')
    document.head.appendChild(canon)
  }
  canon.setAttribute('href', url)
}

// Données structurées propres à une page (articles…). Remplacées à chaque appel, retirées avec null.
export function setJsonLd(data) {
  const id = 'ev-jsonld-page'
  document.getElementById(id)?.remove()
  if (!data) return
  const s = document.createElement('script')
  s.type = 'application/ld+json'
  s.id = id
  s.textContent = JSON.stringify(data)
  document.head.appendChild(s)
}
