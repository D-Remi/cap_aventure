import { useEffect, useState } from 'react'
import RendezVous from './RendezVous'
import { EVENEMENT_RDV } from '../../utils/rendezVous'
import './RendezVous.css'

// Fenêtre « Réserver un appel », montée une fois dans App et ouverte par ouvrirRendezVous()
export default function RendezVousModal() {
  const [ouvert, setOuvert] = useState(false)
  const [cle, setCle] = useState(0)

  useEffect(() => {
    const ouvrir = () => { setCle(k => k + 1); setOuvert(true) }
    window.addEventListener(EVENEMENT_RDV, ouvrir)
    return () => window.removeEventListener(EVENEMENT_RDV, ouvrir)
  }, [])

  useEffect(() => {
    if (!ouvert) return
    const echap = (e) => { if (e.key === 'Escape') setOuvert(false) }
    document.addEventListener('keydown', echap)
    const avant = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.removeEventListener('keydown', echap); document.body.style.overflow = avant }
  }, [ouvert])

  if (!ouvert) return null
  return (
    <div className="ev-rdvm__overlay" onClick={() => setOuvert(false)}>
      <div className="ev-rdvm" role="dialog" aria-modal="true" aria-labelledby="ev-rdvm-titre" onClick={e => e.stopPropagation()}>
        <button className="ev-rdvm__fermer" onClick={() => setOuvert(false)} aria-label="Fermer">✕</button>
        <h2 id="ev-rdvm-titre">Réserver un appel gratuit</h2>
        <RendezVous key={cle} onFermer={() => setOuvert(false)} />
      </div>
    </div>
  )
}
