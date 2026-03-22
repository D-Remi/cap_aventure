import './Clubs.css'

const CLUBS = [
  {
    icon: '⛺',
    title: 'Club Initiation Scout',
    desc: 'Découvrir les valeurs et techniques scoutes, semaine après semaine',
  },
  {
    icon: '🚵',
    title: 'Club VTT Jeunes',
    desc: 'Progression technique, sorties régulières et esprit d\'équipe',
  },
  {
    icon: '🥾',
    title: 'Club Explorateurs',
    desc: 'Rando, orientation, observation nature — pour les aventuriers en herbe',
  },
]

export default function Clubs() {
  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

  return (
    <section className="clubs" id="clubs">
      <div className="container">
        <div className="clubs__inner reveal">
          <div className="clubs__text">
            <h2>Les mini-clubs <span>CapAventure</span></h2>
            <p>
              Au-delà des sorties ponctuelles, CapAventure propose aussi des clubs réguliers
              pour les enfants qui veulent aller plus loin, apprendre progressivement
              et créer des liens durables.
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
