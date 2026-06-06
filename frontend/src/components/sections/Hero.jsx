import './Hero.css'
export default function Hero() {
  const s = (id) => document.getElementById(id)?.scrollIntoView({behavior:'smooth'})
  return (
    <section className="hero">
      <div className="hero__content">
        <div className="hero__badge">🌲 Biganos · Bassin d'Arcachon · Animateur BAFA</div>
        <h1 className="hero__title">Cap<span>Aventure</span></h1>
        <p className="hero__tagline">Garde, répit et animation pour vos enfants</p>
        <p className="hero__sub">Un accompagnement bienveillant et personnalisé,<br/>dans la nature du Bassin d'Arcachon</p>
        <div className="hero__cta">
          <button className="btn-primary" onClick={()=>s('services')}>Découvrir les services</button>
          <button className="btn-ghost" onClick={()=>s('contact')}>Nous contacter</button>
        </div>
        <div className="hero__pills">
          <span className="hero__pill">🏠 Garde à domicile</span>
          <span className="hero__pill">🌿 Répit TSA · TDAH</span>
          <span className="hero__pill">🎉 Animation événements</span>
        </div>
      </div>
      <div className="hero__wave"/>
    </section>
  )
}