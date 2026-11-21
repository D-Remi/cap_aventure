import './Etapes.css'

const ETAPES = [
  { t: 'On s\'appelle', d: 'Trente minutes, gratuites, par téléphone ou WhatsApp. Vous me racontez votre situation, je vous dis franchement si je suis la bonne personne.' },
  { t: 'Je viens vous rencontrer', d: 'Une heure et demie chez vous, avec votre enfant. On remplit ensemble sa fiche : habitudes, ce qui l\'apaise, ce qui le déclenche, son traitement s\'il en a un.' },
  { t: 'On commence doucement', d: 'Les premières gardes sont plus courtes, le temps que votre enfant me connaisse et prenne ses repères avec moi.' },
  { t: 'Je vous raconte', d: 'À votre retour, ou par message dans votre espace famille : repas, humeur, activités, moments difficiles. Vous savez tout.' },
]

export default function Etapes() {
  return (
    <section className="ev-section ev-section--forest ev-steps">
      <div className="ev-container">
        <div className="ev-head ev-reveal">
          <span className="ev-kicker">Comment ça se passe</span>
          <h2>Rien n'est improvisé. <em>Tout se prépare avec vous.</em></h2>
        </div>
        <ol className="ev-steps__list">
          {ETAPES.map(({ t, d }, i) => (
            <li key={t} className="ev-reveal" style={{ transitionDelay: `${i * 90}ms` }}>
              <span className="ev-steps__n">0{i + 1}</span>
              <h3>{t}</h3>
              <p>{d}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
