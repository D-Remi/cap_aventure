import { useState } from 'react'
import { Link } from 'react-router-dom'
import ContactModal from '../components/ui/ContactModal'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import './ServicePage.css'

export default function GardePage() {
  const [showContact, setShowContact] = useState(false)
  return (
    <>
      <Navbar />
      <div className="service-page">

        {/* Hero */}
        <div className="service-page__hero service-page__hero--garde">
          <div className="container service-page__hero-inner">
            <div>
              <span className="service-page__tag">🏠 Garde & Sorties</span>
              <h1>Garde accompagnée<br/><span>avec sorties activités</span></h1>
              <p>Je prends en charge votre enfant à votre domicile et l'accompagne vers des activités adaptées à son âge — vélo, nature, jeux — sur le Bassin d'Arcachon.</p>
              <div className="service-page__hero-btns">
                <Link to="/calendrier" className="btn-primary">Voir les créneaux disponibles</Link>
                <a href="#" onClick={e=>{e.preventDefault();setShowContact(true)}} className="btn-secondary">Nous contacter</a>
              </div>
            </div>
            <div className="service-page__hero-img">
              <img src="https://images.unsplash.com/photo-1566728060299-ad216d6fa3c1?w=700&q=80" alt="Garde et sorties vélo" />
            </div>
          </div>
        </div>

        <div className="container">

          {/* Ce que j'inclus */}
          <section className="service-section">
            <h2>Ce que comprend la garde</h2>
            <div className="service-cards">
              {[
                { i:'🏠', t:'Prise en charge à domicile', d:"Je viens chercher votre enfant chez vous à l'heure convenue." },
                { i:'🚴', t:'Sorties nature & activités', d:'Vélo sur les pistes du Bassin, jeux en forêt des Landes, sorties plage.' },
                { i:'🍱', t:'Repas si journée complète',  d:'Repas fourni ou pique-nique selon les préférences de l\'enfant.' },
                { i:'📝', t:'Compte-rendu de journée',   d:'Un retour sur la journée vous est transmis si vous le souhaitez.' },
                { i:'📞', t:'Contact permanent',          d:'Vous pouvez me joindre à tout moment pendant la garde.' },
                { i:'💶', t:'CESU accepté',               d:'Le service est éligible au CESU — réduction possible selon votre situation.' },
              ].map(c => (
                <div key={c.t} className="service-card-item">
                  <span className="service-card-item__icon">{c.i}</span>
                  <div><strong>{c.t}</strong><p>{c.d}</p></div>
                </div>
              ))}
            </div>
          </section>

          {/* Infos pratiques */}
          <section className="service-section service-section--light">
            <div className="service-info-grid">
              <div>
                <h2>Infos pratiques</h2>
                <div className="service-info-list">
                  <div className="service-info-row"><span>👶</span><div><strong>Âge</strong><span>4 à 14 ans</span></div></div>
                  <div className="service-info-row"><span>👥</span><div><strong>Capacité</strong><span>Maximum 3 enfants simultanément</span></div></div>
                  <div className="service-info-row"><span>🕐</span><div><strong>Durée</strong><span>Demi-journée (matin ou après-midi) ou journée complète</span></div></div>
                  <div className="service-info-row"><span>📍</span><div><strong>Zone</strong><span>Biganos et Bassin d'Arcachon (33)</span></div></div>
                  <div className="service-info-row"><span>🗓️</span><div><strong>Disponibilités</strong><span>Mercredis, week-ends et vacances scolaires</span></div></div>
                  <div className="service-info-row"><span>💶</span><div><strong>Tarif</strong><span>À partir de 12€/heure · CESU accepté</span></div></div>
                </div>
              </div>
              <div className="service-info-img">
                <img src="https://images.unsplash.com/photo-1448375240586-882707db888b?w=600&q=80" alt="Forêt des Landes" />
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="service-cta">
            <h2>Prêt à réserver ?</h2>
            <p>Consultez le calendrier et réservez directement en ligne, ou contactez-moi pour échanger sur vos besoins.</p>
            <div className="service-cta__btns">
              <Link to="/calendrier" className="btn-primary">📅 Voir les créneaux</Link>
              <a href="#" onClick={e=>{e.preventDefault();setShowContact(true)}} className="btn-secondary">💬 Nous contacter</a>
            </div>
          </section>

        </div>
      </div>
      <Footer />
      {showContact && <ContactModal onClose={() => setShowContact(false)} />}
    </>
  )
}