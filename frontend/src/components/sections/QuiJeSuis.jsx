import './QuiJeSuis.css'

const FACTS = [
  { t: 'Éducateur en lieu de vie', d: 'Poste actuel, à temps plein' },
  { t: "Assistant d'éducation",    d: 'Expérience en collège' },
  { t: 'BAFA',                     d: "Diplôme d'État" },
  { t: 'Reconversion 2022',        d: 'Ancien informaticien' },
]

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

          <div className="qui__side">
            <blockquote className="qui__quote">
              « Je ne théorise pas ce que je raconte. Je l'applique tous les jours,
              avec de vrais enfants, dans de vraies situations. »
            </blockquote>
            <div className="qui__facts">
              {FACTS.map(({ t, d }) => (
                <div className="qui__fact" key={t}>
                  <b>{t}</b><span>{d}</span>
                </div>
              ))}
            </div>
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
