import { useEffect } from 'react'
import { useReveal } from '../hooks/useReveal'
import { useSeo } from '../hooks/useSeo'
import Hero     from '../components/sections/Hero'
import Projet   from '../components/sections/Projet'
import Valeurs  from '../components/sections/Valeurs'
import Activites from '../components/sections/Activites'
import Clubs    from '../components/sections/Clubs'
import Contact  from '../components/sections/Contact'

export default function HomePage() {
  useSeo({
    title: "Activités outdoor pour enfants à Thonon-les-Bains",
    description: "CapAventure : VTT, club scout, vélo école, multi-activités et accompagnement événements pour enfants 6-14 ans à Thonon-les-Bains (74). Animateur diplômé BAFA.",
    canonical: "/",
  })
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
