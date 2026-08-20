import './BandeauCitation.css'

export default function BandeauCitation() {
  return (
    <div className="bandeau">
      <img
        src="https://images.unsplash.com/photo-1490730141103-6cac27aaab94?w=1600&q=80"
        alt="Lumière du matin — garde d'enfant en Haute-Savoie"
        loading="lazy"
      />
      <div className="bandeau__overlay" />
      <div className="bandeau__text">
        <div className="container">
          <p>« Vous n'êtes pas un mauvais parent. Vous êtes fatigué, et vous cherchez des réponses. »</p>
          <cite>Rémi, accompagnant éducatif</cite>
        </div>
      </div>
    </div>
  )
}
