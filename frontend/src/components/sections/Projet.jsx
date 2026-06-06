import './Projet.css'
const ATOUTS=[
  {i:'🎓',t:'Diplôme BAFA',d:"Formation reconnue par l'État pour l'encadrement de mineurs"},
  {i:'👥',t:'Maximum 3 enfants',d:'Suivi individualisé — jamais plus de 3 enfants simultanément'},
  {i:'❤️',t:'Spécialisation TSA/TDAH',d:"Assistant d'éducation — expérience en accueil d'enfants à besoins spécifiques"},
  {i:'💶',t:'CESU & aides CAF',d:"Service éligible au CESU — réduction selon votre situation"},
]
export default function Projet(){
  return(
    <section className="projet section" id="pourquoi">
      <div className="container projet__grid">
        <div className="projet__imgs reveal">
          <div className="projet__img-main">
            <img src="https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=900&q=80" alt="Animateur avec enfants"/>
            <div className="projet__badge">🎓 Animateur diplômé BAFA</div>
          </div>
          <div className="projet__img-s"><img src="https://images.unsplash.com/photo-1448375240586-882707db888b?w=400&q=75" alt="Forêt Landes" loading="lazy"/></div>
          <div className="projet__img-s"><img src="https://images.unsplash.com/photo-1472162072942-cd5147eb3902?w=400&q=75" alt="Enfants nature" loading="lazy"/></div>
        </div>
        <div className="projet__text reveal">
          <span className="section-tag">Pourquoi me choisir</span>
          <h2 className="section-header" style={{textAlign:'left',marginBottom:'1rem'}}>
            Un professionnel <em style={{color:'var(--sauge)',fontStyle:'normal'}}>de confiance</em>
          </h2>
          <p>Titulaire du BAFA et fort d'une expérience d'assistant d'éducation, je propose un accompagnement personnalisé et bienveillant. Spécialisé dans l'accueil d'enfants TSA et troubles du comportement.</p>
          <p>Mon approche : <strong>petit groupe, grande attention.</strong></p>
          <div className="projet__atouts">
            {ATOUTS.map(a=>(
              <div key={a.t} className="projet__atout">
                <div className="projet__atout-i">{a.i}</div>
                <div><strong>{a.t}</strong><span>{a.d}</span></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}