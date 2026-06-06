import { useEffect } from 'react'
import Navbar      from '../components/layout/Navbar'
import Footer      from '../components/layout/Footer'
import Hero        from '../components/sections/Hero'
import TrustBand   from '../components/sections/TrustBand'
import Services    from '../components/sections/Services'
import Projet      from '../components/sections/Projet'
import Clubs       from '../components/sections/Clubs'
import Valeurs     from '../components/sections/Valeurs'
import NatureBand  from '../components/sections/NatureBand'
import Contact     from '../components/sections/Contact'

export default function HomePage() {
  useEffect(() => {
    document.title = "CapAventure — Garde, répit et animation · Biganos (33)"
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if(e.isIntersecting) e.target.classList.add('visible') })
    }, { threshold: 0.12 })
    document.querySelectorAll('.reveal').forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [])
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <TrustBand />
        <Services />
        <Projet />
        <Clubs />
        <Valeurs />
        <NatureBand />
        <Contact />
      </main>
      <Footer />
    </>
  )
}