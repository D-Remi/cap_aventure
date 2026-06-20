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
  const SERVICES = { garde:'Garde', repit:'Répit TSA/TDAH', evenement:'Animation' }

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

  // État du formulaire invité
  const [guestMode,   setGuestMode]   = useState(null) // null | 'login' | 'register' | 'guest'
  const [guestPrenom, setGuestPrenom] = useState('')
  const [guestEmail,  setGuestEmail]  = useState('')
  const [guestTel,    setGuestTel]    = useState('')
  const [guestSent,   setGuestSent]   = useState(false)

  const submitGuest = async () => {
    if (!guestPrenom || !guestEmail) { toast.error('Prénom et email obligatoires'); return }
    if (allDates.length === 0)       { toast.error('Sélectionnez au moins une date'); return }
    try {
      await axios.post('/api/contact', {
        prenom: guestPrenom,
        email:  guestEmail,
        telephone: guestTel,
        service,
        message: [
          'DEMANDE DE RÉSERVATION GROUPÉE',
          `Enfant : (à préciser)`,
          `Service : ${SERVICES[service] || service}`,
          `Horaires : ${heureDebut} → ${heureFin}`,
          `Dates demandées (${allDates.length}) :`,
          ...allDates.map(d => new Date(d+'T00:00:00').toLocaleDateString('fr-FR',{weekday:'long',day:'numeric',month:'long'})),
          '',
          `Message : ${message || '(aucun)'}`,
        ].join('\n'),
      })
      setGuestSent(true)
      toast.success('Demande envoyée ! Je vous recontacte sous 24h.')
    } catch { toast.error("Erreur lors de l'envoi") }
  }

  if (!isLoggedIn) return (
    <div className="mdb-overlay" onClick={onClose}>
      <div className="mdb" onClick={e=>e.stopPropagation()}>
        <div className="mdb__head">
          <div><h3>Demander des créneaux</h3><span>Choisissez comment continuer</span></div>
          <button onClick={onClose}></button>
        </div>
        <div className="mdb__body">

          {/* Sélection du mode */}
          {!guestMode && !guestSent && (
            <div style={{display:'flex',flexDirection:'column',gap:'.85rem'}}>
              <p style={{fontSize:'.92rem',color:'var(--text-muted)',marginBottom:'.5rem',lineHeight:1.6}}>
                Pour envoyer une demande de dates, vous pouvez :
              </p>

              {/* Option 1 — Compte */}
              <button onClick={() => navigate('/register')}
                style={{background:'var(--nuit)',color:'white',border:'none',borderRadius:12,padding:'1.1rem 1.25rem',cursor:'pointer',fontFamily:'inherit',textAlign:'left',transition:'opacity .2s'}}
                onMouseEnter={e=>e.currentTarget.style.opacity='.88'} onMouseLeave={e=>e.currentTarget.style.opacity='1'}>
                <div style={{fontWeight:700,fontSize:'1rem',marginBottom:'.25rem'}}>Créer un compte</div>
                <div style={{fontSize:'.82rem',color:'rgba(255,255,255,.65)'}}>Suivez vos demandes, réservations, contrats et photos en un seul endroit.</div>
              </button>

              {/* Option 2 — Connexion */}
              <button onClick={() => navigate('/login')}
                style={{background:'var(--sable-light)',color:'var(--nuit)',border:'1.5px solid var(--sable-dark)',borderRadius:12,padding:'1.1rem 1.25rem',cursor:'pointer',fontFamily:'inherit',textAlign:'left',transition:'all .2s'}}
                onMouseEnter={e=>{e.currentTarget.style.background='white';e.currentTarget.style.borderColor='var(--sauge)'}}
                onMouseLeave={e=>{e.currentTarget.style.background='var(--sable-light)';e.currentTarget.style.borderColor='var(--sable-dark)'}}>
                <div style={{fontWeight:700,fontSize:'1rem',marginBottom:'.25rem'}}>Se connecter</div>
                <div style={{fontSize:'.82rem',color:'var(--text-muted)'}}>Vous avez déjà un compte ? Connectez-vous pour envoyer votre demande.</div>
              </button>

              {/* Option 3 — Sans compte */}
              <button onClick={() => setGuestMode('guest')}
                style={{background:'white',color:'var(--nuit)',border:'1.5px solid var(--sable-dark)',borderRadius:12,padding:'1.1rem 1.25rem',cursor:'pointer',fontFamily:'inherit',textAlign:'left',transition:'all .2s'}}
                onMouseEnter={e=>{e.currentTarget.style.borderColor='var(--sauge)'}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor='var(--sable-dark)'}}>
                <div style={{fontWeight:700,fontSize:'1rem',marginBottom:'.25rem'}}>Envoyer sans s'inscrire</div>
                <div style={{fontSize:'.82rem',color:'var(--text-muted)'}}>Laissez juste vos coordonnées et les dates souhaitées. Je vous recontacte sous 24h.</div>
              </button>

              <div style={{display:'flex',alignItems:'center',gap:'.75rem',margin:'.25rem 0',color:'var(--text-muted)',fontSize:'.78rem'}}>
                <div style={{flex:1,height:'1px',background:'var(--sable-light)'}}/>
                <span>ou</span>
                <div style={{flex:1,height:'1px',background:'var(--sable-light)'}}/>
              </div>

              <a href={`https://wa.me/33752096698?text=${encodeURIComponent('Bonjour, je souhaite demander des créneaux de garde pour mon enfant.')}`}
                target="_blank" rel="noopener noreferrer"
                style={{background:'#25D366',color:'white',borderRadius:12,padding:'1rem 1.25rem',cursor:'pointer',fontFamily:'inherit',textAlign:'left',display:'flex',gap:'.85rem',alignItems:'center',textDecoration:'none'}}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="white" style={{flexShrink:0}}>
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                <div>
                  <div style={{fontWeight:700,fontSize:'1rem',marginBottom:'.15rem'}}>WhatsApp</div>
                  <div style={{fontSize:'.82rem',color:'rgba(255,255,255,.8)'}}>La façon la plus rapide.</div>
                </div>
              </a>
            </div>
          )}

          {/* Formulaire sans compte */}
          {guestMode === 'guest' && !guestSent && (
            <div>
              <button onClick={() => setGuestMode(null)}
                style={{background:'none',border:'none',color:'var(--text-muted)',cursor:'pointer',fontSize:'.85rem',marginBottom:'1rem',fontFamily:'inherit',padding:0}}>
                ← Retour
              </button>
              <h4 style={{fontFamily:"'Baloo 2',cursive",color:'var(--nuit)',marginBottom:'1rem'}}>Vos coordonnées</h4>

              {/* Sélection dates intégrée */}
              <div style={{marginBottom:'1rem'}}>
                <div className="mdb__mode-toggle" style={{marginBottom:'1rem'}}>
                  <button className={mode==='libre'?'active':''} onClick={()=>setMode('libre')}>Dates libres</button>
                  <button className={mode==='periode'?'active':''} onClick={()=>setMode('periode')}>Période</button>
                </div>
                {mode==='libre' && (
                  <div style={{display:'flex',gap:'.5rem',marginBottom:'.5rem'}}>
                    <input type="date" value={dateInput} onChange={e=>setDateInput(e.target.value)}
                      style={{flex:1,padding:'.45rem',border:'1.5px solid var(--sable-dark)',borderRadius:8,fontFamily:'inherit'}}/>
                    <button className="btn-primary" onClick={addDate} style={{fontSize:'.82rem',padding:'.45rem .9rem'}}>Ajouter</button>
                  </div>
                )}
                {mode==='periode' && (
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'.5rem',marginBottom:'.5rem'}}>
                    <input type="date" value={dateDebut} onChange={e=>setDateDebut(e.target.value)}
                      placeholder="Du"
                      style={{padding:'.45rem',border:'1.5px solid var(--sable-dark)',borderRadius:8,fontFamily:'inherit'}}/>
                    <input type="date" value={dateFin} onChange={e=>setDateFin(e.target.value)}
                      placeholder="Au"
                      style={{padding:'.45rem',border:'1.5px solid var(--sable-dark)',borderRadius:8,fontFamily:'inherit'}}/>
                  </div>
                )}
                {allDates.length > 0 && (
                  <div className="mdb__dates-list">
                    {allDates.map((d,i) => (
                      <span key={i} className="mdb__date-tag">
                        {new Date(d+'T00:00:00').toLocaleDateString('fr-FR',{weekday:'short',day:'numeric',month:'short'})}
                        {mode==='libre' && <button onClick={()=>removeDate(d)}></button>}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'.75rem',marginBottom:'.75rem'}}>
                <div>
                  <label style={{fontSize:'.78rem',fontWeight:700,color:'var(--nuit)',display:'block',marginBottom:3,textTransform:'uppercase'}}>Prénom *</label>
                  <input value={guestPrenom} onChange={e=>setGuestPrenom(e.target.value)} placeholder="Votre prénom"
                    style={{width:'100%',padding:'.5rem',border:'1.5px solid var(--sable-dark)',borderRadius:8,fontFamily:'inherit'}}/>
                </div>
                <div>
                  <label style={{fontSize:'.78rem',fontWeight:700,color:'var(--nuit)',display:'block',marginBottom:3,textTransform:'uppercase'}}>Email *</label>
                  <input type="email" value={guestEmail} onChange={e=>setGuestEmail(e.target.value)} placeholder="votre@email.fr"
                    style={{width:'100%',padding:'.5rem',border:'1.5px solid var(--sable-dark)',borderRadius:8,fontFamily:'inherit'}}/>
                </div>
              </div>
              <div style={{marginBottom:'1rem'}}>
                <label style={{fontSize:'.78rem',fontWeight:700,color:'var(--nuit)',display:'block',marginBottom:3,textTransform:'uppercase'}}>Téléphone</label>
                <input value={guestTel} onChange={e=>setGuestTel(e.target.value)} placeholder="06..."
                  style={{width:'100%',padding:'.5rem',border:'1.5px solid var(--sable-dark)',borderRadius:8,fontFamily:'inherit'}}/>
              </div>
              <button onClick={submitGuest} className="btn-primary"
                style={{width:'100%',justifyContent:'center'}}
                disabled={!guestPrenom||!guestEmail||allDates.length===0}>
                Envoyer ma demande ({allDates.length} date{allDates.length>1?'s':''})
              </button>
              <p style={{fontSize:'.75rem',color:'var(--text-muted)',textAlign:'center',marginTop:'.6rem'}}>
                Réponse sous 24h · Aucun engagement · Sans création de compte
              </p>
            </div>
          )}

          {/* Confirmation */}
          {guestSent && (
            <div style={{textAlign:'center',padding:'2rem'}}>
              <div style={{fontSize:'3rem',marginBottom:'1rem'}}></div>
              <h3 style={{fontFamily:"'Baloo 2',cursive",color:'var(--nuit)',marginBottom:'.5rem'}}>Demande envoyée !</h3>
              <p style={{color:'var(--text-muted)'}}>Je vous recontacte sous 24h pour confirmer les disponibilités.</p>
              <button onClick={onClose} className="btn-primary" style={{marginTop:'1.5rem'}}>Fermer</button>
            </div>
          )}

        </div>
      </div>
    </div>
  )

  return (
    <div className="mdb-overlay" onClick={onClose}>
      <div className="mdb" onClick={e=>e.stopPropagation()}>
        <div className="mdb__head">
          <div><h3>Demander des créneaux</h3><span>{allDates.length} date{allDates.length>1?'s':''} sélectionnée{allDates.length>1?'s':''}</span></div>
          <button onClick={onClose}></button>
        </div>
        <div className="mdb__body">

          {/* Mode sélection */}
          <div className="mdb__mode-toggle">
            <button className={mode==='libre'?'active':''} onClick={()=>setMode('libre')}>Dates libres</button>
            <button className={mode==='periode'?'active':''} onClick={()=>setMode('periode')}>Période</button>
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
                      <button onClick={()=>removeDate(d)}></button>
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
              <strong>{allDates.length} journée{allDates.length>1?'s':''}</strong> · {heureDebut}→{heureFin} · {SERVICES[service]}
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