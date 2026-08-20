import './Methode.css'

const PRINCIPES = [
  {
    t: "La sécurité avant tout",
    d: "Votre enfant est sous ma responsabilité : je reste attentif, présent, et vigilant à chaque instant. Rien ne compte plus que son bien-être et sa sécurité.",
  },
  {
    t: "Je respecte ses repères",
    d: "Chaque enfant a ses habitudes, son rythme, ses petites manies rassurantes. Je les apprends avec vous en amont, et je les respecte pour qu'il se sente en confiance.",
  },
  {
    t: "Une garde préparée avec vous",
    d: "Avant la première garde, on échange : ce qui apaise votre enfant, ce qui le déclenche, ses besoins. Rien n'est improvisé, tout est anticipé ensemble.",
  },
  {
    t: "À l'aise avec tous les profils",
    d: "Fratrie nombreuse, enfant en bas âge, ou besoins spécifiques (handicap, TSA, TDAH) : j'ai l'habitude, et j'adapte ma présence à chaque enfant.",
  },
  {
    t: "Des moments qui ont du sens",
    d: "Je ne me contente pas de surveiller. Jeux, activités, sorties selon l'âge et l'envie : votre enfant passe un bon moment, pas juste un temps d'attente.",
  },
  {
    t: "Vous êtes tenu au courant",
    d: "À votre retour, je vous raconte comment ça s'est passé. Vous confiez votre enfant l'esprit tranquille, et vous savez exactement ce qui s'est vécu.",
  },
]

export default function Methode() {
  return (
    <section className="methode" id="methode">
      <div className="container">
        <div className="methode__box">
          <div className="methode__head">
            <span className="methode__kicker">Ma façon de faire</span>
            <h2>La <span>confiance</span> avant tout</h2>
            <p>
              Confier son enfant, ce n'est jamais anodin. Voici ce sur quoi vous pouvez
              compter quand vous me le confiez.
            </p>
          </div>
          <div className="methode__grid">
            {PRINCIPES.map(({ t, d }) => (
              <div className="methode__item" key={t}>
                <b>{t}</b>
                <span>{d}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
