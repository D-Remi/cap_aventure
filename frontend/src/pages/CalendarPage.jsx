import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import './CalendarPage.css'

const MONTHS = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre']
const DAYS   = ['Lun','Mar','Mer','Jeu','Ven','Sam','Dim']

const TYPE_COLORS = {
  ski:   { bg: '#dbeafe', text: '#1d4ed8', dot: '#3b82f6' },
  vtt:   { bg: '#dcfce7', text: '#166534', dot: '#22c55e' },
  rando: { bg: '#fef9c3', text: '#92400e', dot: '#f59e0b' },
  scout: { bg: '#f0fdf4', text: '#14532d', dot: '#16a34a' },
  autre: { bg: '#f3f4f6', text: '#374151', dot: '#9ca3af' },
}

export default function CalendarPage() {
  const [activities, setActivities] = useState([])
  const [loading, setLoading]       = useState(true)
  const [current, setCurrent]       = useState(() => {
    const now = new Date(); return { year: now.getFullYear(), month: now.getMonth() }
  })
  const [selected, setSelected]     = useState(null)  // date ISO
  const [detail, setDetail]         = useState(null)   // activity detail

  useEffect(() => {
    axios.get('/api/activities')
      .then(r => setActivities(r.data))
      .finally(() => setLoading(false))
  }, [])

  const prevMonth = () => setCurrent(c => {
    if (c.month === 0) return { year: c.year - 1, month: 11 }
    return { ...c, month: c.month - 1 }
  })
  const nextMonth = () => setCurrent(c => {
    if (c.month === 11) return { year: c.year + 1, month: 0 }
    return { ...c, month: c.month + 1 }
  })

  // Build calendar grid
  const firstDay = new Date(current.year, current.month, 1)
  const lastDay  = new Date(current.year, current.month + 1, 0)
  // Monday-based: adjust so Monday = 0
  const startPad = (firstDay.getDay() + 6) % 7
  const totalCells = Math.ceil((startPad + lastDay.getDate()) / 7) * 7

  const cells = Array.from({ length: totalCells }, (_, i) => {
    const dayNum = i - startPad + 1
    if (dayNum < 1 || dayNum > lastDay.getDate()) return null
    return new Date(current.year, current.month, dayNum)
  })

  const activitiesOnDay = (date) => {
    if (!date) return []
    return activities.filter(a => {
      const d = new Date(a.date)
      return d.getFullYear() === date.getFullYear() &&
             d.getMonth() === date.getMonth() &&
             d.getDate() === date.getDate()
    })
  }

  const isToday = (date) => {
    if (!date) return false
    const t = new Date()
    return date.getFullYear() === t.getFullYear() &&
           date.getMonth() === t.getMonth() &&
           date.getDate() === t.getDate()
  }

  const isSelected = (date) => {
    if (!date || !selected) return false
    return date.toDateString() === new Date(selected).toDateString()
  }

  const selectedActivities = selected ? activitiesOnDay(new Date(selected)) : []

  // List view: all upcoming sorted
  const upcoming = [...activities].sort((a, b) => new Date(a.date) - new Date(b.date))

  return (
    <>
      <Navbar />
      <div className="calendar-page">
        <div className="container">
          <div className="calendar-page__header reveal-up">
            <div>
              <span className="section-tag">Planning</span>
              <h1 className="section-title">Calendrier des <span>activités</span></h1>
              <p style={{ color: 'var(--text-muted)' }}>
                Toutes les sorties CapAventure à venir en Haute-Savoie
              </p>
            </div>
            <Link to="/register" className="btn-primary">S'inscrire →</Link>
          </div>

          <div className="calendar-layout">
            {/* ── Left: Calendar ── */}
            <div className="calendar-wrap">
              <div className="calendar-nav">
                <button onClick={prevMonth} className="cal-nav-btn">‹</button>
                <h2>{MONTHS[current.month]} {current.year}</h2>
                <button onClick={nextMonth} className="cal-nav-btn">›</button>
              </div>

              <div className="calendar-grid">
                {DAYS.map(d => (
                  <div key={d} className="cal-day-label">{d}</div>
                ))}
                {cells.map((date, i) => {
                  const dayActs = activitiesOnDay(date)
                  return (
                    <div
                      key={i}
                      className={`cal-cell ${!date ? 'cal-cell--empty' : ''} ${isToday(date) ? 'cal-cell--today' : ''} ${isSelected(date) ? 'cal-cell--selected' : ''} ${dayActs.length > 0 ? 'cal-cell--has-events' : ''}`}
                      onClick={() => date && setSelected(date.toISOString())}
                    >
                      {date && (
                        <>
                          <span className="cal-cell__num">{date.getDate()}</span>
                          <div className="cal-cell__dots">
                            {dayActs.slice(0, 3).map(a => (
                              <span
                                key={a.id}
                                className="cal-dot"
                                style={{ background: TYPE_COLORS[a.type]?.dot || TYPE_COLORS.autre.dot }}
                              />
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  )
                })}
              </div>

              {/* Legend */}
              <div className="cal-legend">
                {Object.entries(TYPE_COLORS).map(([type, c]) => (
                  <div key={type} className="cal-legend__item">
                    <span style={{ width: 10, height: 10, borderRadius: '50%', background: c.dot, display:'inline-block' }} />
                    <span style={{ textTransform: 'capitalize' }}>{type}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Right: Day detail or upcoming list ── */}
            <div className="calendar-sidebar">
              {selected && selectedActivities.length > 0 ? (
                <>
                  <h3 className="cal-sidebar__title">
                    {new Date(selected).toLocaleDateString('fr-FR', { weekday:'long', day:'numeric', month:'long' })}
                  </h3>
                  <div className="cal-events">
                    {selectedActivities.map(a => (
                      <ActivityCard key={a.id} activity={a} onClick={() => setDetail(a)} />
                    ))}
                  </div>
                  <button
                    onClick={() => setSelected(null)}
                    style={{ marginTop: '1rem', fontSize: '0.85rem', color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer' }}
                  >
                    ← Voir tout le planning
                  </button>
                </>
              ) : (
                <>
                  <h3 className="cal-sidebar__title">Prochaines activités</h3>
                  {loading ? (
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Chargement...</div>
                  ) : upcoming.length === 0 ? (
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'center', padding: '2rem' }}>
                      <span style={{ fontSize: '2rem', display: 'block', marginBottom: '0.5rem' }}>🏔️</span>
                      Aucune activité programmée pour le moment
                    </div>
                  ) : (
                    <div className="cal-events">
                      {upcoming.map(a => (
                        <ActivityCard key={a.id} activity={a} onClick={() => setDetail(a)} />
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Activity detail modal */}
      {detail && (
        <div className="admin-modal-overlay" onClick={() => setDetail(null)}>
          <div className="cal-detail-modal" onClick={e => e.stopPropagation()}>
            {detail.image_url && (
              <img src={detail.image_url} alt={detail.titre} className="cal-detail-modal__img" />
            )}
            <div className="cal-detail-modal__body">
              <span className="cal-type-badge" style={{
                background: TYPE_COLORS[detail.type]?.bg,
                color: TYPE_COLORS[detail.type]?.text,
              }}>
                {detail.type}
              </span>
              <h2>{detail.titre}</h2>
              <p className="cal-detail-modal__desc">{detail.description}</p>
              <div className="cal-detail-modal__meta">
                <div>📅 {new Date(detail.date).toLocaleDateString('fr-FR', { weekday:'long', day:'numeric', month:'long', year:'numeric' })}</div>
                <div>🕐 {new Date(detail.date).toLocaleTimeString('fr-FR', { hour:'2-digit', minute:'2-digit' })}</div>
                <div>💶 {parseFloat(detail.prix).toFixed(2)}€ par enfant</div>
                <div>👥 {detail.places_restantes ?? '?'} place{detail.places_restantes > 1 ? 's' : ''} restante{detail.places_restantes > 1 ? 's' : ''}</div>
              </div>
              <div className="cal-detail-modal__actions">
                <Link
                  to={`/activites/${detail.id}`}
                  className="btn-primary"
                  style={{ textDecoration: 'none' }}
                  onClick={() => setDetail(null)}
                >
                  Voir le détail →
                </Link>
                <button className="btn-secondary" onClick={() => setDetail(null)}>Fermer</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  )
}

function ActivityCard({ activity: a, onClick }) {
  const colors = TYPE_COLORS[a.type] || TYPE_COLORS.autre
  const time = new Date(a.date).toLocaleTimeString('fr-FR', { hour:'2-digit', minute:'2-digit' })
  return (
    <div className="cal-event-card" onClick={onClick} style={{ cursor: 'pointer' }}>
      <div className="cal-event-card__stripe" style={{ background: colors.dot }} />
      <div className="cal-event-card__body">
        <div className="cal-event-card__header">
          <span className="cal-type-badge" style={{ background: colors.bg, color: colors.text }}>
            {a.type}
          </span>
          <span className="cal-event-card__time">{time}</span>
        </div>
        <h4>{a.titre}</h4>
        <div className="cal-event-card__meta">
          <span>💶 {parseFloat(a.prix).toFixed(2)}€</span>
          <span>👥 {a.places_restantes ?? '?'} place{a.places_restantes > 1 ? 's' : ''}</span>
        </div>
      </div>
    </div>
  )
}
