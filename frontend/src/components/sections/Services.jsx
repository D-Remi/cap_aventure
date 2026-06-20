import { Link } from 'react-router-dom'
import './Services.css'
const SVCS=[
  {img:'https://images.unsplash.com/photo-1566728060299-ad216d6fa3c1?w=600&q=80',badge:{bg:'#e8f5e9',c:'#2e7d32',t:'Service phare'},title:'Garde & Sorties',desc:"Je prends en charge votre enfant (max 3) et l'accompagne vers des activités adaptées — vélo, nature, jeux — sur le Bassin d'Arcachon.",details:['4 à 14 ans','Maximum 3 enfants','Demi-journée ou journée',"Biganos & Bassin d'Arcachon"],cta:'En savoir plus'},
  {img:'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=600&q=80',badge:{bg:'#e3f2fd',c:'#1565c0',t:'TSA · TDAH'},title:'Répit enfants à besoins spécifiques',desc:"Un temps de répit pour les parents. Accompagnement adapté, bienveillant et patient pour les enfants TSA, TDAH ou troubles du comportement.",details:['TSA · TDAH · Troubles comportement','Accueil individualisé','Activités nature apaisantes','Échange préalable avec les parents'],cta:"M'en parler"},
  {img:'https://images.unsplash.com/photo-1587135374648-7518dc14b7ad?w=600&q=80',badge:{bg:'#fff8e1',c:'#f57f17',t:'Sur demande'},title:'Animation événements',desc:"Anniversaires, kermesses, sorties asso… J'interviens pour animer et encadrer votre groupe d'enfants en toute sécurité.",details:["Anniversaires & fêtes","Associations & écoles","Petits et grands groupes","Bassin d'Arcachon & alentours"],cta:'Demander un devis'},
]
export default function Services(){
  const s=()=>document.getElementById('contact')?.scrollIntoView({behavior:'smooth'})
  return(
    <section className="services section" id="services">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">Mes services</span>
          <h2>Un accompagnement <em>sur mesure</em></h2>
          <p>Chaque famille est différente. Je m'adapte à vos besoins et à votre enfant.</p>
        </div>
        <div className="svc-grid">
          {SVCS.map(v=>(
            <div key={v.title} className="svc-card">
              <div className="svc-card__img"><img src={v.img} alt={v.title} loading="lazy"/><div className="svc-card__overlay"/><span className="svc-card__badge" style={{background:v.badge.bg,color:v.badge.c}}>{v.badge.t}</span></div>
              <div className="svc-card__body">
                <h3>{v.title}</h3><p>{v.desc}</p>
                <div className="svc-card__details">{v.details.map(d=><div key={d}>{d}</div>)}</div>
                <Link to={v.title.includes('Garde') ? '/garde' : v.title.includes('pit') ? '/repit' : '/evenements'}
              className="btn-primary" style={{textDecoration:'none'}}>{v.cta}</Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}