import { useState } from 'react'
import { Link } from 'react-router-dom'
import ContactModal from '../components/ui/ContactModal'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import './ServicePage.css'

export default function RepitPage() {
  const [showContact, setShowContact] = useState(false)
  return (
    <>
      <Navbar />
      <div className="service-page">

        <div className="service-page__hero service-page__hero--repit">
          <div className="container service-page__hero-inner">
            <div>
              <span className="service-page__tag">Répit TSA · TDAH</span>
              <h1>Service de répit<br/><span>enfants à besoins spécifiques</span></h1>
              <p>Un accompagnement adapté et bienveillant pour les enfants TSA, TDAH ou avec des troubles du comportement. Un temps de respiration pour toute la famille.</p>
              <div className="service-page__hero-btns">
                <Link to="/calendrier" className="btn-primary">Voir les créneaux adaptés</Link>
                <a href="#" onClick={e=>{e.preventDefault();setShowContact(true)}} className="btn-secondary">Discutons de vos besoins</a>
              </div>
            </div>
            <div className="service-page__hero-img">
              <img src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=700&q=80" alt="Nature apaisante" />
            </div>
          </div>
        </div>

        <div className="container">

          <section className="service-section">
            <h2>Une approche pensée pour votre enfant</h2>
            <div className="service-highlight">
              <p>Fort de mon expérience d'assistant d'éducation et de ma spécialisation dans l'accueil d'enfants TSA et troubles du comportement, je propose un accompagnement individualisé qui respecte le rythme et les besoins de chaque enfant.</p>
            </div>
            <div className="service-cards">
              {[
                { i:'', t:'Échange préalable approfondi', d:'Avant le premier accueil, j'échange avec vous sur les habitudes, déclencheurs, méthodes d\'apaisement et centres d\'intérêt de votre enfant.' },
                { i:'', t:'Activités nature apaisantes', d:'Promenades en forêt des Landes, jeux sensoriels, vélo — des activités choisies pour leur effet apaisant.' },
                { i:'', t:'Rythme respecté', d:'Pas de contrainte de temps. Si l\'enfant a besoin de pauses ou de calme, on s\'adapte.' },
                { i:'', t:'Dossier de suivi', d:"Un profil complet est établi avec les parents (déclencheurs, hypersensibilités, protocole d'urgence)." },
                { i:'', t:'Compte-rendu de séance', d:'Un retour détaillé sur chaque séance vous est proposé — observations, moments positifs, points d\'attention.' },
                { i:'', t:'Éligible aux aides', d:'Ce service peut être couvert en partie par des aides CAF, MDPH ou associations d\'aidants familiaux.' },
              ].map(c => (
                <div key={c.t} className="service-card-item">
                  <span className="service-card-item__icon">{c.i}</span>
                  <div><strong>{c.t}</strong><p>{c.d}</p></div>
                </div>
              ))}
            </div>
          </section>

          <section className="service-section service-section--blue">
            <h2 style={{color:'white'}}>Profils accueillis</h2>
            <div className="service-profiles">
              {['TSA — Troubles du Spectre de l\'Autisme','TDAH — Troubles de l\'Attention avec/sans Hyperactivité','Troubles du comportement','Troubles DYS (dyslexie, dyspraxie…)','Handicap moteur léger','Anxiété, phobie scolaire'].map(p => (
                <div key={p} className="service-profile-tag">{p}</div>
              ))}
            </div>
          </section>

          <section className="service-section service-section--light">
            <div className="service-info-grid">
              <div>
                <h2>Infos pratiques</h2>
                <div className="service-info-list">
                  <div className="service-info-row"><span></span><div><strong>Âge</strong><span>4 à 14 ans</span></div></div>
                  <div className="service-info-row"><span></span><div><strong>Capacité</strong><span>1 enfant prioritairement (max 2 selon les profils)</span></div></div>
                  <div className="service-info-row"><span></span><div><strong>Première séance</strong><span>Séance découverte avec le parent présent</span></div></div>
                  <div className="service-info-row"><span></span><div><strong>Fréquence</strong><span>Ponctuelle ou régulière selon vos besoins</span></div></div>
                  <div className="service-info-row"><span></span><div><strong>Tarif</strong><span>Sur devis selon la situation · Aides possibles</span></div></div>
                </div>
              </div>
              <div className="service-info-img">
                <img src="https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=600&q=80" alt="Nature calme" />
              </div>
            </div>
          </section>

          <section className="service-cta service-cta--repit">
            <h2>Parlons de votre situation</h2>
            <p>Chaque enfant est unique. Contactez-moi pour qu'on échange sur vos besoins et voir comment je peux vous aider.</p>
            <div className="service-cta__btns">
              <a href="#" onClick={e=>{e.preventDefault();setShowContact(true)}} className="btn-primary">Prendre contact</a>
              <Link to="/calendrier" className="btn-secondary">Voir les disponibilités</Link>
            </div>
          </section>

        </div>
      </div>
      <Footer />
      {showContact && <ContactModal onClose={() => setShowContact(false)} />}
    </>
  )
}