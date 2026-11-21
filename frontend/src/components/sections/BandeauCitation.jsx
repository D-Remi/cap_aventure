import { img, P } from '../../data/photos'
import './BandeauCitation.css'

export default function BandeauCitation() {
  return (
    <section className="ev-quote" aria-label="Citation">
      <img src={img(P.banc, 2000)} alt="Un banc face au lac, au calme" loading="lazy" />
      <div className="ev-quote__veil" />
      <div className="ev-container ev-quote__inner ev-reveal">
        <span className="ev-quote__mark" aria-hidden="true">“</span>
        <p>Vous n'êtes pas un mauvais parent. Vous êtes fatigué, et vous cherchez des réponses.</p>
        <cite>Rémi, accompagnant éducatif</cite>
      </div>
    </section>
  )
}
