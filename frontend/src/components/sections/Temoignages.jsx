import { useState, useEffect } from 'react'
import axios from 'axios'
import './Temoignages.css'

export default function Temoignages() {
  const [avis, setAvis] = useState([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    axios.get('/api/temoignages')
      .then(r => setAvis(r.data))
      .catch(() => setAvis([]))
      .finally(() => setLoaded(true))
  }, [])

  // Le composant ne s'affiche QUE s'il y a au moins 5 avis approuvés
  // (le backend renvoie [] tant que le seuil n'est pas atteint)
  if (!loaded || avis.length < 5) return null

  const moyenne = (avis.reduce((s,a) => s + a.note, 0) / avis.length).toFixed(1)

  return (
    <section className="temoignages section" id="avis">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">Ils me font confiance</span>
          <h2>Ce que disent <em>les parents</em></h2>
          <div className="temoignages__moyenne">
            <span className="temoignages__stars">{'★'.repeat(Math.round(moyenne))}{'☆'.repeat(5-Math.round(moyenne))}</span>
            <strong>{moyenne}/5</strong>
            <span className="temoignages__count">· {avis.length} avis</span>
          </div>
        </div>
        <div className="temoignages__grid">
          {avis.map(a => (
            <div key={a.id} className="temoignage-card">
              <div className="temoignage-card__stars">{'★'.repeat(a.note)}{'☆'.repeat(5-a.note)}</div>
              <p className="temoignage-card__text">"{a.contenu}"</p>
              <div className="temoignage-card__author">
                <div className="temoignage-card__avatar">{a.prenom.charAt(0).toUpperCase()}</div>
                <div>
                  <strong>{a.prenom}</strong>
                  <span>Parent</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}