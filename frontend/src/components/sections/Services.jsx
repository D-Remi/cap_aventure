import { Link } from 'react-router-dom'
import './Services.css'

const REPIT_POUR = [
  "Votre enfant est porteur d'un handicap, d'un TSA, d'un TDAH ou de troubles du comportement",
  "Vous n'avez jamais de temps pour vous, ni pour vos autres enfants",
  "Vous ne trouvez personne de suffisamment formé pour le garder sereinement",
  "Vous avez besoin de souffler sans culpabiliser",
]

const REPIT_ETAPES = [
  { n: 1, t: 'On fait connaissance', d: "Un temps d'échange approfondi sur votre enfant : ses repères, ses déclencheurs, ce qui l'apaise." },
  { n: 2, t: 'Première rencontre',   d: "Une séance en votre présence pour que votre enfant m'identifie sans stress." },
  { n: 3, t: 'Le répit commence',    d: "Quelques heures régulières ou ponctuelles, chez vous ou en sortie, selon ce qui convient." },
]

const ACC_POUR = [
  "Vous avez le sentiment de ne plus vous faire respecter",
  "Chaque demande se transforme en conflit ou en négociation sans fin",
  "Vous avez tout essayé : punitions, récompenses, discussions, cris",
  "Vous êtes épuisé et vous culpabilisez de l'être",
]

const ACC_ETAPES = [
  { n: 1, t: 'Un premier échange',    d: "30 minutes gratuites où vous me racontez. J'écoute, je pose des questions, sans jugement." },
  { n: 2, t: 'J\'observe le quotidien', d: "Une séance chez vous ou en visio pour voir concrètement comment les choses se passent." },
  { n: 3, t: 'On ajuste ensemble',    d: "Deux ou trois changements précis et tenables. Pas dix conseils impossibles à appliquer." },
  { n: 4, t: 'Un suivi dans la durée', d: "Des points réguliers pour ajuster et tenir. C'est là que les choses changent vraiment." },
]

export default function Services() {
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
        <article className="svc-block svc-block--repit" id="repit">
          <div className="svc-block__inner">
            <div>
              <span className="svc-block__tag">Service 01 · Répit</span>
              <h3>Du répit pour les parents aidants</h3>
              <p className="svc-block__desc">
                Accompagner un enfant en situation de handicap au quotidien, c'est une charge
                qui ne s'arrête jamais. Je prends le relais quelques heures, avec la compétence
                d'un professionnel qui travaille tous les jours avec des enfants aux besoins spécifiques.
              </p>

              <div className="svc-block__for">
                <span className="svc-block__lbl">Ce service s'adresse à vous si</span>
                <ul>
                  {REPIT_POUR.map((txt) => <li key={txt}>{txt}</li>)}
                </ul>
              </div>

              <Link to="/contact?service=repit" className="svc-block__cta">
                Demander du répit →
              </Link>
            </div>

            <aside className="svc-block__side">
              <h4>Comment ça se passe</h4>
              {REPIT_ETAPES.map(({ n, t, d }) => (
                <div className="svc-block__row" key={n}>
                  <div className="svc-block__num">{n}</div>
                  <div><b>{t}</b><span>{d}</span></div>
                </div>
              ))}
              <div className="svc-block__note">
                <b>Aides possibles :</b> PCH, AEEH, fonds de répit MDPH.
                Je peux vous orienter dans les démarches.
              </div>
            </aside>
          </div>
        </article>

        {/* SERVICE 2 — ACCOMPAGNEMENT */}
        <article className="svc-block svc-block--acc" id="accompagnement">
          <div className="svc-block__inner">
            <div>
              <span className="svc-block__tag">Service 02 · Accompagnement</span>
              <h3>Retrouver un cadre qui tient</h3>
              <p className="svc-block__desc">
                Vous avez l'impression de ne plus rien maîtriser. Les crises s'enchaînent,
                votre enfant ne vous écoute plus, et vous vous sentez seul face à ça.
                Ce n'est pas un manque d'amour ni de compétence : c'est un cadre à reconstruire.
                Et ça se travaille.
              </p>

              <div className="svc-block__for">
                <span className="svc-block__lbl">Ce service s'adresse à vous si</span>
                <ul>
                  {ACC_POUR.map((txt) => <li key={txt}>{txt}</li>)}
                </ul>
              </div>

              <Link to="/contact?service=accompagnement" className="svc-block__cta">
                En parler avec moi →
              </Link>
            </div>

            <aside className="svc-block__side">
              <h4>Comment ça se passe</h4>
              {ACC_ETAPES.map(({ n, t, d }) => (
                <div className="svc-block__row" key={n}>
                  <div className="svc-block__num">{n}</div>
                  <div><b>{t}</b><span>{d}</span></div>
                </div>
              ))}
            </aside>
          </div>
        </article>

      </div>
    </section>
  )
}
