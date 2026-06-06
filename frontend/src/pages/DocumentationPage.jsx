import { Link } from 'react-router-dom'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import './DocumentationPage.css'

const DOCS = [
  { cat:'Pour commencer', icon:'🚀', items:[
    { title:"Comment fonctionne CapAventure ?", content:"CapAventure propose un service de garde accompagnée et de répit pour les enfants (4-14 ans) sur le Bassin d'Arcachon. Maximum 3 enfants simultanément. Animateur diplômé BAFA, spécialisé TSA/TDAH." },
    { title:"Comment réserver un créneau ?", content:"1. Créez votre compte parent\n2. Ajoutez le profil de votre enfant\n3. Consultez le calendrier et cliquez sur un créneau disponible\n4. Envoyez votre demande — confirmation par email sous 24h" },
    { title:"Quels documents dois-je fournir ?", content:"Pour tous les enfants : vaccinations à jour.\nPour les enfants à besoins spécifiques : PAP/PPS, ordonnances médicaments, documents MDPH si disponibles.\nTous les documents s'uploadent depuis votre espace 'Documents'." },
  ]},
  { cat:'Tarifs & Aides', icon:'💶', items:[
    { title:"Quels sont les tarifs ?", content:"Garde ponctuelle : à partir de 12-15 €/h\nForfait régulier : à partir de 12 €/h\nRépit spécialisé : sur devis\nContrat répit annuel : tarif horaire fixe négocié dans le contrat" },
    { title:"Le CESU est-il accepté ?", content:"Oui, les paiements en CESU sont acceptés. Selon votre employeur ou situation, vous pouvez recevoir des CESU préfinancés qui couvrent tout ou partie des frais." },
    { title:"Quelles aides financières existent ?", content:"Crédit d'impôt garde d'enfants (50% des dépenses)\nCMG (Complément Mode de Garde) CAF pour les enfants < 6 ans\nAEEH pour les enfants en situation de handicap\nPCH via la MDPH Gironde\nFonds de répit des associations locales\nContactez votre CAF ou MDPH Gironde pour connaître vos droits." },
  ]},
  { cat:'Répit & Besoins Spécifiques', icon:'🌿', items:[
    { title:"Qu'est-ce que le répit familial ?", content:"Le répit est un temps de pause pour les parents aidants d'un enfant à besoins spécifiques. Votre enfant est accueilli dans un environnement adapté, bienveillant et sécurisé." },
    { title:"Quels enfants peuvent être accueillis ?", content:"Enfants TSA (Troubles du Spectre de l'Autisme)\nEnfants TDAH\nTroubles du comportement\nTroubles DYS\nHandicap moteur léger\nAnxiété, phobie scolaire\nUn échange préalable permet d'évaluer les besoins." },
    { title:"Qu'est-ce qu'un contrat de répit ?", content:"Le contrat de répit est un accord formalisé signé par les deux parties. Il définit la période, les jours, le tarif horaire, le kilométrage, les objectifs et les besoins spécifiques de l'enfant." },
  ]},
  { cat:'Pratique', icon:'📋', items:[
    { title:"Comment annuler une réservation ?", content:"Une réservation peut être annulée depuis votre espace 'Mes réservations' jusqu'à 48h avant la date. En dessous de 48h, contactez directement l'animateur." },
    { title:"Les photos de mon enfant sont-elles publiées ?", content:"Non. Les photos ne sont prises qu'avec votre autorisation explicite indiquée dans le dossier de votre enfant. Elles ne sont jamais publiées sans accord écrit." },
    { title:"Comment contacter l'animateur en urgence ?", content:"Depuis votre espace parent, utilisez la messagerie. Pour une urgence pendant une séance, utilisez le numéro de téléphone communiqué lors de la signature du contrat." },
  ]},
]

export default function DocumentationPage() {
  return (
    <>
      <Navbar />
      <div className="doc-page">
        <div className="container">
          <div className="doc-page__header">
            <span className="section-tag">Centre d'aide</span>
            <h1>Espace Documentation</h1>
            <p>Tout ce que vous devez savoir sur CapAventure — réservations, tarifs, répit, aides financières.</p>
          </div>
          <div className="doc-quick">
            {DOCS.map(c => (
              <a key={c.cat} href={`#${c.cat}`} className="doc-quick-card">
                <span>{c.icon}</span><span>{c.cat}</span>
              </a>
            ))}
          </div>
          {DOCS.map(cat => (
            <section key={cat.cat} id={cat.cat} className="doc-section">
              <h2>{cat.icon} {cat.cat}</h2>
              <div className="doc-items">
                {cat.items.map(item => (
                  <details key={item.title} className="doc-item">
                    <summary className="doc-item__q">{item.title}</summary>
                    <div className="doc-item__a">
                      {item.content.split('\n').map((line,i) => line ? <p key={i}>{line}</p> : <br key={i}/>)}
                    </div>
                  </details>
                ))}
              </div>
            </section>
          ))}
          <div className="doc-cta">
            <h2>Vous ne trouvez pas votre réponse ?</h2>
            <p>Contactez-moi directement — je réponds généralement sous 24h.</p>
            <div style={{display:'flex',gap:'.85rem',justifyContent:'center',flexWrap:'wrap'}}>
              <a href="/#contact" className="btn-primary" style={{textDecoration:'none'}}>💬 Nous contacter</a>
              <Link to="/register" className="btn-secondary" style={{textDecoration:'none'}}>Créer un compte</Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}