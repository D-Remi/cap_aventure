import { useState } from 'react'
import ContactModal from './ContactModal'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
import './WeekCalendar.css'

const JOURS       = ['Lun','Mar','Mer','Jeu','Ven','Sam','Dim']
const HOURS       = Array.from({length:12}, (_,i) => i + 7)

const TYPE_STYLE = {
  contrat:   { bg:'rgba(83,74,183,0.1)', border:'#534AB7', text:'#3C3489', label:'📋 Contrat actif' },
  standard:  { bg:'#e8f5e9', border:'#4caf50', text:'#1b5e20', label:'🏠 Garde'     },
  adapte:    { bg:'#e3f2fd', border:'#1976d2', text:'#0d47a1', label:'🌿 Répit'     },
  evenement: { bg:'#fff3e0', border:'#f57c00', text:'#e65100', label:'🎉 Événement' },
  libre:     { bg:'white',   border:'#e0e0e0', text:'#bdbdbd', label:'○ Libre'       },
  complet:   { bg:'#ffebee', border:'#ef9a9a', text:'#b71c1c', label:'🔴 Complet'    },
  annule:    { bg:'#f5f5f5', border:'#bdbdbd', text:'#9e9e9e', label:'❌ Annulé'     },
}

const ACCUEIL_LABEL = {
  standard:  '🏠 Garde standard',
  adapte:    '🌿 Accueil adapté TSA/TDAH',
  evenement: '🎉 Animation événement',
}

function getWeekDates(ref) {
  const d   = new Date(ref)
  const day = (d.getDay() + 6) % 7
  const mon = new Date(d)
  mon.setDate(d.getDate() - day)
  return Array.from({length:7}, (_,i) => { const dt=new Date(mon); dt.setDate(mon.getDate()+i); return dt })
}

function timeToMin(t) {
  if (!t) return 0
  const [h,m] = t.split(':').map(Number)
  return h*60+m
}

function SlotModal({ slot, children, onClose, onBooked, isLoggedIn }) {
  const navigate = useNavigate()
  const [childId, setChildId] = useState('')
  const [notes,   setNotes]   = useState('')
  const [sending, setSending] = useState(false)

  const dateLabel = slot.date
    ? new Date(slot.date+'T00:00:00').toLocaleDateString('fr-FR',{weekday:'long',day:'numeric',month:'long',year:'numeric'})
    : '—'

  const submit = async () => {
    if (!childId) { toast.error('Choisissez un enfant'); return }
    setSending(true)
    try {
      await axios.post('/api/bookings', {
        slot_id:        slot.id,
        child_id:       +childId,
        formule:        slot.periode === 'journee' ? 'journee' : 'demi_journee',
        tarif_applique: slot.tarif,
        notes_parent:   notes,
      })
      toast.success('Demande envoyée ! Je vous confirme rapidement.')
      onBooked()
      onClose()
    } catch(e) {
      toast.error(e.response?.data?.message || 'Erreur lors de la réservation')
    } finally { setSending(false) }
  }

  return (
    <div className="slot-modal-overlay" onClick={onClose}>
      <div className="slot-modal" onClick={e => e.stopPropagation()}>
        <div className="slot-modal__head">
          <div>
            <h3>{slot.titre || 'Créneau disponible'}</h3>
            <span className="slot-modal__type">{ACCUEIL_LABEL[slot.type_accueil] || slot.type_accueil}</span>
          </div>
          <button className="slot-modal__close" onClick={onClose}>✕</button>
        </div>
        <div className="slot-modal__info">
          <div className="slot-modal__info-row"><span>📅</span><span>{dateLabel}</span></div>
          <div className="slot-modal__info-row"><span>🕐</span><span>{slot.heure_debut?.slice(0,5)} → {slot.heure_fin?.slice(0,5)}</span></div>
          <div className="slot-modal__info-row"><span>👥</span><span>{slot.places_max - slot.places_prises} place{slot.places_max - slot.places_prises > 1 ? 's' : ''} disponible{slot.places_max - slot.places_prises > 1 ? 's' : ''} / {slot.places_max}</span></div>
          {slot.lieu && <div className="slot-modal__info-row"><span>📍</span><span>{slot.lieu}</span></div>}
          {slot.description && <div className="slot-modal__info-row"><span>📝</span><span>{slot.description}</span></div>}
          <div className="slot-modal__info-row"><span>💶</span><span><strong>{parseFloat(slot.tarif).toFixed(0)}€</strong></span></div>
        </div>

        {isLoggedIn ? (
          <div className="slot-modal__form">
            <div className="slot-modal__field">
              <label>Enfant concerné *</label>
              <select value={childId} onChange={e => setChildId(e.target.value)}>
                <option value="">— Choisir —</option>
                {children.map(c => <option key={c.id} value={c.id}>{c.prenom} {c.nom}</option>)}
              </select>
            </div>
            <div className="slot-modal__field">
              <label>Message (optionnel)</label>
              <textarea rows={2} value={notes} onChange={e => setNotes(e.target.value)} placeholder="Informations particulières pour cette journée…"/>
            </div>
            <button className="btn-primary" onClick={submit} disabled={!childId || sending} style={{width:'100%',justifyContent:'center'}}>
              {sending ? 'Envoi en cours…' : 'Envoyer la demande de réservation'}
            </button>
            <p style={{fontSize:'.78rem',color:'var(--text-muted)',textAlign:'center',marginTop:'.5rem'}}>
              Je vous confirmerai par email dans les plus brefs délais.
            </p>
          </div>
        ) : (
          <div className="slot-modal__login">
            <p>Connectez-vous pour réserver ce créneau.</p>
            <div style={{display:'flex',gap:'.75rem',justifyContent:'center',flexWrap:'wrap'}}>
              <button className="btn-primary" onClick={() => navigate('/register')}>Créer un compte</button>
              <button className="btn-secondary" onClick={() => navigate('/login')}>Se connecter</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function WeekCalendar({ slots=[], children=[], onBooked, showEmpty=true, mode='public', isLoggedIn=false, contractedDates=[] }) {
  const [refDate, setRef] = useState(new Date())
  const [modal, setModal] = useState(null)
  const weekDates = getWeekDates(refDate)

  const prev = () => { const d=new Date(refDate); d.setDate(d.getDate()-7); setRef(d) }
  const next = () => { const d=new Date(refDate); d.setDate(d.getDate()+7); setRef(d) }

  const isToday = d => d.toDateString() === new Date().toDateString()

  const slotsByDate = {}
  slots.forEach(s => {
    const k = s.date?.slice(0,10)
    if (!slotsByDate[k]) slotsByDate[k] = []
    slotsByDate[k].push(s)
  })

  const TOP_OFFSET = 7*60
  const PX_MIN     = 64/60

  const slotPos = s => {
    const start  = timeToMin(s.heure_debut||'09:00')
    const end    = timeToMin(s.heure_fin  ||'17:30')
    const top    = (start - TOP_OFFSET) * PX_MIN
    const height = Math.max((end - start) * PX_MIN, 36)
    let key = s.type_accueil || 'standard'
    if (s.statut==='complet') key='complet'
    if (s.statut==='annule')  key='annule'
    return { top, height, ...TYPE_STYLE[key] }
  }

  const monthRange = () => {
    const s = weekDates[0], e = weekDates[6]
    if (s.getMonth()===e.getMonth())
      return s.toLocaleDateString('fr-FR',{month:'long',year:'numeric'})
    return `${s.toLocaleDateString('fr-FR',{month:'short'})} – ${e.toLocaleDateString('fr-FR',{month:'long',year:'numeric'})}`
  }

  const handleClick = (slot) => {
    if (slot._libre) {
      // Créneau libre → demande libre
      setModal({ type:'libre', date: slot.date })
    } else if (slot.statut === 'ouvert') {
      setModal(slot)
    }
  }

  return (
    <div className="wk-cal">
      <div className="wk-cal__nav">
        <button className="wk-nav-btn" onClick={prev}>‹</button>
        <div className="wk-cal__title">
          <span className="wk-cal__month">{monthRange()}</span>
          <button className="wk-today-btn" onClick={() => setRef(new Date())}>Aujourd'hui</button>
        </div>
        <button className="wk-nav-btn" onClick={next}>›</button>
      </div>

      <div className="wk-legend">
        {Object.entries(TYPE_STYLE).map(([k,v]) => (
          <span key={k} className="wk-legend-item" style={{background:v.bg,borderColor:v.border,color:v.text}}>{v.label}</span>
        ))}
      </div>

      <div className="wk-grid-wrap">
        <div className="wk-hours">
          <div className="wk-hours__head"/>
          {HOURS.map(h => <div key={h} className="wk-hour-cell">{h}h</div>)}
        </div>

        {weekDates.map((date, di) => {
          const ds       = date.toISOString().slice(0,10)
          const daySlots = slotsByDate[ds] || []
          const past     = date < new Date(new Date().toDateString())

          return (
            <div key={di} className={`wk-day-col ${isToday(date)?'wk-day-col--today':''} ${past?'wk-day-col--past':''}`}>
              <div className="wk-day-head">
                <span className="wk-day-name">{JOURS[di]}</span>
                <span className={`wk-day-num ${isToday(date)?'today':''}`}>{date.getDate()}</span>
              </div>
              <div className="wk-day-body">
                {HOURS.map(h => <div key={h} className="wk-hour-line"/>)}

                {contractedDates.includes(ds) && (
                  <div style={{position:'absolute',inset:0,background:'rgba(83,74,183,0.08)',borderLeft:'3px solid #534AB7',pointerEvents:'none',zIndex:0}}/>
                )}
                {!past && showEmpty && daySlots.length === 0 && (
                  <div className="wk-slot wk-slot--libre wk-slot--clickable"
                    style={{top:0,height:'100%',cursor:'pointer'}}
                    onClick={() => handleClick({ _libre:true, date:ds })}>
                    <span style={{fontSize:'.75rem',color:'#bdbdbd',textAlign:'center'}}>○ Libre<br/><span style={{fontSize:'.68rem'}}>Cliquez pour<br/>demander</span></span>
                  </div>
                )}

                {daySlots.map(s => {
                  const p = slotPos(s)
                  const clickable = s.statut === 'ouvert'
                  return (
                    <div key={s.id}
                      className={`wk-slot ${clickable?'wk-slot--clickable':''}`}
                      style={{top:p.top,height:p.height,background:p.bg,borderLeftColor:p.border,color:p.text}}
                      onClick={() => clickable && handleClick(s)}
                    >
                      <span className="wk-slot__type" style={{color:p.text}}>{p.label}</span>
                      {s.titre && <span className="wk-slot__title">{s.titre}</span>}
                      <span className="wk-slot__time">{s.heure_debut?.slice(0,5)}–{s.heure_fin?.slice(0,5)}</span>
                      {s.statut==='ouvert' && <span className="wk-slot__places">{s.places_max-s.places_prises} pl.</span>}
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      {/* Modal réservation */}
      {modal && !modal._libre && modal.type !== 'libre' && (
        <SlotModal
          slot={modal}
          children={children}
          isLoggedIn={isLoggedIn}
          onClose={() => setModal(null)}
          onBooked={onBooked || (() => {})}
        />
      )}

      {/* Modal demande créneau libre → ContactModal */}
      {modal && (modal._libre || modal.type === 'libre') && (
        <ContactModal
          onClose={() => setModal(null)}
          prefillDate={modal.date || null}
        />
      )}
    </div>
  )
}