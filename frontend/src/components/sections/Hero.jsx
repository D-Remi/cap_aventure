import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import './Hero.css'

export default function Hero() {
  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="hero">
      <div className="hero__overlay" />

      <div className="hero__content">
        <div className="hero__badge">🏔️ Haute-Savoie · 6–14 ans</div>

        <h1 className="hero__title">
          Cap<span>Aventure</span>
        </h1>

        <p className="hero__sub">
          Des activités outdoor encadrées pour les enfants,<br />
          les mercredis, week-ends et vacances scolaires
        </p>

        <div className="hero__cta">
          <button className="btn-primary" onClick={() => scrollTo('contact')}>
            Je rejoins la liste
          </button>
          <button className="btn-ghost" onClick={() => scrollTo('activites')}>
            Découvrir les activités
          </button>
        </div>

        <div className="hero__stats">
          <div className="hero__stat">
            <span className="hero__stat-num">6–14</span>
            <span className="hero__stat-label">ans</span>
          </div>
          <div className="hero__stat-sep" />
          <div className="hero__stat">
            <span className="hero__stat-num">4</span>
            <span className="hero__stat-label">activités</span>
          </div>
          <div className="hero__stat-sep" />
          <div className="hero__stat">
            <span className="hero__stat-num">74</span>
            <span className="hero__stat-label">Haute-Savoie</span>
          </div>
        </div>
      </div>

      <div className="hero__wave" />
    </section>
  )
}
