import './Hero.css'

export default function Hero({ onContact }) {
  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

  return (
    <header className="hero">
      <div className="container hero__grid">
        <div className="hero__text">
          <div className="hero__pill">
            <span className="hero__dot" />
            Éducateur en lieu de vie · <b>6 enfants au quotidien</b>
          </div>

          <h1 className="hero__title">
            Quand la famille a besoin <span>d'un vrai relais.</span>
          </h1>

          <p className="hero__lead">
            Éducateur spécialisé, j'accompagne des enfants au quotidien en lieu de vie.
            Je propose deux services aux familles de Gironde : un relais à la journée pour
            faire garder votre enfant en confiance, et un accompagnement éducatif pour les
            familles qui traversent une période difficile.
          </p>

          <div className="hero__btns">
            <button className="btn-primary" onClick={onContact}>Prendre contact</button>
            <button className="btn-ghost" onClick={() => scrollTo('services')}>
              Voir les deux services
            </button>
          </div>

        </div>

        <div className="hero__photos">
          <div className="hero__photo hero__photo--main">
            <img
              src="https://images.unsplash.com/photo-1476703993599-0035a21b17a9?w=900&q=80"
              alt="Moment calme entre un adulte et un enfant"
              loading="eager"
            />
          </div>
          <div className="hero__photo hero__photo--sub">
            <img
              src="https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=700&q=80"
              alt="Enfant jouant en extérieur"
              loading="lazy"
            />
          </div>
          <div className="hero__badge">
            <b>Sur mesure</b>
            <span>selon chaque famille</span>
          </div>
        </div>
      </div>
    </header>
  )
}
