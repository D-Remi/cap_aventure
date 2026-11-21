import { useEffect, useState } from 'react'
import axios from 'axios'

// Informations légales publiques (saisies dans Admin > Mon entreprise)
let cache = null
export default function useEntreprise() {
  const [ent, setEnt] = useState(cache || {})
  useEffect(() => {
    if (cache) return
    axios.get('/api/entreprise/public')
      .then(r => { cache = r.data || {}; setEnt(cache) })
      .catch(() => {})
  }, [])
  return ent
}

// Affiche la valeur, ou un repère visible si elle n'est pas encore renseignée
export const v = (val, repere = 'à compléter') => (val ? val : `[${repere}]`)
export const nomEI = (e) => `${[e.prenom, e.nom].filter(Boolean).join(' ') || '[Prénom Nom]'} EI`
export const fmtDate = (d) => d ? new Date(String(d).slice(0, 10) + 'T00:00:00').toLocaleDateString('fr-FR') : ''
