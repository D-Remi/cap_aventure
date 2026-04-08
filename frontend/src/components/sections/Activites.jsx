import { useState, useEffect, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useReveal } from '../../hooks/useReveal'
import './Activites.css'

const ACTIVITES = [
  {
    slug: 'multi',
    img: 'https://images.unsplash.com/photo-1638202951770-2240942c7d1c?w=520&q=75',
    title: 'Multi-activités',
    desc: "Jeux collectifs, défis sportifs, sorties nature… Chaque sortie est différente ! Idéal pour s'amuser en groupe.",
    tag: '🔥 Toute saison',
    tagBg: '#ffedd5', tagColor: '#c2410c',
  },
  {
    slug: 'vtt',
    img: 'https://images.unsplash.com/photo-1544191696-15693072e0c0?w=520&q=75',
    title: 'VTT & Vélo',
    desc: "Sorties VTT accompagnées sur les chemins du Chablais et les bords du lac Léman. On roule ensemble, à son rythme !",
    tag: '🚵 Printemps / Été',
    tagBg: '#dcfce7', tagColor: '#166534',
  },
  {
    slug: 'club',
    img: 'https://images.unsplash.com/photo-1741421963851-2ab751f036bb?w=520&q=75',
    title: 'Club Scout',
    desc: "Jeux en forêt, techniques scouts, sorties nature dans le Chablais. Un groupe soudé, chaque samedi matin.",
    tag: '📅 Samedi matin',
    tagBg: '#ede9fe', tagColor: '#5b21b6',
  },
  {
    slug: 'velo',
    img: 'https://images.unsplash.com/photo-1452421822248-d4c2b47f0c81?w=520&q=75',
    title: 'Vélo École',
    desc: "Apprendre à faire du vélo en petit groupe (3–5 enfants), à son rythme, dans un espace sécurisé.",
    tag: '🚲 4–10 ans',
    tagBg: '#d1fae5', tagColor: '#065f46',
  },
  {
    slug: 'evenements',
    img: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=520&q=75',
    title: 'Accompagnement Événements',
    desc: "Anniversaires, sorties, kermesses… J'encadre et j'anime votre groupe d'enfants pour que la fête soit réussie !",
    tag: '🎉 Sur demande',
    tagBg: '#fef9c3', tagColor: '#854d0e',
  },
]

function getVisible(width) {
  if (width < 400) return 1
  if (width < 640) return 2
  if (width < 920) return 3
  return 4
}

export default function Activites() {
  const ref          = useReveal()
  const trackRef     = useRef(null)
  const wrapRef      = useRef(null)
  const autoRef      = useRef(null)
  const startXRef    = useRef(0)
  const isDragging   = useRef(false)
  const [current, setCurrent]   = useState(0)
  const [visible, setVisible]   = useState(4)
  const [hinted, setHinted]     = useState(false)

  const steps = Math.max(0, ACTIVITES.length - visible)

  const applyTranslate = useCallback((idx) => {
    if (!trackRef.current) return
    const cards = trackRef.current.querySelectorAll('.act-card')
    if (!cards.length) return
    const cardW = cards[0].offsetWidth + 16
    trackRef.current.style.transform = `translateX(${-idx * cardW}px)`
  }, [])

  const go = useCallback((idx) => {
    const clamped = Math.max(0, Math.min(idx, steps))
    setCurrent(clamped)
    applyTranslate(clamped)
    clearInterval(autoRef.current)
    autoRef.current = setInterval(() => {
      setCurrent(prev => {
        const next = prev >= steps ? 0 : prev + 1
        applyTranslate(next)
        return next
      })
    }, 4000)
  }, [steps, applyTranslate])

  const resetAuto = useCallback(() => {
    clearInterval(autoRef.current)
    autoRef.current = setInterval(() => {
      setCurrent(prev => {
        const next = prev >= steps ? 0 : prev + 1
        applyTranslate(next)
        return next
      })
    }, 4000)
  }, [steps, applyTranslate])

  useEffect(() => { resetAuto(); return () => clearInterval(autoRef.current) }, [resetAuto])

  useEffect(() => {
    const obs = new ResizeObserver(entries => {
      setVisible(getVisible(entries[0].contentRect.width))
    })
    if (wrapRef.current) obs.observe(wrapRef.current)
    return () => obs.disconnect()
  }, [])

  useEffect(() => { applyTranslate(current) }, [visible, current, applyTranslate])

  useEffect(() => {
    if (hinted || steps === 0) return
    const t = setTimeout(() => {
      if (!trackRef.current) return
      const cards = trackRef.current.querySelectorAll('.act-card')
      if (!cards.length) return
      const peek = Math.min(cards[0].offsetWidth * 0.35, 110)
      trackRef.current.style.transition = 'transform 0.55s cubic-bezier(.4,0,.2,1)'
      trackRef.current.style.transform = `translateX(-${peek}px)`
      setTimeout(() => {
        if (!trackRef.current) return
        trackRef.current.style.transform = 'translateX(0px)'
        setTimeout(() => { if (trackRef.current) trackRef.current.style.transition = 'transform 0.38s cubic-bezier(.4,0,.2,1)' }, 560)
      }, 700)
      setHinted(true)
    }, 1200)
    return () => clearTimeout(t)
  }, [hinted, steps])

  const onTouchStart = (e) => { startXRef.current = e.touches[0].clientX; clearInterval(autoRef.current) }
  const onTouchEnd   = (e) => { const dx = e.changedTouches[0].clientX - startXRef.current; if (Math.abs(dx) > 40) go(dx < 0 ? current + 1 : current - 1); else resetAuto() }
  const onMouseDown  = (e) => { startXRef.current = e.clientX; isDragging.current = true; clearInterval(autoRef.current) }
  const onMouseUp    = (e) => { if (!isDragging.current) return; const dx = e.clientX - startXRef.current; if (Math.abs(dx) > 40) go(dx < 0 ? current + 1 : current - 1); else resetAuto(); isDragging.current = false }

  return (
    <section className="activites section" id="activites" ref={ref}>
      <div className="container">
        <div className="section-header">
          <span className="section-tag">Ce qu'on fait</span>
          <h2>Les activités CapAventure</h2>
          <p>Des sorties adaptées aux 6–14 ans, encadrées par un animateur diplômé BAFA, autour de Thonon-les-Bains.</p>
        </div>

        <div className="carousel-outer">
          <div className="carousel-wrap" ref={wrapRef}>
            <div className="carousel-track" ref={trackRef}
              onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}
              onMouseDown={onMouseDown} onMouseUp={onMouseUp} onMouseLeave={() => { isDragging.current = false }}>
              {ACTIVITES.map((a) => (
                <div key={a.slug} className="act-card">
                  <div className="act-card__img">
                    <img src={a.img} alt={a.title} loading="lazy" draggable="false" />
                    <span className="act-card__tag" style={{ background: a.tagBg, color: a.tagColor }}>{a.tag}</span>
                  </div>
                  <div className="act-card__body">
                    <h3>{a.title}</h3>
                    <p>{a.desc}</p>
                    <Link to={`/activites-info/${a.slug}`} className="act-card__link">En savoir plus →</Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {current > 0 && <button className="carousel-arrow carousel-arrow--left" onClick={() => go(current - 1)}>‹</button>}
          {current < steps && <button className="carousel-arrow carousel-arrow--right" onClick={() => go(current + 1)}>›</button>}
        </div>

        <div className="carousel-nav">
          <div className="carousel-dots">
            {Array.from({ length: steps + 1 }).map((_, i) => (
              <button key={i} className={`carousel-dot ${i === current ? 'active' : ''}`} onClick={() => go(i)} />
            ))}
          </div>
          <div className="carousel-progress">
            <div className="carousel-progress__bar" style={{ width: `${steps === 0 ? 100 : (current / steps) * 100}%` }} />
          </div>
        </div>

        <div className="activites__cta">
          <div className="activites__cta-badge">📅 Dates disponibles sur demande</div>
          <p>Les activités sont ouvertes à l'inscription. Contacte-nous pour connaître les prochaines dates !</p>
          <a href="#contact" className="btn-primary" onClick={e => { e.preventDefault(); document.getElementById('contact')?.scrollIntoView({ behavior:'smooth' }) }}>Demander les dates</a>
        </div>
      </div>
    </section>
  )
}
