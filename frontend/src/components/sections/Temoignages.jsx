import { useState, useEffect } from 'react'
import axios from 'axios'
import './Temoignages.css'

const etoiles = (n) => '★'.repeat(n) + '☆'.repeat(Math.max(0, 5 - n))

export default function Temoignages() {
  const [avis, setAvis] = useState([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    axios.get('/api/temoignages')
      .then(r => setAvis(Array.isArray(r.data) ? r.data : []))
      .catch(() => setAvis([]))
      .finally(() => setLoaded(true))
  }, [])

  // Le bloc ne s'affiche QUE s'il y a au moins 5 avis approuvés
  // (le backend renvoie [] tant que le seuil n'est pas atteint)
  if (!loaded || avis.length < 5) return null

  const moyenne = avis.reduce((s, a) => s + a.note, 0) / avis.length

  return (
    <section className="ev-section ev-avis" id="avis">
      <div className="ev-container">
        <div className="ev-head ev-head--center">
          <span className="ev-kicker">Ils me font confiance</span>
          <h2>Ce que disent <em>les parents</em></h2>
          <p className="ev-avis__moyenne">
            <span aria-hidden="true">{etoiles(Math.round(moyenne))}</span>
            <strong>{moyenne.toFixed(1)}/5</strong> · {avis.length} avis
          </p>
        </div>
        <div className="ev-avis__grid">
          {avis.map(a => (
            <figure key={a.id} className="ev-avis__card">
              <div className="ev-avis__stars" aria-label={`${a.note} sur 5`}>{etoiles(a.note)}</div>
              <blockquote>« {a.contenu} »</blockquote>
              <figcaption>
                <span className="ev-avis__avatar">{a.prenom?.charAt(0).toUpperCase()}</span>
                <span><b>{a.prenom}</b><small>Parent</small></span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
