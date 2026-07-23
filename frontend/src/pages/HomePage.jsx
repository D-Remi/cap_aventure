import { useEffect } from 'react'
import Navbar     from '../components/layout/Navbar'
import Footer     from '../components/layout/Footer'
import Hero       from '../components/sections/Hero'
import Services   from '../components/sections/Services'
import Methode    from '../components/sections/Methode'
import QuiJeSuis  from '../components/sections/QuiJeSuis'
import Temoignages from '../components/sections/Temoignages'
import Contact    from '../components/sections/Contact'

export default function HomePage() {
  useEffect(() => {
    document.title = "CapAventure — Répit handicap et accompagnement éducatif · Gironde"
    const meta = document.querySelector('meta[name="description"]')
    if (meta) meta.setAttribute(
      'content',
      "Éducateur en lieu de vie en Gironde. Répit pour parents d'enfants en situation de handicap et accompagnement éducatif pour les familles en difficulté. Premier échange gratuit."
    )
  }, [])

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Services />
        <Methode />
        <QuiJeSuis />
        <Temoignages />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
