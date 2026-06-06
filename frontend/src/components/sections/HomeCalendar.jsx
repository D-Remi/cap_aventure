import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import WeekCalendar from '../ui/WeekCalendar'
import './HomeCalendar.css'

export default function HomeCalendar() {
  const [slots, setSlots]     = useState([])
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    axios.get('/api/slots?all=true').then(r => setSlots(r.data)).catch(() => {})
  }, [])

  return (
    <section className="home-cal section" id="planning">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">Disponibilités</span>
          <h2>Mon <em>planning</em> de la semaine</h2>
          <p>Consultez mes disponibilités en temps réel et réservez depuis votre espace parent.</p>
        </div>

        <WeekCalendar
          slots={slots}
          onSlotClick={setSelected}
          showEmpty={true}
          mode="public"
        />

        {selected && selected.statut === 'ouvert' && (
          <div className="home-cal__cta">
            <div className="home-cal__cta-info">
              <strong>{selected.titre || "Créneau disponible"}</strong>
              <span>{new Date(selected.date+'T00:00:00').toLocaleDateString('fr-FR',{weekday:'long',day:'numeric',month:'long'})}</span>
              <span>{selected.heure_debut?.slice(0,5)}–{selected.heure_fin?.slice(0,5)} · {selected.places_max - selected.places_prises} place{selected.places_max - selected.places_prises > 1 ? 's' : ''} disponible{selected.places_max - selected.places_prises > 1 ? 's' : ''}</span>
            </div>
            <div style={{display:'flex',gap:'.75rem',flexWrap:'wrap'}}>
              <Link to="/register" className="btn-primary" style={{textDecoration:'none'}}>Créer un compte</Link>
              <Link to="/login" className="btn-secondary" style={{textDecoration:'none'}}>Se connecter</Link>
            </div>
          </div>
        )}

        <div className="home-cal__foot">
          <Link to="/calendrier" style={{color:'var(--sauge)',fontWeight:700,fontSize:'.9rem'}}>Voir le planning complet →</Link>
        </div>
      </div>
    </section>
  )
}