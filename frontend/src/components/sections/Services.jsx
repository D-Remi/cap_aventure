import './Services.css'

const RELAIS_POUR = [
  "Vous avez besoin d'une garde ponctuelle, à la journée ou pour quelques heures",
  "Vous élevez plusieurs enfants et vous n'avez jamais un moment à vous",
  "Vous êtes seul(e) ou sans relais familial autour de vous",
  "Votre enfant a des besoins spécifiques (handicap, TSA, TDAH, troubles du comportement)",
]

export default function Services({ onContact }) {
  return (
    <section className="services" id="services">
      <div className="container">

        <div className="section-head">
          <span className="section-head__kicker">Un service de garde d'enfant</span>
          <h2>Ce que je propose</h2>
          <p>
            Une garde d'enfant de confiance, en Haute-Savoie, quand vous en avez besoin —
            à la journée ou pour quelques heures.
          </p>
        </div>

        {/* SERVICE UNIQUE — GARDE / RELAIS */}
        <article className="svc svc--repit" id="repit">
          <div className="svc__photo">
            <img
              src="https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=900&q=80"
              alt="Garde d'enfant occasionnelle et de confiance en Haute-Savoie"
              loading="lazy"
            />
          </div>
          <div className="svc__body">
            <span className="svc__tag">Garde d'enfant · Relais à la journée</span>
            <h3>Une garde de confiance, quand vous en avez besoin</h3>
            <p className="svc__desc">
              Un rendez-vous, un imprévu, une journée pour souffler, ou simplement besoin
              d'un relais de confiance : je prends le relais auprès de votre enfant, à la
              journée ou pour quelques heures. Une garde occasionnelle assurée par un
              éducateur, à l'aise aussi bien avec une fratrie nombreuse qu'avec des enfants
              aux besoins spécifiques.
            </p>
            <div className="svc__for">
              <span className="svc__lbl">Ce service s'adresse à vous si</span>
              <ul>{RELAIS_POUR.map(t => <li key={t}>{t}</li>)}</ul>
            </div>
            <button className="svc__cta" onClick={() => onContact('repit')}>
              Demander une garde →
            </button>
          </div>
        </article>

      </div>
    </section>
  )
}
