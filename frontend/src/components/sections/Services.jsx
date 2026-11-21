import { Link } from 'react-router-dom'
import { img, P } from '../../data/photos'
import MentionsPrix from './MentionsPrix'
import './Services.css'

const POUR_VOUS = [
  "Votre enfant a un TSA, un TDAH, un handicap ou des troubles du comportement, et les baby-sitters déclinent",
  "Vous n'avez pas eu une soirée à vous depuis des mois",
  "Vous élevez seul(e) vos enfants, ou sans famille autour de vous",
  "Vous avez un rendez-vous médical et personne pour la fratrie",
  "Vous travaillez en Suisse et vos journées débordent",
]

const FORMULES = [
  {
    key: 'souffle', phare: true, tag: 'Le plus choisi',
    titre: 'Souffle', sous: 'chaque semaine',
    prix: '40 €', unite: '/ heure', reel: "20 € l'heure pour vous",
    photo: P.blocs, alt: 'Un adulte et un enfant construisent une tour en blocs de bois',
    points: [
      'Le même créneau chaque semaine : mercredi, samedi, fin de journée…',
      'La même personne : les repères de votre enfant s\'installent',
      'Rencontre de préparation offerte',
      'Engagement de 3 mois, puis sans engagement',
    ],
    pied: 'Exemple : 4 h par semaine = 347 € par mois après crédit d\'impôt.',
    cta: 'Réserver un créneau',
  },
  {
    key: 'relais', tag: 'Ponctuel',
    titre: 'Relais', sous: 'quand il faut',
    prix: '45 €', unite: '/ heure', reel: "22,50 € l'heure pour vous",
    photo: P.balade, alt: 'Un adulte et un enfant marchent ensemble dans les bois',
    points: [
      'Un rendez-vous, un imprévu, une journée pour vous',
      'Minimum 3 heures, réservé 48 h avant',
      'Journée répit de 8 h : 340 €, soit 170 € pour vous',
    ],
    pied: 'Urgence à moins de 24 h : 54 € l\'heure, selon mes disponibilités.',
    cta: 'Demander une garde',
  },
  {
    key: 'grand', tag: 'Rare et précieux',
    titre: 'Grand souffle', sous: 'nuit et week-end',
    prix: '790 €', unite: '/ week-end', reel: '395 € pour vous',
    photo: P.coucher, alt: 'Coucher de soleil sur le lac',
    points: [
      'Du samedi 9 h au dimanche 18 h',
      'Soirée + nuit (18 h → 9 h) : 260 €, soit 130 € pour vous',
      'Deux week-ends par mois au maximum',
    ],
    pied: 'Pour partir, dormir, ou fêter un anniversaire à deux.',
    cta: 'Réserver un week-end',
  },
]

export default function Services({ onContact }) {
  return (
    <section className="ev-section ev-svc" id="formules">
      <div className="ev-container">
        <div className="ev-svc__intro">
          <div className="ev-head ev-reveal">
            <span className="ev-kicker">La garde · le répit</span>
            <h2>Un éducateur chez vous, <em>pas juste un baby-sitter.</em></h2>
            <p>
              Toujours à votre domicile, dans les repères de votre enfant. Pour un rendez-vous,
              un imprévu, une journée à vous, ou un créneau fixe chaque semaine pour tenir sur la durée.
            </p>
          </div>
          <div className="ev-svc__pour ev-reveal">
            <span className="ev-svc__lbl">C'est pour vous si</span>
            <ul>{POUR_VOUS.map(t => <li key={t}>{t}</li>)}</ul>
          </div>
        </div>

        <div className="ev-svc__grid">
          {FORMULES.map((f, i) => (
            <article
              key={f.key}
              className={`ev-card ${f.phare ? 'ev-card--phare' : ''} ev-reveal`}
              style={{ transitionDelay: `${i * 90}ms` }}
            >
              <div className="ev-card__photo">
                <img src={img(f.photo, 800)} alt={f.alt} loading="lazy" />
                <span className="ev-card__tag">{f.tag}</span>
              </div>
              <div className="ev-card__body">
                <h3>{f.titre} <small>· {f.sous}</small></h3>
                <div className="ev-card__prix"><b>{f.prix}</b><span>{f.unite}</span></div>
                <div className="ev-card__reel">{f.reel}</div>
                <ul>{f.points.map(p => <li key={p}>{p}</li>)}</ul>
                <p className="ev-card__pied">{f.pied}</p>
                <button
                  className={`ev-btn ${f.phare ? 'ev-btn--lime' : 'ev-btn--ghost'}`}
                  onClick={() => onContact('repit')}
                >
                  {f.cta}
                </button>
              </div>
            </article>
          ))}
        </div>

        <div className="ev-svc__more ev-reveal">
          <p>Fratrie, déplacements, urgences, crédit d'impôt et avance immédiate : tout est détaillé.</p>
          <Link to="/tarifs" className="ev-arrow">Voir tous les tarifs</Link>
        </div>
        <MentionsPrix />
      </div>
    </section>
  )
}
