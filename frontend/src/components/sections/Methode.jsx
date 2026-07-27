import './Methode.css'

const PRINCIPES = [
  {
    t: "Tout part de la communication",
    d: "Avant tout, je parle avec le jeune. Comprendre ce qu'il vit, mettre des mots sur ce qui coince : c'est là que tout commence, et c'est souvent ce qui débloque le reste.",
  },
  {
    t: "Chaque action a une conséquence",
    d: "J'aide l'enfant à comprendre que ce qu'il fait a un effet sur toute la famille. Pas pour le culpabiliser, mais pour qu'il saisisse le lien entre ses choix et ce qui se passe autour de lui.",
  },
  {
    t: "Montrer que bien vivre ensemble, c'est mieux",
    d: "Quand tout se passe bien, la maison est plus légère pour tout le monde. Je fais découvrir au jeune que le calme et le respect lui rapportent, à lui le premier.",
  },
  {
    t: "Des hauts et des bas, c'est normal",
    d: "Il y en a tous les jours, dans toutes les familles. Je ne cherche pas la perfection : j'aide chacun à traverser les moments difficiles sans que ça déborde sur tout le reste.",
  },
  {
    t: "Des ateliers adaptés à chaque famille",
    d: "Je ne plaque pas une recette. Selon ce que vit votre famille, je propose des temps concrets et des activités sur mesure pour avancer sur ce qui vous pèse.",
  },
  {
    t: "Vous aider, pas vous juger",
    d: "Je ne suis pas là pour changer votre façon d'élever vos enfants. Je suis là pour vous épauler sur ce qui vous dépasse, à votre rythme et dans le respect de vos choix.",
  },
]

export default function Methode() {
  return (
    <section className="methode" id="methode">
      <div className="container">
        <div className="methode__box">
          <div className="methode__head">
            <span className="methode__kicker">Ma méthode</span>
            <h2>La <span>communication</span> avant tout</h2>
            <p>
              Chaque famille est différente, donc j'adapte. Mais tout repose sur une même idée :
              parler, faire comprendre, et avancer ensemble, sans jugement.
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
