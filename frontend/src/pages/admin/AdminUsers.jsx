import { useState, useEffect } from 'react'
import axios from 'axios'
import AdminLayout from '../../components/layout/AdminLayout'

export default function AdminUsers() {
  const [users,    setUsers]    = useState([])
  const [children, setChildren] = useState([])
  const [bookings, setBookings] = useState([])
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    Promise.all([
      axios.get('/api/users'),
      axios.get('/api/children'),
      axios.get('/api/bookings'),
    ]).then(([u,c,b]) => { setUsers(u.data.filter(x=>x.role==='parent')); setChildren(c.data); setBookings(b.data) })
    .catch(()=>{})
  }, [])

  const childrenOf = (uid) => children.filter(c => c.user_id===uid || c.user?.id===uid)
  const bookingsOf = (uid) => bookings.filter(b => b.user_id===uid || b.user?.id===uid)

  const ini = (u) => ((u?.prenom?.[0]||'')+(u?.nom?.[0]||'')).toUpperCase()

  return (
    <AdminLayout>
      <div className="admin-page">
        <div className="admin-page__header">
          <div><h1>Familles</h1>
            <p className="admin-page__subtitle">{users.length} famille{users.length>1?'s':''} inscrite{users.length>1?'s':''}</p>
          </div>
        </div>

        <div style={{display:'grid',gridTemplateColumns:'280px 1fr',gap:'1.5rem',alignItems:'start'}}>
          <div style={{display:'flex',flexDirection:'column',gap:'.5rem'}}>
            {users.map(u => (
              <div key={u.id} onClick={()=>setSelected(u)}
                style={{padding:'1rem',background:selected?.id===u.id?'var(--sable-light)':'white',borderRadius:'var(--radius-lg)',border:`2px solid ${selected?.id===u.id?'var(--sauge)':'#eef2ee'}`,cursor:'pointer',transition:'all .18s',display:'flex',alignItems:'center',gap:'.65rem'}}>
                <div style={{width:38,height:38,background:'var(--sauge)',color:'white',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:800,fontSize:'.88rem',flexShrink:0}}>{ini(u)}</div>
                <div>
                  <div style={{fontWeight:700,color:'var(--nuit)',fontSize:'.9rem'}}>{u.prenom} {u.nom}</div>
                  <div style={{fontSize:'.74rem',color:'var(--text-muted)'}}>{childrenOf(u.id).length} enfant{childrenOf(u.id).length>1?'s':''} · {bookingsOf(u.id).length} réservation{bookingsOf(u.id).length>1?'s':''}</div>
                </div>
              </div>
            ))}
            {users.length===0 && <div style={{textAlign:'center',color:'var(--text-muted)',padding:'2rem',fontSize:'.85rem'}}>Aucune famille inscrite</div>}
          </div>

          {selected ? (
            <div style={{display:'flex',flexDirection:'column',gap:'1rem'}}>
              {/* Infos famille */}
              <div style={{background:'white',borderRadius:'var(--radius-xl)',padding:'1.75rem',boxShadow:'var(--shadow-sm)'}}>
                <div style={{display:'flex',alignItems:'center',gap:'1rem',marginBottom:'1.25rem'}}>
                  <div style={{width:52,height:52,background:'var(--sauge)',color:'white',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:"'Baloo 2',cursive",fontWeight:800,fontSize:'1.2rem'}}>{ini(selected)}</div>
                  <div>
                    <h3 style={{fontFamily:"'Baloo 2',cursive",color:'var(--nuit)',margin:0}}>{selected.prenom} {selected.nom}</h3>
                    <a href={`mailto:${selected.email}`} style={{fontSize:'.85rem',color:'var(--sauge)',textDecoration:'none'}}>{selected.email}</a>
                  </div>
                </div>
                <div style={{display:'flex',gap:'.75rem',flexWrap:'wrap'}}>
                  {selected.telephone && <span style={{fontSize:'.85rem',color:'var(--text-muted)'}}>{selected.telephone}</span>}
                  <span style={{fontSize:'.85rem',color:'var(--text-muted)'}}>Inscrit le {new Date(selected.created_at).toLocaleDateString('fr-FR')}</span>
                </div>
              </div>

              {/* Enfants */}
              <div style={{background:'white',borderRadius:'var(--radius-xl)',padding:'1.5rem',boxShadow:'var(--shadow-sm)'}}>
                <h3 style={{fontFamily:"'Baloo 2',cursive",color:'var(--nuit)',fontSize:'1rem',marginBottom:'1rem'}}>Enfants ({childrenOf(selected.id).length})</h3>
                {childrenOf(selected.id).length === 0 ? <p style={{color:'var(--text-muted)',fontSize:'.85rem'}}>Aucun enfant enregistré</p> : (
                  <div style={{display:'flex',flexDirection:'column',gap:'.65rem'}}>
                    {childrenOf(selected.id).map(c => (
                      <div key={c.id} style={{display:'flex',alignItems:'center',gap:'.75rem',padding:'.65rem',background:'var(--sable-light)',borderRadius:10}}>
                        <div style={{width:32,height:32,background:'var(--sauge)',color:'white',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:800,fontSize:'.82rem',flexShrink:0}}>{c.prenom?.[0]}</div>
                        <div>
                          <div style={{fontWeight:700,color:'var(--nuit)',fontSize:'.88rem'}}>{c.prenom} {c.nom}</div>
                          <div style={{fontSize:'.74rem',color:'var(--text-muted)',display:'flex',gap:'.4rem',flexWrap:'wrap',marginTop:2}}>
                            {c.date_naissance && <span>{Math.floor((Date.now()-new Date(c.date_naissance))/(365.25*86400000))} ans</span>}
                            {c.besoins_specifiques && <span style={{background:'#e3f2fd',color:'#1565c0',padding:'1px 7px',borderRadius:50,fontWeight:700}}>{c.type_besoin||'BS'}</span>}
                            {!c.dossier_complete && <span style={{background:'#fff8e1',color:'#f57f17',padding:'1px 7px',borderRadius:50,fontWeight:700}}>Dossier incomplet</span>}
                            {c.dossier_complete && <span style={{background:'#e8f5e9',color:'#2e7d32',padding:'1px 7px',borderRadius:50,fontWeight:700}}>Dossier complet</span>}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Réservations */}
              <div style={{background:'white',borderRadius:'var(--radius-xl)',padding:'1.5rem',boxShadow:'var(--shadow-sm)'}}>
                <h3 style={{fontFamily:"'Baloo 2',cursive",color:'var(--nuit)',fontSize:'1rem',marginBottom:'1rem'}}>Réservations ({bookingsOf(selected.id).length})</h3>
                {bookingsOf(selected.id).length === 0 ? <p style={{color:'var(--text-muted)',fontSize:'.85rem'}}>Aucune réservation</p> : (
                  <div style={{display:'flex',flexDirection:'column',gap:'.5rem'}}>
                    {bookingsOf(selected.id).slice(0,5).map(b => {
                      const st = {pending:{bg:'#fff8e1',c:'#f57f17',l:'En attente'},confirmed:{bg:'#e8f5e9',c:'#2e7d32',l:'Confirmée'},cancelled:{bg:'#fee2e2',c:'#991b1b',l:'Annulée'}}[b.status]||{}
                      return (
                        <div key={b.id} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'.5rem .75rem',background:'var(--sable-light)',borderRadius:8}}>
                          <div style={{fontSize:'.83rem',color:'var(--text-dark)'}}>
                            {b.slot?.date ? new Date(b.slot.date+'T00:00:00').toLocaleDateString('fr-FR',{day:'numeric',month:'short'}) : '—'}
                            {b.child ? ` · ${b.child.prenom}` : ''}
                          </div>
                          <span style={{background:st.bg,color:st.c,fontSize:'.72rem',fontWeight:700,padding:'2px 8px',borderRadius:50}}>{st.l}</span>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div style={{textAlign:'center',padding:'4rem',background:'white',borderRadius:'var(--radius-xl)',color:'var(--text-muted)'}}>
              ← Sélectionnez une famille
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}