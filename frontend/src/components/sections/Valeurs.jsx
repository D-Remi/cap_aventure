import './Valeurs.css'
const STEPS=[
  {n:'1',i:'',t:'Premier contact',d:"Vous m'écrivez pour présenter votre enfant et vos besoins."},
  {n:'2',i:'',t:'Rencontre',d:"On se retrouve avec l'enfant pour faire connaissance et définir le cadre."},
  {n:'3',i:'',t:'Organisation',d:'On convient des dates, horaires et modalités. Vous remplissez le dossier enfant.'},
  {n:'4',i:'',t:"C'est parti !",d:"L'aventure commence. Je vous tiens informé(e) à chaque séance."},
]
export default function Valeurs(){
  return(
    <section className="valeurs section" id="comment">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">Simple & transparent</span>
          <h2>Comment ça <em>fonctionne</em> ?</h2>
          <p>Un processus simple pour que vous puissiez confier votre enfant en toute sérénité.</p>
        </div>
        <div className="valeurs__steps">
          {STEPS.map(s=>(
            <div key={s.n} className="step reveal">
              <div className="step__num">{s.n}</div>
              <div className="step__icon">{s.i}</div>
              <h3>{s.t}</h3><p>{s.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}