import { useEffect } from 'react'
import { useReveal } from '../hooks/useReveal'
import Hero     from '../components/sections/Hero'
import Projet   from '../components/sections/Projet'
import Valeurs  from '../components/sections/Valeurs'
import Activites from '../components/sections/Activites'
import Clubs    from '../components/sections/Clubs'
import Contact  from '../components/sections/Contact'

export default function HomePage() {
  useReveal()

  return (
    <>
      <Hero />
      <Projet />
      <Valeurs />
      <Activites />
      <Clubs />
      <Contact />
    </>
  )
}
