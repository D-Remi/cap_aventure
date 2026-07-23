import { Link } from 'react-router-dom'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import './DocumentationPage.css'

const DOCS = [
  { cat:'Pour commencer', items:[
    { title:"Que propose CapAventure ?", content:"Deux services distincts, assurés par un éducateur en lieu de vie :\n\n1. Du répit pour les parents d'enfants en situation de handicap — je prends le relais quelques heures.\n\n2. Un accompagnement éducatif pour les familles en difficulté — guidance parentale et travail avec l'enfant pour reposer un cadre." },
    { title:"Comment se passe le premier contact ?", content:"Vous remplissez le formulaire de contact ou vous m'écrivez sur WhatsApp. Je vous réponds sous 24h et nous convenons d'un premier échange téléphonique de 30 minutes, gratuit et sans engagement." },
    { title:"Quels documents fournir ?", content:"Rien d'obligatoire au départ.\n\nPour le répit handicap, si vous les avez : notification MDPH, PAP ou PPS, ordonnances en cours, compte-rendu de suivi.\n\nTous les documents s'ajoutent depuis votre espace famille, onglet Documents." },
  ]},
  { cat:'Le répit handicap', items:[
    { title:"En quoi consiste le répit ?", content:"C'est un temps où je prends le relais auprès de votre enfant, pour que vous puissiez souffler, vous occuper de vos autres enfants, ou simplement vous reposer.\n\nCe n'est pas de la garde classique : c'est un accompagnement par un professionnel habitué aux besoins spécifiques." },
    { title:"Quels profils d'enfants ?", content:"Troubles du spectre de l'autisme (TSA)\nTDAH\nTroubles du comportement\nTroubles DYS\nAnxiété, phobie scolaire\nHandicap moteur léger\n\nUn échange préalable permet toujours d'évaluer si je suis la bonne personne pour votre enfant." },
    { title:"Comment se déroule la mise en place ?", content:"1. Un échange approfondi sur votre enfant : ses repères, ses déclencheurs, ce qui l'apaise.\n\n2. Une première rencontre en votre présence, pour que votre enfant m'identifie sans stress.\n\n3. Le répit commence, à un rythme défini ensemble." },
  ]},
  { cat:"L'accompagnement éducatif", items:[
    { title:"À qui s'adresse ce service ?", content:"Aux parents qui ont le sentiment de ne plus se faire respecter, dont chaque demande devient un conflit, qui ont tout essayé sans résultat durable, et qui sont épuisés.\n\nCe n'est pas un manque d'amour ni de compétence. C'est un cadre à reconstruire." },
    { title:"Comment ça se passe concrètement ?", content:"1. Un premier échange de 30 minutes, gratuit, où vous racontez votre situation.\n\n2. Une séance d'observation à domicile ou en visio.\n\n3. Deux ou trois ajustements précis et tenables, pas dix conseils impossibles.\n\n4. Un suivi régulier pour ajuster et tenir dans la durée." },
    { title:"Sur quels principes vous appuyez-vous ?", content:"Un cadre clair, énoncé calmement et tenu jusqu'au bout.\nLa réparation plutôt que la punition.\nLe respect s'apprend en étant respecté.\nNi cri, ni humiliation, jamais.\nLa constance vaut mieux que la sévérité.\n\nRien de révolutionnaire : ce qui fonctionne réellement en institution, adapté à votre foyer." },
  ]},
  { cat:'Tarifs et aides', items:[
    { title:"Quels sont les tarifs ?", content:"Les tarifs sont établis sur devis, selon le service, la fréquence et votre situation.\n\nLe premier échange est toujours gratuit et sans engagement." },
    { title:"Quelles aides financières existent ?", content:"Selon votre situation :\n\nPCH (Prestation de Compensation du Handicap) via la MDPH\nAEEH et ses compléments\nFonds de répit départementaux\nCrédit d'impôt services à la personne\nAides de certaines mutuelles et caisses de retraite\n\nJe peux vous orienter dans les démarches." },
    { title:"Le CESU est-il accepté ?", content:"Oui, les paiements en CESU et par virement bancaire sont acceptés." },
  ]},
  { cat:'Votre espace famille', items:[
    { title:"Que puis-je voir dans mon espace ?", content:"Le suivi des séances réalisées avec les comptes-rendus que je choisis de partager, les objectifs travaillés et leur progression, les dossiers de vos enfants, vos documents, les photos partagées et la messagerie." },
    { title:"Qui a accès aux informations de mon enfant ?", content:"Uniquement vous et moi. Les dossiers ne sont jamais partagés avec des tiers.\n\nMes notes de travail personnelles restent privées et ne vous sont pas transmises automatiquement — mais vous pouvez toujours me demander où en est l'accompagnement." },
    { title:"Les photos de mon enfant sont-elles publiées ?", content:"Jamais. Les photos ne sont prises qu'avec votre autorisation explicite, indiquée dans le dossier de votre enfant. Elles restent visibles uniquement dans votre espace privé." },
    { title:"Comment me contacter entre deux séances ?", content:"Par la messagerie de votre espace famille, ou directement sur WhatsApp pour les situations qui ne peuvent pas attendre." },
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
            <p>Tout ce que vous devez savoir sur les deux services, les aides financières et votre espace famille.</p>
          </div>
          <div className="doc-quick">
            {DOCS.map(c => (
              <a key={c.cat} href={`#${c.cat}`} className="doc-quick-card">
                <span>{c.cat}</span>
              </a>
            ))}
          </div>
          {DOCS.map(cat => (
            <section key={cat.cat} id={cat.cat} className="doc-section">
              <h2>{cat.cat}</h2>
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
              <a href="/#contact" className="btn-primary" style={{textDecoration:'none'}}>Me contacter</a>
              <Link to="/register" className="btn-secondary" style={{textDecoration:'none'}}>Créer un compte</Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}