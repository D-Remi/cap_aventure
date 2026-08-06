import { useState, useEffect } from 'react'
import Navbar          from '../components/layout/Navbar'
import Footer          from '../components/layout/Footer'
import Hero            from '../components/sections/Hero'
import BandeauCitation from '../components/sections/BandeauCitation'
import Services        from '../components/sections/Services'
import Moments         from '../components/sections/Moments'
import Methode         from '../components/sections/Methode'
import QuiJeSuis       from '../components/sections/QuiJeSuis'
import Temoignages     from '../components/sections/Temoignages'
import CtaFinal        from '../components/sections/CtaFinal'
import ContactModal    from '../components/ui/ContactModal'

export default function HomePage() {
  const [modalOpen, setModalOpen] = useState(false)
  const [serviceInitial, setServiceInitial] = useState('')

  const openContact = (service = '') => {
    setServiceInitial(service)
    setModalOpen(true)
  }

  useEffect(() => {
    document.title = "Éduc & Vous — Relais à la journée et accompagnement éducatif · Gironde"
    const meta = document.querySelector('meta[name="description"]')
    if (meta) meta.setAttribute(
      'content',
      "Accompagnant éducatif en Gironde. Relais à la journée pour faire garder votre enfant et accompagnement éducatif des familles. Garde occasionnelle, y compris enfants aux besoins spécifiques. Premier échange gratuit."
    )
  }, [])

  return (
    <>
      <Navbar onContact={openContact} />
      <main>
        <Hero onContact={openContact} />
        <BandeauCitation />
        <Services onContact={openContact} />
        <Moments />
        <Methode />
        <QuiJeSuis />
        <Temoignages />
        <CtaFinal onContact={openContact} />
      </main>
      <Footer onContact={openContact} />

      <ContactModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        serviceInitial={serviceInitial}
      />
    </>
  )
}
