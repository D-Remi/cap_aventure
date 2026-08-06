import './QuiJeSuis.css'

const CREDS = [
  { b: 'Accompagnant', s: 'éducatif' },
  { b: 'Ex-AED',    s: "assistant d'éducation" },
  { b: 'BAFA',      s: "diplômé d'État" },
  { b: 'Gironde',   s: "secteur d'intervention" },
]

export default function QuiJeSuis() {
  return (
    <section className="qui" id="qui">
      <div className="container">
        <div className="qui__box">
          <div className="qui__photo">
            <img
              src="https://images.unsplash.com/photo-1654613698275-b0930ef9570f?q=80&w=1170&auto=format&fit=crop"
              alt="Accompagnement au quotidien"
              loading="lazy"
            />
          </div>

          <div className="qui__text">
            <h2>Je ne théorise pas. Je vis ces situations tous les jours.</h2>
            <p>
              Je suis <strong>accompagnant éducatif</strong> en Gironde. J'accompagne au
              quotidien des enfants aux parcours souvent difficiles, et j'épaule les familles
              qui en ont besoin.
            </p>
            <p>
              Les crises, les refus, les progrès lents mais réels — c'est mon métier.
              Cette expérience-là, aucun manuel ne la remplace.
            </p>
            <p>
              Avant ça, j'ai été <strong>assistant d'éducation</strong> en collège et j'ai passé
              mon <strong>BAFA</strong>. J'ai quitté un métier dans l'informatique en 2022 parce
              que ce qui compte pour moi, c'est l'humain.
            </p>
            <div className="qui__creds">
              {CREDS.map(({ b, s }) => (
                <div className="qui__cred" key={b}><b>{b}</b><span>{s}</span></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
