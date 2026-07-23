import { Link } from 'react-router-dom'
import './Hero.css'

export default function Hero() {
  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

  return (
    <header className="hero">
      <div className="container">
        <div className="hero__pill">
          <span className="hero__dot" />
          Éducateur en lieu de vie · <b>6 enfants au quotidien</b>
        </div>

        <h1 className="hero__title">
          Quand la famille a besoin <span>d'un vrai relais.</span>
        </h1>

        <p className="hero__lead">
          Éducateur spécialisé, j'accompagne des enfants au quotidien en lieu de vie.
          Je propose deux services aux familles de Gironde : du répit pour les parents
          d'enfants en situation de handicap, et un accompagnement éducatif pour celles
          qui n'en peuvent plus.
        </p>

        <div className="hero__btns">
          <Link to="/contact" className="btn-primary">Prendre contact</Link>
          <button className="btn-ghost" onClick={() => scrollTo('services')}>
            Voir les deux services
          </button>
        </div>

        <div className="hero__stats">
          <div className="hero__stat"><b>6</b><span>enfants suivis chaque jour</span></div>
          <div className="hero__stat"><b>7j/7</b><span>en lieu de vie</span></div>
          <div className="hero__stat"><b>2</b><span>services distincts</span></div>
          <div className="hero__stat"><b>0€</b><span>le premier échange</span></div>
        </div>
      </div>
    </header>
  )
}
