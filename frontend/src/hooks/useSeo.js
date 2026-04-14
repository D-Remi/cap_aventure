// Hook SEO — met à jour title + description dynamiquement
import { useEffect } from 'react'

export function useSeo({ title, description, canonical }) {
  useEffect(() => {
    const base = 'CapAventure — Activités outdoor enfants Thonon-les-Bains'

    // Title
    document.title = title ? `${title} | CapAventure Thonon` : base

    // Description
    const metaDesc = document.querySelector('meta[name="description"]')
    if (metaDesc && description) metaDesc.setAttribute('content', description)

    // OG title
    const ogTitle = document.querySelector('meta[property="og:title"]')
    if (ogTitle) ogTitle.setAttribute('content', title || base)

    // OG description
    const ogDesc = document.querySelector('meta[property="og:description"]')
    if (ogDesc && description) ogDesc.setAttribute('content', description)

    // Canonical
    const link = document.querySelector('link[rel="canonical"]')
    if (link && canonical) link.setAttribute('href', `https://capaventure74.fun${canonical}`)

    // OG url
    const ogUrl = document.querySelector('meta[property="og:url"]')
    if (ogUrl && canonical) ogUrl.setAttribute('content', `https://capaventure74.fun${canonical}`)
  }, [title, description, canonical])
}
