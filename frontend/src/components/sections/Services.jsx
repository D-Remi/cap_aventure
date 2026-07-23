import './Services.css'

const REPIT_POUR = [
  "Votre enfant est porteur d'un handicap, d'un TSA, d'un TDAH ou de troubles du comportement",
  "Vous n'avez jamais de temps pour vous, ni pour vos autres enfants",
  "Vous ne trouvez personne de suffisamment formé pour le garder sereinement",
  "Vous avez besoin de souffler sans culpabiliser",
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
            <h3>Du répit pour les parents aidants</h3>
            <p className="svc__desc">
              Accompagner un enfant en situation de handicap au quotidien, c'est une charge
              qui ne s'arrête jamais. Je prends le relais quelques heures, avec la compétence
              d'un professionnel qui travaille tous les jours avec des enfants aux besoins spécifiques.
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
