import './Methode.css'

const PRINCIPES = [
  {
    t: 'Un cadre clair, tenu jusqu\'au bout',
    d: "Un enfant qui teste les limites cherche à savoir si elles existent vraiment. Les poser calmement et ne pas céder, c'est le rassurer, pas le brimer.",
  },
  {
    t: 'Réparer plutôt que punir',
    d: "Une bêtise se répare. Cette logique apprend la responsabilité, là où la punition n'apprend que la peur ou la ruse.",
  },
  {
    t: 'Le respect s\'apprend en étant respecté',
    d: "On ne peut pas exiger d'un enfant une attitude qu'on ne lui montre pas soi-même. Ça commence toujours par l'adulte.",
  },
  {
    t: 'Ni cri, ni humiliation. Jamais.',
    d: "Élever la voix règle un problème pendant dix minutes et en crée un pour dix ans. La fermeté n'a rien à voir avec la brutalité.",
  },
  {
    t: 'La constance vaut mieux que la sévérité',
    d: "Mieux vaut une règle simple appliquée tous les jours qu'une règle stricte appliquée une fois sur deux.",
  },
  {
    t: 'Le bien-être de l\'enfant comme boussole',
    d: "Chaque décision éducative se juge à une chose : est-ce que ça aide cet enfant à grandir en confiance ?",
  },
]

export default function Methode() {
  return (
    <section className="methode" id="methode">
      <div className="container">
        <div className="methode__box">
          <div className="methode__head">
            <span className="methode__kicker">Ma méthode</span>
            <h2>Des principes éducatifs <span>solides</span>, pas des recettes miracles</h2>
            <p>
              Ce que j'applique avec les six enfants dont je m'occupe au quotidien.
              Rien de révolutionnaire : de la constance, de la clarté, et beaucoup de respect.
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
