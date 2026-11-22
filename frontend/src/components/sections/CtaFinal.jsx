import { img, P } from '../../data/photos'
import { waLink, TEL_AFFICHE, TEL_LIEN, EMAIL, IconeWhatsApp } from '../../data/contact'
import './CtaFinal.css'

export default function CtaFinal({ onContact, photo = P.lavaux, titre, texte, waTexte }) {
  return (
    <section className="ev-cta" id="contact">
      <img src={img(photo, 2000)} alt="" loading="lazy" aria-hidden="true" />
      <div className="ev-cta__veil" />
      <div className="ev-container ev-cta__grid">
        <div className="ev-reveal">
          <span className="ev-kicker">Premier échange gratuit</span>
          <h2>{titre || 'Trente minutes pour me raconter votre situation'}</h2>
          <p>{texte || "Sans jugement, sans engagement. Et si je ne suis pas la bonne personne, je vous le dirai franchement."}</p>
          <div className="ev-btns">
            <button className="ev-btn ev-btn--lime" onClick={() => onContact('repit')}>Prendre contact</button>
            <a className="ev-btn ev-btn--ghost-light" href={waLink(waTexte)} target="_blank" rel="noopener noreferrer">
              <IconeWhatsApp /> WhatsApp
            </a>
          </div>
        </div>
        <div className="ev-cta__card ev-reveal">
          <div><span>Téléphone et WhatsApp</span><a href={TEL_LIEN}>{TEL_AFFICHE}</a><small>Même numéro depuis la Suisse</small></div>
          <div><span>E-mail</span><a href={`mailto:${EMAIL}`}>{EMAIL}</a></div>
          <div><span>Secteur</span><b>Chablais (74) · Genève · Vaud</b></div>
        </div>
      </div>
    </section>
  )
}
