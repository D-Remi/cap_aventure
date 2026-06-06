import './NatureBand.css'
const TARIFS=[
  {i:'🕐',t:'À la séance',p:'15€',u:'/heure',d:'Garde ponctuelle, animation événement',pts:['Garde à domicile','Accompagnement sortie','Animation événement','CESU accepté'],pop:false,cta:'Demander un devis'},
  {i:'📅',t:'Forfait régulier',p:'12€',u:'/heure',d:'Engagement sur plusieurs séances / semaine',pts:['Réservation hebdomadaire fixe','Suivi personnalisé','Bilan mensuel aux parents','CESU accepté'],pop:true,cta:'Commencer'},
  {i:'❤️',t:'Répit spécialisé',p:'Sur',u:'devis',d:'Accompagnement TSA/TDAH besoins spécifiques',pts:['Évaluation des besoins','Suivi individualisé renforcé','Compte-rendu détaillé','Aides familles aidantes'],pop:false,cta:'Nous contacter'},
]
export default function NatureBand(){
  const s=()=>document.getElementById('contact')?.scrollIntoView({behavior:'smooth'})
  return(
    <section className="tarifs section" id="tarifs">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">Tarifs</span>
          <h2>Des tarifs <em>transparents</em></h2>
          <p>Devis personnalisé selon votre situation. CESU accepté.</p>
        </div>
        <div className="tarifs__grid">
          {TARIFS.map(t=>(
            <div key={t.t} className={`tarif-card ${t.pop?'tarif-card--pop':''}`}>
              {t.pop && <div className="tarif-card__badge">⭐ Le plus choisi</div>}
              <div className="tarif-card__icon">{t.i}</div>
              <h3>{t.t}</h3>
              <div className="tarif-card__price">{t.p}<span>{t.u}</span></div>
              <div className="tarif-card__desc">{t.d}</div>
              <ul className="tarif-card__list">{t.pts.map(p=><li key={p}>{p}</li>)}</ul>
              <button className={t.pop?'btn-primary':'btn-secondary'} onClick={s} style={{marginTop:'1rem',width:'100%',justifyContent:'center'}}>{t.cta}</button>
            </div>
          ))}
        </div>
        <div className="tarifs__note">💶 <strong>CESU accepté</strong> — Des aides (CAF, MDPH, associations) peuvent couvrir une partie des frais.</div>
      </div>
    </section>
  )
}