import { useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import './MultiDateBooking.css'

export default function MultiDateBooking({ children = [], isLoggedIn, onClose, prefillDate = null }) {
  const navigate = useNavigate()
  const [mode,       setMode]       = useState('libre')  // 'libre' | 'periode'
  const [dates,      setDates]      = useState(prefillDate ? [prefillDate] : [])
  const [dateInput,  setDateInput]  = useState('')
  const [dateDebut,  setDateDebut]  = useState(prefillDate || '')
  const [dateFin,    setDateFin]    = useState('')
  const [joursCoches,setJours]      = useState([1,2,3,4,5]) // lun-ven par défaut
  const [childId,    setChildId]    = useState('')
  const [service,    setService]    = useState('garde')
  const [heureDebut, setHeureDebut] = useState('09:00')
  const [heureFin,   setHeureFin]   = useState('17:00')
  const [message,    setMessage]    = useState('')
  const [sending,    setSending]    = useState(false)

  const JOURS_L = ['Lun','Mar','Mer','Jeu','Ven','Sam','Dim']
  const SERVICES = { garde:'🏠 Garde', repit:'🌿 Répit TSA/TDAH', evenement:'🎉 Animation' }

  const addDate = () => {
    if (!dateInput) return
    if (!dates.includes(dateInput)) setDates(d => [...d, dateInput].sort())
    setDateInput('')
  }

  const removeDate = (d) => setDates(prev => prev.filter(x => x !== d))

  const toggleJour = (j) => setJours(prev => prev.includes(j) ? prev.filter(x=>x!==j) : [...prev,j])

  // Calculer les dates de la période selon les jours cochés
  const datesFromPeriode = () => {
    if (!dateDebut || !dateFin) return []
    const result = []
    const cur = new Date(dateDebut+'T00:00:00')
    const end = new Date(dateFin+'T00:00:00')
    while (cur <= end) {
      const dow = (cur.getDay() + 6) % 7
      if (joursCoches.includes(dow)) result.push(cur.toISOString().slice(0,10))
      cur.setDate(cur.getDate() + 1)
    }
    return result
  }

  const allDates = mode === 'periode' ? datesFromPeriode() : dates

  const submit = async () => {
    if (allDates.length === 0) { toast.error('Sélectionnez au moins une date'); return }
    if (!childId)              { toast.error('Choisissez un enfant'); return }
    setSending(true)
    try {
      await axios.post('/api/contact', {
        prenom:    '',
        email:     '',
        service,
        message:   `DEMANDE DE RÉSERVATION GROUPÉE\n\nEnfant : ${children.find(c=>c.id===+childId)?.prenom} ${children.find(c=>c.id===+childId)?.nom}\nService : ${SERVICES[service]}\nHoraires : ${heureDebut} → ${heureFin}\nDates demandées (${allDates.length}) :\n${allDates.map(d=>new Date(d+'T00:00:00').toLocaleDateString('fr-FR',{weekday:'long',day:'numeric',month:'long'})).join('\n')}\n\nMessage : ${message}`,
        enfant_prenom: children.find(c=>c.id===+childId)?.prenom,
        _multi: true,
        _dates: allDates,
        _child_id: childId,
      })
      toast.success(`Demande envoyée pour ${allDates.length} date${allDates.length>1?'s':''} ! Je vous confirme rapidement.`)
      onClose()
    } catch { toast.error('Erreur lors de l\'envoi') }
    finally { setSending(false) }
  }

  const fmtDate = d => new Date(d+'T00:00:00').toLocaleDateString('fr-FR',{weekday:'short',day:'numeric',month:'short'})

  if (!isLoggedIn) return (
    <div className="mdb-overlay" onClick={onClose}>
      <div className="mdb" onClick={e=>e.stopPropagation()}>
        <div className="mdb__head"><h3>📅 Demander des créneaux</h3><button onClick={onClose}>✕</button></div>
        <div className="mdb__body" style={{textAlign:'center',padding:'2rem'}}>
          <p style={{marginBottom:'1.25rem',color:'var(--text-muted)'}}>Connectez-vous pour envoyer une demande de réservation.</p>
          <div style={{display:'flex',gap:'.75rem',justifyContent:'center'}}>
            <button className="btn-primary" onClick={()=>navigate('/register')}>Créer un compte</button>
            <button className="btn-secondary" onClick={()=>navigate('/login')}>Se connecter</button>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="mdb-overlay" onClick={onClose}>
      <div className="mdb" onClick={e=>e.stopPropagation()}>
        <div className="mdb__head">
          <div><h3>📅 Demander des créneaux</h3><span>{allDates.length} date{allDates.length>1?'s':''} sélectionnée{allDates.length>1?'s':''}</span></div>
          <button onClick={onClose}>✕</button>
        </div>
        <div className="mdb__body">

          {/* Mode sélection */}
          <div className="mdb__mode-toggle">
            <button className={mode==='libre'?'active':''} onClick={()=>setMode('libre')}>📌 Dates libres</button>
            <button className={mode==='periode'?'active':''} onClick={()=>setMode('periode')}>📆 Période</button>
          </div>

          {/* Mode dates libres */}
          {mode === 'libre' && (
            <div className="mdb__section">
              <label>Ajouter des dates</label>
              <div style={{display:'flex',gap:'.5rem'}}>
                <input type="date" value={dateInput} onChange={e=>setDateInput(e.target.value)}
                  style={{flex:1,padding:'.5rem',border:'1.5px solid var(--sable-dark)',borderRadius:8,fontFamily:'inherit'}}/>
                <button className="btn-primary" onClick={addDate} style={{fontSize:'.85rem',padding:'.5rem 1rem'}}>Ajouter</button>
              </div>
              {dates.length > 0 && (
                <div className="mdb__dates-list">
                  {dates.map(d => (
                    <span key={d} className="mdb__date-tag">
                      {fmtDate(d)}
                      <button onClick={()=>removeDate(d)}>✕</button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Mode période */}
          {mode === 'periode' && (
            <div className="mdb__section">
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'.75rem',marginBottom:'.85rem'}}>
                <div>
                  <label>Du *</label>
                  <input type="date" value={dateDebut} onChange={e=>setDateDebut(e.target.value)}
                    style={{width:'100%',padding:'.5rem',border:'1.5px solid var(--sable-dark)',borderRadius:8,fontFamily:'inherit'}}/>
                </div>
                <div>
                  <label>Au *</label>
                  <input type="date" value={dateFin} onChange={e=>setDateFin(e.target.value)}
                    style={{width:'100%',padding:'.5rem',border:'1.5px solid var(--sable-dark)',borderRadius:8,fontFamily:'inherit'}}/>
                </div>
              </div>
              <label style={{display:'block',marginBottom:'.4rem',fontSize:'.78rem',fontWeight:700,textTransform:'uppercase',color:'var(--nuit)'}}>Jours souhaités</label>
              <div style={{display:'flex',gap:'.4rem',flexWrap:'wrap',marginBottom:'.85rem'}}>
                {JOURS_L.map((j,i) => (
                  <button key={i} onClick={()=>toggleJour(i)}
                    style={{padding:'.3rem .75rem',borderRadius:50,border:`1.5px solid ${joursCoches.includes(i)?'var(--sauge)':'var(--sable-dark)'}`,
                      background:joursCoches.includes(i)?'var(--sauge)':'white',
                      color:joursCoches.includes(i)?'white':'var(--nuit)',
                      fontWeight:700,fontSize:'.82rem',cursor:'pointer',fontFamily:'inherit'}}>
                    {j}
                  </button>
                ))}
              </div>
              {datesFromPeriode().length > 0 && (
                <div className="mdb__dates-preview">
                  <span style={{fontSize:'.78rem',color:'var(--text-muted)',fontWeight:600}}>{datesFromPeriode().length} date{datesFromPeriode().length>1?'s':''} :</span>
                  <div className="mdb__dates-list">
                    {datesFromPeriode().map(d => <span key={d} className="mdb__date-tag">{fmtDate(d)}</span>)}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Détails */}
          <div className="mdb__section">
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'.75rem'}}>
              <div>
                <label>Enfant *</label>
                <select value={childId} onChange={e=>setChildId(e.target.value)}
                  style={{width:'100%',padding:'.5rem',border:'1.5px solid var(--sable-dark)',borderRadius:8,fontFamily:'inherit'}}>
                  <option value="">— Choisir —</option>
                  {children.map(c=><option key={c.id} value={c.id}>{c.prenom}</option>)}
                </select>
              </div>
              <div>
                <label>Service</label>
                <select value={service} onChange={e=>setService(e.target.value)}
                  style={{width:'100%',padding:'.5rem',border:'1.5px solid var(--sable-dark)',borderRadius:8,fontFamily:'inherit'}}>
                  {Object.entries(SERVICES).map(([v,l])=><option key={v} value={v}>{l}</option>)}
                </select>
              </div>
              <div>
                <label>Heure début</label>
                <input type="time" value={heureDebut} onChange={e=>setHeureDebut(e.target.value)}
                  style={{width:'100%',padding:'.5rem',border:'1.5px solid var(--sable-dark)',borderRadius:8,fontFamily:'inherit'}}/>
              </div>
              <div>
                <label>Heure fin</label>
                <input type="time" value={heureFin} onChange={e=>setHeureFin(e.target.value)}
                  style={{width:'100%',padding:'.5rem',border:'1.5px solid var(--sable-dark)',borderRadius:8,fontFamily:'inherit'}}/>
              </div>
            </div>
          </div>

          <div className="mdb__section">
            <label>Message (optionnel)</label>
            <textarea rows={2} value={message} onChange={e=>setMessage(e.target.value)}
              placeholder="Informations complémentaires…"
              style={{width:'100%',padding:'.5rem',border:'1.5px solid var(--sable-dark)',borderRadius:8,fontFamily:'inherit',resize:'none'}}/>
          </div>

          {/* Résumé */}
          {allDates.length > 0 && (
            <div style={{background:'var(--sable-light)',borderRadius:10,padding:'.75rem 1rem',fontSize:'.82rem',color:'var(--nuit)',marginBottom:'.5rem'}}>
              📋 <strong>{allDates.length} journée{allDates.length>1?'s':''}</strong> · {heureDebut}→{heureFin} · {SERVICES[service]}
            </div>
          )}

          <button className="btn-primary" onClick={submit} disabled={allDates.length===0||!childId||sending}
            style={{width:'100%',justifyContent:'center'}}>
            {sending ? 'Envoi…' : `Envoyer la demande (${allDates.length} date${allDates.length>1?'s':''})`}
          </button>
          <p style={{fontSize:'.75rem',color:'var(--text-muted)',textAlign:'center',marginTop:'.5rem'}}>
            Je vous confirme chaque date par email.
          </p>
        </div>
      </div>
    </div>
  )
}