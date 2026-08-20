import './QuiJeSuis.css'

const CREDS = [
  { b: 'Accompagnant', s: 'éducatif' },
  { b: 'Ex-AED',    s: "assistant d'éducation" },
  { b: 'BAFA',      s: "diplômé d'État" },
  { b: 'Haute-Savoie',   s: "secteur d'intervention" },
]

export default function QuiJeSuis() {
  return (
    <section className="qui" id="qui">
      <div className="container">
        <div className="qui__box">
          <div className="qui__photo">
            <img
              src="https://images.unsplash.com/photo-1654613698275-b0930ef9570f?q=80&w=1170&auto=format&fit=crop"
              alt="Rémi, accompagnant éducatif en Haute-Savoie au quotidien"
              loading="lazy"
            />
          </div>

          <div className="qui__text">
            <h2>Un éducateur pour garder votre enfant, pas juste un baby-sitter.</h2>
            <p>
              Je suis <strong>accompagnant éducatif</strong> en Haute-Savoie, et je propose
              un service de garde d'enfant de confiance. J'ai l'habitude d'accompagner des
              enfants de tous profils, y compris aux besoins spécifiques.
            </p>
            <p>
              Gérer un groupe d'enfants, s'adapter à chaque caractère, garder son calme en
              toute situation — c'est mon quotidien de professionnel. Cette expérience-là,
              aucun baby-sitter occasionnel ne l'a.
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
