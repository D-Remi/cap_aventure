// Met à jour le titre et la description de la page (et leurs équivalents Open Graph).
export function setMeta(title, description) {
  document.title = title
  const set = (selector, value) => {
    const el = document.querySelector(selector)
    if (el && value) el.setAttribute('content', value)
  }
  set('meta[name="description"]', description)
  set('meta[property="og:title"]', title)
  set('meta[property="og:description"]', description)
}
