import { Link } from 'react-router-dom'
import './Activites.css'

const ACTIVITES = [
  {
    img: 'https://images.unsplash.com/photo-1754287425584-e54336294cbb?w=600&q=80',
    title: 'Ski & Montagne',
    desc: "Demi-journées ou journées sur les pistes avec encadrement. Initiation pour les débutants, perfectionnement pour les autres.",
    tag: '❄️ Hiver',
    tagColor: '#5bbde4',
  },
  {
    img: 'https://images.unsplash.com/photo-1544191696-102dbdaeeaa0?w=600&q=80',
    title: 'VTT & Vélo',
    desc: "Sorties VTT sur les chemins et sentiers de Haute-Savoie. Du plaisir, de la technique et de belles découvertes.",
    tag: '🌿 Printemps / Été',
    tagColor: '#4ecb71',
  },
  {
    img: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=600&q=80',
    title: 'Randonnée',
    desc: "Des balades adaptées à l'âge pour explorer forêts, alpages et sommets. Observation de la faune et de la flore.",
    tag: '🏔️ Toute saison',
    tagColor: '#f5c842',
  },
  {
    img: 'https://images.unsplash.com/photo-1638202951770-2240942c7d1c?w=600&q=80',
    title: 'Multi activités',
    desc: "Jeux variés, défis sportifs, ateliers créatifs et moments de détente… Pour découvrir plein d'activités, s'amuser ensemble et développer de nouvelles passions.",
    tag: '🔥 Toute saison',
    tagColor: '#f07d2a',
  },
]

export default function Activites() {
  return (
    <section className="activites" id="activites">
      <div className="container">
        <span className="section-tag">Ce qu'on fait</span>
        <h2 className="section-title">Les <span>activités</span> au programme</h2>

        <div className="activites__grid">
          {ACTIVITES.map((a) => (
            <div key={a.title} className="activite-card reveal">
              <div className="activite-card__img">
                <img src={a.img} alt={a.title} />
              </div>
              <div className="activite-card__body">
                <h3>{a.title}</h3>
                <p>{a.desc}</p>
                <span className="activite-card__tag" style={{ '--tag-color': a.tagColor }}>
                  {a.tag}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
