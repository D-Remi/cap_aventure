import './QuiJeSuis.css'

const CREDS = [
  { b: 'Éducateur', s: 'en lieu de vie' },
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
              Je suis <strong>éducateur en lieu de vie</strong> en Gironde. Concrètement,
              je vis et travaille dans une maison qui accueille <strong>six enfants</strong> aux
              parcours souvent difficiles.
            </p>
            <p>
              Les crises, les refus, les nuits compliquées, les progrès lents mais réels —
              c'est mon quotidien. Cette expérience-là, aucun manuel ne la remplace.
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
