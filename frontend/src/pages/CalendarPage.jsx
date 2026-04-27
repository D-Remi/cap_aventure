import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import './CalendarPage.css'
import { useSeo } from '../hooks/useSeo'

const MONTHS = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre']
const DAYS   = ['Lun','Mar','Mer','Jeu','Ven','Sam','Dim']
const JOURS_LABELS = ['Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi','Dimanche']

const TYPE_COLORS = {
  vtt:   { bg: '#dcfce7', text: '#166534', dot: '#22c55e', label: '🚵 VTT & Vélo' },
  scout: { bg: '#ede9fe', text: '#5b21b6', dot: '#a78bfa', label: '🌲 Club Scout' },
  autre: { bg: '#fff7ed', text: '#c2410c', dot: '#f97316', label: '🎯 Multi-activités' },
  velo:  { bg: '#d1fae5', text: '#065f46', dot: '#10b981', label: '🚲 Vélo École' },
  evenement: { bg: '#fef9c3', text: '#854d0e', dot: '#f5c842', label: '🎉 Événements' },
}

// ── Helpers dates ──────────────────────────────────────────────
function sameDay(a, b) {
  return a.getFullYear() === b.getFullYear() &&
         a.getMonth()    === b.getMonth() &&
         a.getDate()     === b.getDate()
}

function getOccurrencesOnDay(activity, date) {
  if (!date) return []
  if (activity.schedule_type === 'ponctuelle' && activity.date) {
    if (sameDay(new Date(activity.date), date))
      return [{ ...activity, _occurrenceDate: activity.date }]
  }
  if (activity.schedule_type === 'multi_dates' && activity.dates?.length) {
    const match = activity.dates.find(ds => sameDay(new Date(ds), date))
    if (match) return [{ ...activity, _occurrenceDate: match }]
  }
  if ((activity.schedule_type === 'recurrente' || activity.schedule_type === 'saisonniere') && activity.recurrence_days?.length) {
    const jsFriDay = (date.getDay() + 6) % 7
    const DAYS_IDX = ['lundi','mardi','mercredi','jeudi','vendredi','samedi','dimanche']
    const dayName  = DAYS_IDX[jsFriDay]
    const inSeason = (!activity.date_debut || date >= new Date(activity.date_debut)) &&
                     (!activity.date_fin   || date <= new Date(activity.date_fin))
    if (activity.recurrence_days.includes(dayName) && inSeason)
      return [{ ...activity, _occurrenceDate: date.toISOString() }]
  }
  return []
}

function getNextOccurrence(activity) {
  const now = new Date()
  if (activity.schedule_type === 'ponctuelle' && activity.date) {
    const d = new Date(activity.date)
    if (d >= now) return { ...activity, _occurrenceDate: activity.date, _sortDate: d }
  }
  if (activity.schedule_type === 'multi_dates' && activity.dates?.length) {
    const next = activity.dates
      .map(ds => ({ ds, d: new Date(ds) }))
      .filter(({ d }) => d >= now)
      .sort((x, y) => x.d - y.d)[0]
    if (next) return { ...activity, _occurrenceDate: next.ds, _sortDate: next.d }
  }
  return null
}

export default function CalendarPage() {
  useSeo({
    title: "Calendrier des activités",
    description: "Consultez toutes les sorties CapAventure à venir à Thonon-les-Bains : VTT, club scout, vélo école, multi-activités. Inscrivez votre enfant en ligne.",
    canonical: "/calendrier",
  })
  const [activities, setActivities] = useState([])
  const [loading, setLoading]       = useState(true)
  const [current, setCurrent]       = useState(() => {
    const now = new Date()
    return { year: now.getFullYear(), month: now.getMonth() }
  })
  const [selected, setSelected] = useState(null)
  const [detail, setDetail]     = useState(null)

  // ── Filtres ────────────────────────────────────────────────
  const [filterType, setFilterType]   = useState([])   // [] = tous
  const [filterDay, setFilterDay]     = useState([])   // 0–6 lun-dim
  const [filterMonth, setFilterMonth] = useState(null) // null = tous

  useEffect(() => {
    axios.get('/api/activities')
      .then(r => setActivities(r.data))
      .finally(() => setLoading(false))
  }, [])

  // ── Activités filtrées ─────────────────────────────────────
  const filtered = useMemo(() => {
    return activities.filter(a => {
      if (filterType.length && !filterType.includes(a.type)) return false
      return true
    })
  }, [activities, filterType])

  // ── Toggle helpers ─────────────────────────────────────────
  const toggleType = (t) => setFilterType(prev =>
    prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]
  )
  const toggleDay = (d) => setFilterDay(prev =>
    prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d]
  )

  // ── Occurrences sur un jour (avec filtres jour) ───────────
  const activitiesOnDay = (date) => {
    if (!date) return []
    const dow = (date.getDay() + 6) % 7 // 0=lun
    if (filterDay.length && !filterDay.includes(dow)) return []
    if (filterMonth !== null && date.getMonth() !== filterMonth) return []
    return filtered.flatMap(a => getOccurrencesOnDay(a, date))
  }

  // ── Grille calendrier ──────────────────────────────────────
  const firstDay   = new Date(current.year, current.month, 1)
  const lastDay    = new Date(current.year, current.month + 1, 0)
  const startPad   = (firstDay.getDay() + 6) % 7
  const totalCells = Math.ceil((startPad + lastDay.getDate()) / 7) * 7
  const cells = Array.from({ length: totalCells }, (_, i) => {
    const dayNum = i - startPad + 1
    if (dayNum < 1 || dayNum > lastDay.getDate()) return null
    return new Date(current.year, current.month, dayNum)
  })

  const isToday = (date) => {
    if (!date) return false
    return sameDay(date, new Date())
  }
  const isSelected = (date) => {
    if (!date || !selected) return false
    return sameDay(date, new Date(selected))
  }

  const selectedActivities = selected ? activitiesOnDay(new Date(selected)) : []

  // ── Prochaines activités (barre latérale) ─────────────────
  const now = new Date()
  const upcoming = filtered
    .map(getNextOccurrence)
    .filter(Boolean)
    .filter(a => {
      if (filterDay.length) {
        const dow = (new Date(a._occurrenceDate).getDay() + 6) % 7
        if (!filterDay.includes(dow)) return false
      }
      if (filterMonth !== null && new Date(a._occurrenceDate).getMonth() !== filterMonth) return false
      return true
    })
    .sort((a, b) => a._sortDate - b._sortDate)
    .slice(0, 8)

  const hasFilters = filterType.length > 0 || filterDay.length > 0 || filterMonth !== null
  const resetFilters = () => { setFilterType([]); setFilterDay([]); setFilterMonth(null) }

  return (
    <>
      <Navbar />
      <div className="calendar-page">
        <div className="container">

          <div className="calendar-page__header reveal-up">
            <div>
              <span className="section-tag">Planning</span>
              <h1 className="section-title">Calendrier des <span>activités</span></h1>
              <p style={{ color:'var(--text-muted)' }}>
                Toutes les sorties CapAventure autour de Thonon-les-Bains
              </p>
            </div>
            <Link to="/register" className="btn-primary">S'inscrire →</Link>
          </div>

          {/* ── Filtres ── */}
          <div className="cal-filters">
            <div className="cal-filters__group">
              <span className="cal-filters__label">Type</span>
              {Object.entries(TYPE_COLORS).filter(([k]) => k !== 'rando').map(([k, v]) => (
                <button
                  key={k}
                  className={`cal-filter-btn ${filterType.includes(k) ? 'active' : ''}`}
                  style={filterType.includes(k) ? { background: v.bg, color: v.text, borderColor: v.dot } : {}}
                  onClick={() => toggleType(k)}
                >
                  {v.label}
                </button>
              ))}
            </div>
            <div className="cal-filters__group">
              <span className="cal-filters__label">Jour</span>
              {JOURS_LABELS.map((label, i) => (
                <button
                  key={i}
                  className={`cal-filter-btn ${filterDay.includes(i) ? 'active' : ''}`}
                  onClick={() => toggleDay(i)}
                >
                  {label.slice(0,3)}
                </button>
              ))}
            </div>
            <div className="cal-filters__group">
              <span className="cal-filters__label">Mois</span>
              <select
                className="cal-filter-select"
                value={filterMonth ?? ''}
                onChange={e => setFilterMonth(e.target.value === '' ? null : parseInt(e.target.value))}
              >
                <option value="">Tous les mois</option>
                {MONTHS.map((m, i) => <option key={i} value={i}>{m}</option>)}
              </select>
            </div>
            {hasFilters && (
              <button className="cal-filter-reset" onClick={resetFilters}>✕ Réinitialiser</button>
            )}
          </div>

          <div className="calendar-layout">
            {/* ── Grille ── */}
            <div className="calendar-wrap">
              <div className="calendar-nav">
                <button onClick={() => setCurrent(c => c.month === 0 ? { year: c.year-1, month:11 } : { ...c, month: c.month-1 })} className="cal-nav-btn">‹</button>
                <h2>{MONTHS[current.month]} {current.year}</h2>
                <button onClick={() => setCurrent(c => c.month === 11 ? { year: c.year+1, month:0 } : { ...c, month: c.month+1 })} className="cal-nav-btn">›</button>
              </div>

              <div className="calendar-grid">
                {DAYS.map(d => <div key={d} className="cal-day-label">{d}</div>)}
                {cells.map((date, i) => {
                  const dayActs = activitiesOnDay(date)
                  return (
                    <div
                      key={i}
                      className={`cal-cell ${!date ? 'cal-cell--empty' : ''} ${isToday(date) ? 'cal-cell--today' : ''} ${isSelected(date) ? 'cal-cell--selected' : ''} ${date && dayActs.length ? 'cal-cell--has-events' : ''}`}
                      onClick={() => date && (isSelected(date) ? setSelected(null) : setSelected(date.toISOString()))}
                    >
                      {date && (
                        <>
                          <span className="cal-cell__num">{date.getDate()}</span>
                          <div className="cal-cell__dots">
                            {dayActs.slice(0,3).map((a, idx) => (
                              <span key={idx} className="cal-cell__dot" style={{ background: TYPE_COLORS[a.type]?.dot || '#9ca3af' }} />
                            ))}
                            {dayActs.length > 3 && <span className="cal-cell__more">+{dayActs.length-3}</span>}
                          </div>
                        </>
                      )}
                    </div>
                  )
                })}
              </div>

              {/* Légende */}
              <div className="cal-legend">
                {Object.entries(TYPE_COLORS).filter(([k]) => k !== 'rando').map(([type, c]) => (
                  <div key={type} className="cal-legend__item">
                    <span style={{ width:10, height:10, borderRadius:'50%', background:c.dot, display:'inline-block' }} />
                    <span>{c.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Sidebar ── */}
            <div className="calendar-sidebar">
              {selected && selectedActivities.length > 0 ? (
                <>
                  <h3 className="cal-sidebar__title">
                    {new Date(selected).toLocaleDateString('fr-FR', { weekday:'long', day:'numeric', month:'long' })}
                  </h3>
                  <div className="cal-events">
                    {selectedActivities.map((a, i) => (
                      <ActivityCard key={i} activity={a} onClick={() => setDetail(a)} />
                    ))}
                  </div>
                  <button onClick={() => setSelected(null)} style={{ marginTop:'1rem', fontSize:'0.85rem', color:'var(--text-muted)', background:'none', border:'none', cursor:'pointer' }}>
                    ← Voir tout le planning
                  </button>
                </>
              ) : selected && selectedActivities.length === 0 ? (
                <>
                  <h3 className="cal-sidebar__title">
                    {new Date(selected).toLocaleDateString('fr-FR', { weekday:'long', day:'numeric', month:'long' })}
                  </h3>
                  <div style={{ color:'var(--text-muted)', fontSize:'0.88rem', textAlign:'center', padding:'2rem 0' }}>
                    <span style={{ fontSize:'2rem', display:'block', marginBottom:'0.5rem' }}>😴</span>
                    Pas d'activité ce jour
                    {hasFilters && <div style={{ marginTop:'0.5rem', fontSize:'0.8rem' }}>Essaie de modifier les filtres</div>}
                  </div>
                  <button onClick={() => setSelected(null)} style={{ marginTop:'0.5rem', fontSize:'0.85rem', color:'var(--text-muted)', background:'none', border:'none', cursor:'pointer' }}>
                    ← Retour
                  </button>
                </>
              ) : (
                <>
                  <h3 className="cal-sidebar__title">
                    {hasFilters ? 'Prochaines activités filtrées' : 'Prochaines activités'}
                  </h3>
                  {loading ? (
                    <div style={{ color:'var(--text-muted)', fontSize:'0.9rem' }}>Chargement...</div>
                  ) : upcoming.length === 0 ? (
                    <div style={{ color:'var(--text-muted)', fontSize:'0.9rem', textAlign:'center', padding:'2rem 0' }}>
                      <span style={{ fontSize:'2rem', display:'block', marginBottom:'0.5rem' }}>🏔️</span>
                      {hasFilters ? 'Aucune activité avec ces filtres' : 'Aucune activité programmée'}
                    </div>
                  ) : (
                    <div className="cal-events">
                      {upcoming.map((a, i) => (
                        <ActivityCard key={i} activity={a} onClick={() => setDetail(a)} />
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Modale détail ── */}
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
                {TYPE_COLORS[detail.type]?.label || detail.type}
              </span>
              <h2>{detail.titre}</h2>
              <p className="cal-detail-modal__desc">{detail.description?.slice(0,200)}…</p>
              <div className="cal-detail-modal__meta">
                <div>📅 {new Date(detail._occurrenceDate || detail.date || detail.dates?.[0]).toLocaleDateString('fr-FR', { weekday:'long', day:'numeric', month:'long', year:'numeric' })}</div>
                <div>🕐 {new Date(detail._occurrenceDate || detail.date || detail.dates?.[0]).toLocaleTimeString('fr-FR', { hour:'2-digit', minute:'2-digit' })}</div>
                {detail.schedule_type === 'multi_dates' && <div>🔁 {detail.dates?.length} dates cette saison</div>}
                <div>💶 {parseFloat(detail.prix).toFixed(2)}€ par enfant</div>
                <div>👥 {detail.places_restantes ?? '?'} place{detail.places_restantes > 1 ? 's' : ''} restante{detail.places_restantes > 1 ? 's' : ''}</div>
                {detail.lieu && <div>📍 {detail.lieu}</div>}
              </div>
              <div className="cal-detail-modal__actions">
                <Link to={`/activites/${detail.id}`} className="btn-primary" style={{ textDecoration:'none' }} onClick={() => setDetail(null)}>
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
  const dateStr = a._occurrenceDate || a.date
  const time = dateStr ? new Date(dateStr).toLocaleTimeString('fr-FR', { hour:'2-digit', minute:'2-digit' }) : ''
  return (
    <div className="cal-event-card" onClick={onClick} style={{ cursor:'pointer' }}>
      <div className="cal-event-card__stripe" style={{ background: colors.dot }} />
      <div className="cal-event-card__body">
        <div className="cal-event-card__header">
          <span className="cal-type-badge" style={{ background: colors.bg, color: colors.text }}>{a.type}</span>
          {time && <span className="cal-event-card__time">{time}</span>}
        </div>
        <h4>{a.titre}</h4>
        <div className="cal-event-card__meta">
          <span>💶 {parseFloat(a.prix).toFixed(2)}€</span>
          <span>👥 {a.places_restantes ?? '?'} pl.</span>
        </div>
      </div>
    </div>
  )
}
