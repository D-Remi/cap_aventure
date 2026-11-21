import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import Navbar          from '../components/layout/Navbar'
import Footer          from '../components/layout/Footer'
import Hero            from '../components/sections/Hero'
import Services        from '../components/sections/Services'
import BandeauCitation from '../components/sections/BandeauCitation'
import Moments         from '../components/sections/Moments'
import Etapes          from '../components/sections/Etapes'
import Methode         from '../components/sections/Methode'
import BandeauSuisse   from '../components/sections/BandeauSuisse'
import QuiJeSuis       from '../components/sections/QuiJeSuis'
import Zone            from '../components/sections/Zone'
import Temoignages     from '../components/sections/Temoignages'
import Questions       from '../components/sections/Questions'
import CtaFinal        from '../components/sections/CtaFinal'
import ContactModal    from '../components/ui/ContactModal'
import StickyContact   from '../components/ui/StickyContact'
import useReveal       from '../hooks/useReveal'
import { setMeta }     from '../utils/seo'

export default function HomePage() {
  const [modalOpen, setModalOpen] = useState(false)
  const [serviceInitial, setServiceInitial] = useState('')
  const { hash } = useLocation()

  const openContact = (service = '') => {
    setServiceInitial(service)
    setModalOpen(true)
  }

  useReveal()

  useEffect(() => {
    setMeta(
      "Éduc & Vous · Répit et garde d'enfants à besoins spécifiques · Thonon, Évian, Chablais",
      "Garde et répit à domicile pour les familles d'enfants autistes (TSA), TDAH, en situation de handicap ou avec troubles du comportement. Thonon, Évian, Chablais. 20 €/h après crédit d'impôt. Frontaliers bienvenus."
    )
  }, [])

  // Arrivée depuis une autre page avec une ancre (ex. /#qui)
  useEffect(() => {
    if (!hash) return
    const t = setTimeout(() => document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'smooth' }), 120)
    return () => clearTimeout(t)
  }, [hash])

  return (
    <div className="ev">
      <Navbar onContact={openContact} overHero />
      <main>
        <Hero onContact={openContact} />
        <Services onContact={openContact} />
        <BandeauCitation />
        <Moments />
        <Etapes />
        <Methode />
        <BandeauSuisse />
        <QuiJeSuis />
        <Zone />
        <Temoignages />
        <Questions />
        <CtaFinal onContact={openContact} />
      </main>
      <Footer onContact={openContact} />

      <StickyContact onContact={openContact} />

      <ContactModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        serviceInitial={serviceInitial}
      />
    </div>
  )
}
