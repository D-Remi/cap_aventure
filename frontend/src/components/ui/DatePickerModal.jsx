import { useState, useEffect } from 'react'
import axios from 'axios'
import './DatePickerModal.css'

const SUB_LABELS = {
  essai:       { label: 'Journée d\'essai', nb: 1,    mode: 'pick' },
  seance:      { label: 'À la séance',       nb: 1,    mode: 'pick' },
  mensuel:     { label: 'Mensuel',           nb: 4,    mode: 'pick' },
  trimestriel: { label: 'Trimestriel',       nb: null, mode: 'start' },
  semestriel:  { label: 'Semestriel',        nb: null, mode: 'start' },
  annuel:      { label: 'Annuel',            nb: null, mode: 'start' },
}

export default function DatePickerModal({ registration, onClose, onSaved }) {
  const activity      = registration.activity
  const subType       = registration.subscription_type || 'seance'
  const subInfo       = SUB_LABELS[subType] || SUB_LABELS.seance
  const allDates      = (activity.dates || []).map(d => new Date(d)).filter(d => d >= new Date()).sort((a,b) => a-b)

  const [selectedDates, setSelectedDates] = useState([])
  const [startDate, setStartDate]         = useState('')
  const [computedDates, setComputedDates] = useState([])
  const [saving, setSaving]               = useState(false)
  const [msg, setMsg]                     = useState('')

  // Charger les dates déjà choisies
  useEffect(() => {
    axios.get(`/api/registration-dates/${registration.id}`)
      .then(r => {
        if (r.data.length > 0) {
          setSelectedDates(r.data.map(d => new Date(d.date).toISOString()))
        }
      })
      .catch(() => {})
  }, [registration.id])

  // Calculer les dates auto quand startDate change (mode 'start')
  useEffect(() => {
    if (subInfo.mode !== 'start' || !startDate) return
    axios.post('/api/registration-dates/compute', {
      registration_id: registration.id,
      start_date: startDate,
    }).then(r => {
      setComputedDates(r.data.dates || [])
      setSelectedDates(r.data.dates || [])
    }).catch(() => {})
  }, [startDate])

  const toggleDate = (isoDate) => {
    if (subInfo.mode === 'start') return // en mode start on ne toggle pas
    setSelectedDates(prev => {
      const isSelected = prev.some(d => sameDay(new Date(d), new Date(isoDate)))
      if (isSelected) return prev.filter(d => !sameDay(new Date(d), new Date(isoDate)))
      if (subInfo.nb && prev.length >= subInfo.nb) {
        setMsg(`Maximum ${subInfo.nb} date${subInfo.nb > 1 ? 's' : ''} pour la formule ${subInfo.label}`)
        return prev
      }
      setMsg('')
      return [...prev, isoDate]
    })
  }

  const isSelected = (date) => selectedDates.some(d => sameDay(new Date(d), date))
  const isComputed = (date) => computedDates.some(d => sameDay(new Date(d), date))

  const handleSave = async () => {
    if (selectedDates.length === 0) { setMsg('Sélectionnez au moins une date.'); return }
    setSaving(true); setMsg('')
    try {
      await axios.post('/api/registration-dates/save', {
        registration_id: registration.id,
        dates: selectedDates,
      })
      onSaved?.()
      onClose()
    } catch (e) {
      setMsg(e.response?.data?.message || 'Erreur lors de la sauvegarde.')
    } finally { setSaving(false) }
  }

  // Grouper les dates par mois pour l'affichage
  const datesByMonth = {}
  allDates.forEach(d => {
    const key = d.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
    if (!datesByMonth[key]) datesByMonth[key] = []
    datesByMonth[key].push(d)
  })

  const MONTHS = Object.keys(datesByMonth)

  return (
    <div className="dpm-overlay" onClick={onClose}>
      <div className="dpm-modal" onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="dpm-header">
          <div>
            <h2>{activity.titre}</h2>
            <span className="dpm-sub-badge">{subInfo.label}</span>
          </div>
          <button className="dpm-close" onClick={onClose}>✕</button>
        </div>

        {/* Instructions */}
        <div className="dpm-instructions">
          {subInfo.mode === 'pick' ? (
            <p>
              {subInfo.nb === 1
                ? '👆 Sélectionnez 1 date pour votre séance'
                : `👆 Sélectionnez ${subInfo.nb} dates pour votre formule ${subInfo.label}`
              }
              <span className="dpm-counter">
                {selectedDates.length} / {subInfo.nb ?? '∞'} sélectionnée{selectedDates.length > 1 ? 's' : ''}
              </span>
            </p>
          ) : (
            <div className="dpm-start-picker">
              <p>📅 Choisissez votre date de début — les séances suivantes sont calculées automatiquement</p>
              <div style={{ display:'flex', alignItems:'center', gap:'0.75rem', flexWrap:'wrap' }}>
                <label style={{ fontWeight:700, fontSize:'0.88rem' }}>Date de début :</label>
                <select
                  value={startDate}
                  onChange={e => setStartDate(e.target.value)}
                  style={{ padding:'0.4rem 0.75rem', borderRadius:'8px', border:'1.5px solid #dde8e1', fontFamily:'inherit' }}
                >
                  <option value="">-- Choisir --</option>
                  {allDates.map(d => (
                    <option key={d.toISOString()} value={d.toISOString()}>
                      {d.toLocaleDateString('fr-FR', { weekday:'short', day:'numeric', month:'long', year:'numeric' })}
                    </option>
                  ))}
                </select>
                {computedDates.length > 0 && (
                  <span style={{ fontSize:'0.82rem', color:'var(--vert-foret)', fontWeight:700 }}>
                    ✅ {computedDates.length} séances sélectionnées automatiquement
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Calendrier des dates disponibles */}
        <div className="dpm-dates-container">
          {MONTHS.length === 0 ? (
            <div className="dpm-empty">Aucune date disponible pour cette activité.</div>
          ) : (
            MONTHS.map(month => (
              <div key={month} className="dpm-month">
                <h3 className="dpm-month__title">{month}</h3>
                <div className="dpm-month__grid">
                  {datesByMonth[month].map(d => {
                    const iso = d.toISOString()
                    const sel = isSelected(d)
                    const comp = isComputed(d)
                    return (
                      <button
                        key={iso}
                        type="button"
                        className={`dpm-date-btn ${sel ? 'selected' : ''} ${comp && !sel ? 'computed' : ''}`}
                        onClick={() => toggleDate(iso)}
                        disabled={subInfo.mode === 'start'}
                        title={d.toLocaleDateString('fr-FR', { weekday:'long', day:'numeric', month:'long' })}
                      >
                        <span className="dpm-date-btn__day">
                          {d.toLocaleDateString('fr-FR', { weekday:'short' })}
                        </span>
                        <span className="dpm-date-btn__num">
                          {d.getDate()}
                        </span>
                        <span className="dpm-date-btn__month">
                          {d.toLocaleDateString('fr-FR', { month:'short' })}
                        </span>
                        {sel && <span className="dpm-date-btn__check">✓</span>}
                      </button>
                    )
                  })}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="dpm-footer">
          {msg && <p className="dpm-msg">{msg}</p>}

          {selectedDates.length > 0 && (
            <div className="dpm-summary">
              <strong>{selectedDates.length} date{selectedDates.length > 1 ? 's' : ''} choisie{selectedDates.length > 1 ? 's' : ''} :</strong>
              <div className="dpm-summary__dates">
                {selectedDates
                  .sort((a,b) => new Date(a) - new Date(b))
                  .map(d => (
                    <span key={d} className="dpm-summary__date">
                      {new Date(d).toLocaleDateString('fr-FR', { day:'numeric', month:'short' })}
                    </span>
                  ))
                }
              </div>
            </div>
          )}

          <div style={{ display:'flex', gap:'0.75rem' }}>
            <button className="btn-primary" onClick={handleSave} disabled={saving || selectedDates.length === 0}>
              {saving ? '⏳ Sauvegarde...' : '✅ Confirmer mes dates'}
            </button>
            <button className="btn-secondary" onClick={onClose}>Annuler</button>
          </div>
        </div>
      </div>
    </div>
  )
}

function sameDay(a, b) {
  return a.getFullYear() === b.getFullYear() &&
         a.getMonth()    === b.getMonth() &&
         a.getDate()     === b.getDate()
}
