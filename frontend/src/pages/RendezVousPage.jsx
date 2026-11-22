import { useEffect, useState } from 'react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import RendezVous from '../components/ui/RendezVous'
import ContactModal from '../components/ui/ContactModal'
import { setMeta } from '../utils/seo'
import { img, P, REMI } from '../data/photos'
import './RendezVousPage.css'

export default function RendezVousPage() {
  const [modalOpen, setModalOpen] = useState(false)

  useEffect(() => {
    setMeta(
      'Réserver un appel gratuit · Éduc & Vous · Garde et répit, Chablais, Genève, Vaud',
      "Choisissez un créneau : Rémi vous appelle 30 minutes, gratuitement et sans engagement, pour parler de la garde ou du répit de votre enfant à besoins particuliers."
    )
  }, [])

  return (
    <div className="ev">
      <Navbar onContact={() => setModalOpen(true)} />
      <main className="ev-rdvp">
        <div className="ev-container ev-rdvp__grid">
          <div className="ev-rdvp__texte">
            <span className="ev-kicker">Premier échange gratuit</span>
            <h1>On s'appelle ?</h1>
            <p>Trente minutes pour me raconter votre situation, sans jugement et sans engagement. Choisissez un moment : c'est moi qui vous appelle.</p>
            <ul>
              <li>Ce que vit votre enfant, ce qui l'apaise, ce qui le met en difficulté</li>
              <li>Ce dont vous auriez besoin : quelques heures, une journée, chaque semaine</li>
              <li>Le prix réel pour vous, avec les aides, côté France ou côté Suisse</li>
            </ul>
            <div className="ev-rdvp__remi">
              <img src={REMI} alt="Rémi, accompagnant éducatif" onError={e => { e.currentTarget.src = img(P.foret, 200) }} />
              <p><b>Rémi</b><br />Accompagnant éducatif · Chablais, Genève, Vaud</p>
            </div>
          </div>
          <div className="ev-rdvp__carte">
            <RendezVous />
          </div>
        </div>
      </main>
      <Footer onContact={() => setModalOpen(true)} />
      <ContactModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  )
}
