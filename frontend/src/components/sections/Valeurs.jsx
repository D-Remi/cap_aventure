import './Valeurs.css'

const VALEURS = [
  {
    icon: '🧭',
    title: 'Aventure & Découverte',
    desc: "Chaque sortie est une opportunité d'explorer, de s'émerveiller et de vivre des expériences uniques dans la nature Savoyarde.",
    img: 'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=500&q=75',
  },
  {
    icon: '🛡️',
    title: 'Sécurité & Confiance',
    desc: 'Encadrement sérieux par un professionnel formé (BAFA, chef scout expérimenté). Les parents peuvent confier leur enfant en toute sérénité.',
    img: 'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=500&q=75',
  },
  {
    icon: '🌱',
    title: 'Respect de la nature',
    desc: "Apprendre à aimer et à protéger l'environnement naturel exceptionnel du Chablais — le lac Léman, les montagnes de Bernex et Thollon — à chaque sortie.",
    img: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=500&q=75',
  },
  {
    icon: '🤝',
    title: 'Vie en groupe',
    desc: "Partager, s'entraider, créer des liens. Les activités collectives renforcent la cohésion et les valeurs humaines.",
    img: 'https://images.unsplash.com/photo-1526976668912-1a811878dd37?w=500&q=75',
  },
]

export default function Valeurs() {
  return (
    <section className="valeurs" id="valeurs">
      <div className="container">
        <span className="section-tag" style={{ color: 'var(--vert-flash)' }}>Nos valeurs</span>
        <h2 className="section-title" style={{ color: 'var(--blanc)' }}>Ce qui nous guide</h2>

        <div className="valeurs__grid">
          {VALEURS.map((v) => (
            <div key={v.title} className="valeur-card reveal">
              <div className="valeur-card__img">
                <img src={v.img} alt={v.title} />
              </div>
              <div className="valeur-card__body">
                <span className="valeur-card__icon">{v.icon}</span>
                <h3>{v.title}</h3>
                <p>{v.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
