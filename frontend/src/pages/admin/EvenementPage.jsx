import { useState } from 'react'
import { Link } from 'react-router-dom'
import ContactModal from '../components/ui/ContactModal'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import './ServicePage.css'

export default function EvenementPage() {
  const [showContact, setShowContact] = useState(false)
  return (
    <>
      <Navbar />
      <div className="service-page">

        <div className="service-page__hero service-page__hero--evenement">
          <div className="container service-page__hero-inner">
            <div>
              <span className="service-page__tag">🎉 Animation Événements</span>
              <h1>Animation & Encadrement<br/><span>pour vos événements</span></h1>
              <p>Anniversaires, kermesses, sorties associatives, fêtes d'école… J'interviens pour animer et encadrer votre groupe d'enfants en toute sécurité.</p>
              <div className="service-page__hero-btns">
                <a href="#" onClick={e=>{e.preventDefault();setShowContact(true)}} className="btn-primary">Demander un devis</a>
                <Link to="/calendrier" className="btn-secondary">Voir mes disponibilités</Link>
              </div>
            </div>
            <div className="service-page__hero-img">
              <img src="https://images.unsplash.com/photo-1587135374648-7518dc14b7ad?w=700&q=80" alt="Animation enfants" />
            </div>
          </div>
        </div>

        <div className="container">

          <section className="service-section">
            <h2>Ce que je propose</h2>
            <div className="service-cards">
              {[
                { i:'🎂', t:'Anniversaires enfants',     d:'Animation jeux, activités créatives ou nature pour un anniversaire inoubliable.' },
                { i:'🏫', t:'Kermesses & fêtes d\'école', d:'Stands de jeux, animations, encadrement sécurisé pour vos événements scolaires.' },
                { i:'🌲', t:'Sorties nature',             d:'Organisation et encadrement de sorties dans la forêt des Landes ou au Bassin d\'Arcachon.' },
                { i:'🤸', t:'Activités sportives douces', d:'Vélo, jeux coopératifs, parcours motricité adaptés à tous les âges.' },
                { i:'🎯', t:'Animations sur mesure',      d:'Thème choisi avec vous, activités adaptées à l\'âge et au nombre d\'enfants.' },
                { i:'📋', t:'Encadrement BAFA',           d:'Diplôme BAFA garantissant un encadrement professionnel et sécurisé.' },
              ].map(c => (
                <div key={c.t} className="service-card-item">
                  <span className="service-card-item__icon">{c.i}</span>
                  <div><strong>{c.t}</strong><p>{c.d}</p></div>
                </div>
              ))}
            </div>
          </section>

          <section className="service-section service-section--light">
            <div className="service-info-grid">
              <div>
                <h2>Infos pratiques</h2>
                <div className="service-info-list">
                  <div className="service-info-row"><span>👶</span><div><strong>Âge</strong><span>3 à 14 ans</span></div></div>
                  <div className="service-info-row"><span>👥</span><div><strong>Groupe</strong><span>De 5 à 20 enfants selon l'événement</span></div></div>
                  <div className="service-info-row"><span>⏱️</span><div><strong>Durée</strong><span>2h minimum · journée sur demande</span></div></div>
                  <div className="service-info-row"><span>📍</span><div><strong>Lieu</strong><span>À votre domicile, en extérieur ou dans votre structure</span></div></div>
                  <div className="service-info-row"><span>🗓️</span><div><strong>Réservation</strong><span>Minimum 2 semaines à l'avance</span></div></div>
                  <div className="service-info-row"><span>💶</span><div><strong>Tarif</strong><span>Sur devis selon durée et nombre d'enfants</span></div></div>
                </div>
              </div>
              <div className="service-info-img">
                <img src="https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=600&q=80" alt="Enfants activité" />
              </div>
            </div>
          </section>

          <section className="service-cta">
            <h2>Organisons votre événement</h2>
            <p>Décrivez-moi votre projet et je vous envoie un devis personnalisé sous 48h.</p>
            <div className="service-cta__btns">
              <a href="#" onClick={e=>{e.preventDefault();setShowContact(true)}} className="btn-primary">📩 Demander un devis gratuit</a>
              <Link to="/calendrier" className="btn-secondary">📅 Mes disponibilités</Link>
            </div>
          </section>

        </div>
      </div>
      <Footer />
      {showContact && <ContactModal onClose={() => setShowContact(false)} />}
    </>
  )
}