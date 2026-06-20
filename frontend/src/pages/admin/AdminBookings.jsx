import { useState, useEffect } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import AdminLayout from '../../components/layout/AdminLayout'
import { useState as _useState } from 'react'

const ST = {
  pending:   { bg:'#fff8e1', c:'#f57f17', l:'En attente' },
  confirmed: { bg:'#e8f5e9', c:'#2e7d32', l:'Confirmé' },
  cancelled: { bg:'#fee2e2', c:'#991b1b', l:'Annulé' },
  no_show:   { bg:'#f3f4f6', c:'#6b7280', l:'Absent' },
}

export default function AdminBookings() {
  const [bookings, setBookings] = useState([])
  const [selected, setSelected] = useState(null)
  const [cr, setCr] = useState('')
  const [filter, setFilter] = useState('pending')

  useEffect(()=>{ fetch() },[])

  const fetch = () => axios.get('/api/bookings').then(r=>setBookings(r.data)).catch(()=>{})

  const confirm = async id => {
    await axios.patch(`/api/bookings/${id}/confirm`)
    toast.success('Réservation confirmée — email envoyé')
    fetch(); if(selected?.id===id) setSelected(s=>({...s,status:'confirmed'}))
  }

  const cancel = async id => {
    if(!window.confirm('Annuler cette réservation ?')) return
    await axios.patch(`/api/bookings/${id}/cancel`)
    toast.success('Réservation annulée')
    fetch()
  }

  const saveCr = async () => {
    await axios.patch(`/api/bookings/${selected.id}/compte-rendu`, { texte: cr })
    toast.success('Compte-rendu sauvegardé')
    fetch(); setSelected(s=>({...s,compte_rendu:cr}))
  }

  const filtered = bookings.filter(b => filter==='tous' || b.status===filter)

  return (
    <AdminLayout>
      <div className="admin-page">
        <div className="admin-page__header">
          <div>
            <h1>Réservations</h1>
            <p className="admin-page__subtitle">{bookings.filter(b=>b.status==='pending').length} en attente de confirmation</p>
          </div>
        </div>

        <div style={{display:'flex',gap:'.6rem',marginBottom:'1.5rem',flexWrap:'wrap'}}>
          {[{v:'pending',l:'En attente'},{v:'confirmed',l:'Confirmées'},{v:'cancelled',l:'Annulées'},{v:'tous',l:'Toutes'}].map(({v,l})=>(
            <button key={v} className={`cal-filter-btn ${filter===v?'active':''}`} onClick={()=>setFilter(v)}>{l}</button>
          ))}
        </div>

        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1.5rem',alignItems:'start'}}>
          <div style={{display:'flex',flexDirection:'column',gap:'.65rem'}}>
            {filtered.map(b=>{
              const st=ST[b.status]||ST.pending
              return(
                <div key={b.id} onClick={()=>{setSelected(b);setCr(b.compte_rendu||'')}}
                  style={{background:selected?.id===b.id?'#e8f5ed':'white',border:`2px solid ${selected?.id===b.id?'var(--sauge)':'#eef2ee'}`,borderRadius:'var(--radius-lg)',padding:'1rem 1.25rem',cursor:'pointer',transition:'all .18s'}}>
                  <div style={{display:'flex',justifyContent:'space-between',marginBottom:'.4rem'}}>
                    <span style={{fontWeight:700,color:'var(--nuit)',fontSize:'.9rem'}}>{b.child?.prenom} {b.child?.nom}</span>
                    <span style={{background:st.bg,color:st.c,fontSize:'.72rem',fontWeight:700,padding:'2px 8px',borderRadius:50}}>{st.l}</span>
                  </div>
                  <div style={{fontSize:'.8rem',color:'var(--text-muted)'}}>
                    {b.slot?.date ? new Date(b.slot.date).toLocaleDateString('fr-FR',{weekday:'short',day:'numeric',month:'short'}) : '—'}
                    &nbsp;·&nbsp;{b.user?.prenom} {b.user?.nom}
                  </div>
                </div>
              )
            })}
            {filtered.length===0 && <div style={{textAlign:'center',color:'var(--text-muted)',padding:'2rem',fontSize:'.85rem'}}>Aucune réservation</div>}
          </div>

          {selected && (
            <div style={{background:'white',borderRadius:'var(--radius-xl)',padding:'1.75rem',boxShadow:'var(--shadow-sm)',display:'flex',flexDirection:'column',gap:'1rem'}}>
              <h3 style={{fontFamily:"'Baloo 2',cursive",color:'var(--nuit)'}}>{selected.child?.prenom} {selected.child?.nom}</h3>
              <div style={{fontSize:'.85rem',color:'var(--text-muted)',display:'flex',flexDirection:'column',gap:'.4rem'}}>
                <span>{selected.slot?.date ? new Date(selected.slot.date).toLocaleDateString('fr-FR',{weekday:'long',day:'numeric',month:'long',year:'numeric'}) : '—'}</span>
                <span>{selected.user?.prenom} {selected.user?.nom} · {selected.user?.email}</span>
                <span>{parseFloat(selected.tarif_applique||0).toFixed(0)}€ · {selected.formule} · {selected.paiement||'—'}</span>
                {selected.notes_parent && <span>Parent : {selected.notes_parent}</span>}
              </div>

              {selected.status==='pending' && (
                <div style={{display:'flex',gap:'.5rem'}}>
                  <button className="btn-primary" onClick={()=>confirm(selected.id)}>Confirmer</button>
                  <button className="btn-secondary" onClick={()=>cancel(selected.id)}>Refuser</button>
                </div>
              )}

              <div>
                <label style={{fontSize:'.8rem',fontWeight:700,color:'var(--nuit)',display:'block',marginBottom:'.4rem'}}>
                  Compte-rendu <span style={{fontWeight:400,color:'var(--text-muted)'}}>(optionnel — visible par le parent)</span>
                </label>
                <textarea value={cr} onChange={e=>setCr(e.target.value)} rows={4}
                  placeholder="Résumé de la journée, observations, points positifs…"
                  style={{width:'100%',padding:'.65rem',border:'2px solid var(--sable-dark)',borderRadius:10,fontFamily:'inherit',fontSize:'.88rem',resize:'vertical'}}/>
                <button className="btn-secondary" onClick={saveCr} style={{marginTop:'.5rem',fontSize:'.85rem'}}>Sauvegarder le compte-rendu</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}