import './Clubs.css'

const CLUBS = [
  {
    icon: '🌲',
    title: 'Club Scout',
    desc: 'Techniques scoutes, jeux en forêt, bivouac et sorties nature dans le Chablais — chaque samedi matin',
  },
  {
    icon: '🛼',
    title: 'Club Roller',
    desc: 'Sorties régulières sur les bords du lac Léman — slalom, vitesse et progression à ton rythme',
  },
]

export default function Clubs() {
  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

  return (
    <section className="clubs" id="clubs">
      <div className="container">
        <div className="clubs__inner reveal">
          <div className="clubs__text">
            <h2>Les clubs <span>CapAventure</span></h2>
            <p>
              Au-delà des sorties ponctuelles, CapAventure propose des clubs réguliers
              pour les enfants qui veulent s'engager sur la durée, progresser et créer des liens durables.
            </p>
            <button className="btn-primary" onClick={() => scrollTo('contact')}>
              Je suis intéressé(e)
            </button>
          </div>

          <div className="clubs__list">
            {CLUBS.map((club) => (
              <div key={club.title} className="clubs__item">
                <span className="clubs__item-icon">{club.icon}</span>
                <div>
                  <h4>{club.title}</h4>
                  <p>{club.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
