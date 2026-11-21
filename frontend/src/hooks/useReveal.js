import { useEffect } from 'react'

// Fait apparaître en douceur les éléments .ev-reveal quand ils entrent à l'écran.
export default function useReveal(deps = []) {
  useEffect(() => {
    const els = document.querySelectorAll('.ev-reveal:not(.is-in)')
    if (!('IntersectionObserver' in window)) {
      els.forEach(e => e.classList.add('is-in'))
      return
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          en.target.classList.add('is-in')
          io.unobserve(en.target)
        }
      })
    }, { rootMargin: '0px 0px -6% 0px', threshold: 0.06 })
    els.forEach(e => io.observe(e))
    // Filet de sécurité : rien ne doit rester invisible si l'observateur ne se déclenche pas
    const t = setTimeout(() => els.forEach(e => e.classList.add('is-in')), 4000)
    return () => { io.disconnect(); clearTimeout(t) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}
