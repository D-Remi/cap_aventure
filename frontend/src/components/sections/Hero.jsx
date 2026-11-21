import { img, P } from '../../data/photos'
import './Hero.css'

export default function Hero({ onContact }) {
  return (
    <header className="ev-hero">
      <div className="ev-hero__glow" aria-hidden="true" />
      <div className="ev-container ev-hero__grid">
        <div className="ev-hero__text">
          <span className="ev-hero__pill"><i aria-hidden="true" />Accompagnant éducatif · Chablais · Haute-Savoie</span>

          <h1 className="ev-hero__title">
            Votre enfant a des besoins particuliers.
            <span> Vous avez le droit de souffler.</span>
          </h1>

          <p className="ev-hero__lead">
            Autisme, TDAH, handicap, troubles du comportement ou fratrie nombreuse :
            je garde votre enfant chez vous, quelques heures, une journée ou chaque semaine.
            Thonon, Évian et tout le Chablais.
          </p>

          <div className="ev-btns">
            <button className="ev-btn ev-btn--lime" onClick={() => onContact('repit')}>
              Premier échange gratuit
            </button>
            <a className="ev-btn ev-btn--ghost-light" href="#formules">Voir les formules</a>
          </div>

          <ul className="ev-hero__proofs">
            <li><b>20 €</b><span>de l'heure après crédit d'impôt</span></li>
            <li><b>TSA · TDAH</b><span>séjours adaptés, polyhandicap</span></li>
            <li><b>30 min</b><span>de premier échange offertes</span></li>
          </ul>
        </div>

        <div className="ev-hero__visual">
          <figure className="ev-hero__main">
            <img
              src={img(P.foret, 1100)}
              alt="Un adulte et un enfant observent la mousse en forêt, moment calme en extérieur"
              loading="eager"
              fetchpriority="high"
            />
          </figure>
          <figure className="ev-hero__lake">
            <img src={img(P.lavaux, 700)} alt="Le Léman et les montagnes du Chablais" loading="eager" />
            <figcaption>Thonon · Évian · Chablais</figcaption>
          </figure>
          <div className="ev-hero__ticket">
            <span>Ce que vous payez vraiment</span>
            <div><b>20 €</b><small>/ heure</small><s>40 €</s></div>
            <em>Crédit d'impôt de 50 % déduit tout de suite</em>
          </div>
        </div>
      </div>
    </header>
  )
}
