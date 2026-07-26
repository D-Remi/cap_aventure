import './Services.css'

const REPIT_POUR = [
  "Vous élevez plusieurs enfants et vous n'avez jamais un moment à vous",
  "Vous êtes seul(e) ou sans relais familial autour de vous",
  "Votre enfant a des besoins spécifiques (handicap, TSA, TDAH, troubles du comportement)",
  "Vous avez besoin de souffler quelques heures, sans culpabiliser",
]

const ACC_POUR = [
  "Vous avez le sentiment de ne plus vous faire respecter",
  "Chaque demande se transforme en conflit ou en négociation sans fin",
  "Vous avez tout essayé : punitions, récompenses, discussions, cris",
  "Vous êtes épuisé et vous culpabilisez de l'être",
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

        {/* SERVICE 1 — RÉPIT */}
        <article className="svc svc--repit" id="repit">
          <div className="svc__photo">
            <img
              src="https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=900&q=80"
              alt="Moment de jeu apaisé"
              loading="lazy"
            />
          </div>
          <div className="svc__body">
            <span className="svc__tag">Service 01 · Répit</span>
            <h3>Du répit pour les parents à bout de souffle</h3>
            <p className="svc__desc">
              Élever plusieurs enfants, accompagner un enfant aux besoins particuliers,
              tenir seul(e) sans relais autour de soi — dans tous les cas, vous avez le droit
              de souffler. Je prends le relais quelques heures, avec la même exigence quel que
              soit le profil de votre enfant, et une vraie aisance sur les situations complexes.
            </p>
            <div className="svc__for">
              <span className="svc__lbl">Ce service s'adresse à vous si</span>
              <ul>{REPIT_POUR.map(t => <li key={t}>{t}</li>)}</ul>
            </div>
            <button className="svc__cta" onClick={() => onContact('repit')}>
              Demander du répit →
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
