import './Clubs.css'
const PTS=['Échange préalable approfondi avec les parents',"Adaptation aux besoins spécifiques de l'enfant",'Environnement naturel calme et sécurisé','Compte-rendu à chaque fin de séance (optionnel)','Éligible aux aides pour familles aidantes']
export default function Clubs(){
  const s=()=>document.getElementById('contact')?.scrollIntoView({behavior:'smooth'})
  return(
    <section className="clubs section" id="repit">
      <div className="container">
        <div className="clubs__inner reveal">
          <div className="clubs__img">
            <img src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80" alt="Nature apaisante"/>
            <div className="clubs__img-overlay"/>
          </div>
          <div className="clubs__content">
            <span className="section-tag" style={{color:'var(--sable)'}}>Service spécialisé</span>
            <h2>Un service de <span>répit</span><br/>pour votre famille</h2>
            <p>Vous êtes parents d'un enfant TSA, TDAH ou avec des troubles du comportement, et vous avez besoin d'un moment pour souffler ?</p>
            <p>Je propose un accompagnement adapté dans un environnement naturel apaisant.</p>
            <div className="clubs__pts">{PTS.map(p=><div key={p} className="clubs__pt">{p}</div>)}</div>
            <button className="btn-primary" onClick={s} style={{marginTop:'1.5rem'}}>Discutons de vos besoins</button>
          </div>
        </div>
      </div>
    </section>
  )
}