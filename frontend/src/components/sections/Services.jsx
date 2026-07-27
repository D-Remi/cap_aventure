import './Services.css'

const RELAIS_POUR = [
  "Vous avez besoin d'une garde ponctuelle, à la journée ou pour quelques heures",
  "Vous élevez plusieurs enfants et vous n'avez jamais un moment à vous",
  "Vous êtes seul(e) ou sans relais familial autour de vous",
  "Votre enfant a des besoins spécifiques (handicap, TSA, TDAH, troubles du comportement)",
]

const ACC_POUR = [
  "La relation avec votre enfant s'est tendue et vous ne savez plus par où reprendre",
  "Chaque demande se transforme en conflit ou en négociation sans fin",
  "Vous cherchez quelqu'un pour vous épauler sur ce qui vous dépasse",
  "Vous êtes épuisé et vous aimeriez retrouver des journées plus sereines",
]

export default function Services({ onContact }) {
  return (
    <section className="services" id="services">
      <div className="container">

        <div className="section-head">
          <span className="section-head__kicker">Deux besoins, deux réponses</span>
          <h2>Ce que je propose</h2>
          <p>
            Chaque situation familiale est différente. Voici les deux formes
            d'accompagnement que je propose, avec une approche adaptée à chacune.
          </p>
        </div>

        {/* SERVICE 1 — RELAIS À LA JOURNÉE */}
        <article className="svc svc--repit" id="repit">
          <div className="svc__photo">
            <img
              src="https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=900&q=80"
              alt="Moment de jeu apaisé"
              loading="lazy"
            />
          </div>
          <div className="svc__body">
            <span className="svc__tag">Service 01 · Relais</span>
            <h3>Le relais à la journée, quand vous en avez besoin</h3>
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
              Demander un relais →
            </button>
          </div>
        </article>

        {/* SERVICE 2 — ACCOMPAGNEMENT */}
        <article className="svc svc--acc" id="accompagnement">
          <div className="svc__photo">
            <img
              src="https://images.unsplash.com/photo-1661025208052-f4f54db8d743?q=80&w=1170&auto=format&fit=crop"
              alt="Échange en famille"
              loading="lazy"
            />
          </div>
          <div className="svc__body">
            <span className="svc__tag">Service 02 · Accompagnement</span>
            <h3>Retrouver un cadre qui tient</h3>
            <p className="svc__desc">
              Vous avez l'impression de ne plus rien maîtriser. Les crises s'enchaînent,
              votre enfant ne vous écoute plus, et vous vous sentez seul face à ça.
              Ce n'est pas un manque d'amour ni de compétence : c'est un cadre à reconstruire.
              Et ça se travaille.
            </p>
            <div className="svc__for">
              <span className="svc__lbl">Ce service s'adresse à vous si</span>
              <ul>{ACC_POUR.map(t => <li key={t}>{t}</li>)}</ul>
            </div>
            <button className="svc__cta" onClick={() => onContact('accompagnement')}>
              En parler avec moi →
            </button>
          </div>
        </article>

      </div>
    </section>
  )
}
