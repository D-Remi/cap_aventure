import { useState, useEffect } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'

export default function PaiementTab() {
  const [bookings, setBookings] = useState([])
  const [loading,  setLoading]  = useState(true)
  const [modal,    setModal]    = useState(null)
  const [form,     setForm]     = useState({ mode:'virement', ref:'' })

  useEffect(() => {
    axios.get('/api/bookings/mine')
      .then(r => setBookings(r.data.filter(b => b.status === 'confirmed')))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const declarerPaiement = async () => {
    if (!form.ref && form.mode === 'virement') { toast.error('Entrez la référence du virement'); return }
    try {
      await axios.patch(`/api/bookings/${modal.id}/paiement`, {
        paiement_mode:    form.mode,
        paiement_ref:     form.ref,
        paiement_declare: true,
      })
      setBookings(b => b.map(x => x.id === modal.id ? {...x, paiement_declare:true, paiement_mode:form.mode, paiement_ref:form.ref} : x))
      setModal(null)
      toast.success('Paiement déclaré — en attente de validation.')
    } catch { toast.error('Erreur') }
  }

  if (loading) return <div style={{padding:'2rem',textAlign:'center',color:'var(--text-muted)'}}>Chargement…</div>

  const nonPayes   = bookings.filter(b => !b.paiement_valide)
  const payes      = bookings.filter(b => b.paiement_valide)

  return (
    <div className="dash-tab">
      <h2>💶 Paiements</h2>
      <p className="dash-subtitle">Gérez vos paiements pour les séances confirmées.</p>

      {nonPayes.length === 0 && payes.length === 0 && (
        <div className="dash-empty"><div>💶</div><p>Aucune réservation confirmée pour le moment.</p></div>
      )}

      {/* En attente */}
      {nonPayes.length > 0 && (
        <div style={{marginBottom:'1.5rem'}}>
          <h3 style={{fontFamily:"'Baloo 2',cursive",color:'var(--nuit)',fontSize:'1rem',marginBottom:'1rem'}}>⏳ À régler</h3>
          <div style={{display:'flex',flexDirection:'column',gap:'.75rem'}}>
            {nonPayes.map(b => (
              <div key={b.id} style={{background:'white',borderRadius:'var(--radius-lg)',padding:'1.25rem',boxShadow:'var(--shadow-sm)',display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:'.75rem',border:'1.5px solid var(--sable-light)'}}>
                <div>
                  <div style={{fontWeight:700,color:'var(--nuit)',fontSize:'.95rem'}}>
                    {b.slot?.date ? new Date(b.slot.date+'T00:00:00').toLocaleDateString('fr-FR',{weekday:'long',day:'numeric',month:'long',year:'numeric'}) : '—'}
                  </div>
                  <div style={{fontSize:'.82rem',color:'var(--text-muted)',marginTop:2}}>
                    {b.child?.prenom} · {b.slot?.heure_debut?.slice(0,5)}–{b.slot?.heure_fin?.slice(0,5)}
                  </div>
                  {b.tarif_propose && (
                    <div style={{fontSize:'.88rem',fontWeight:700,color:'var(--sauge)',marginTop:4}}>
                      Montant : {parseFloat(b.tarif_propose).toFixed(2)} €
                    </div>
                  )}
                </div>
                <div style={{display:'flex',alignItems:'center',gap:'.75rem'}}>
                  {b.paiement_declare ? (
                    <span style={{background:'#fff8e1',color:'#f57f17',fontSize:'.78rem',fontWeight:700,padding:'3px 10px',borderRadius:50}}>
                      ⏳ En attente de validation
                    </span>
                  ) : b.tarif_propose ? (
                    <button className="btn-primary" onClick={() => { setModal(b); setForm({mode:'virement',ref:''}) }} style={{fontSize:'.85rem'}}>
                      💶 Déclarer le paiement
                    </button>
                  ) : (
                    <span style={{fontSize:'.82rem',color:'var(--text-muted)',fontStyle:'italic'}}>Tarif en attente</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Payés */}
      {payes.length > 0 && (
        <div>
          <h3 style={{fontFamily:"'Baloo 2',cursive",color:'var(--nuit)',fontSize:'1rem',marginBottom:'1rem'}}>✅ Réglés</h3>
          <div style={{display:'flex',flexDirection:'column',gap:'.5rem'}}>
            {payes.map(b => (
              <div key={b.id} style={{background:'#f0fdf4',borderRadius:'var(--radius-lg)',padding:'1rem 1.25rem',display:'flex',justifyContent:'space-between',alignItems:'center',border:'1px solid #bbf7d0'}}>
                <div>
                  <div style={{fontWeight:700,color:'#15803d',fontSize:'.9rem'}}>
                    ✅ {b.slot?.date ? new Date(b.slot.date+'T00:00:00').toLocaleDateString('fr-FR',{day:'numeric',month:'long'}) : '—'}
                  </div>
                  <div style={{fontSize:'.78rem',color:'#166534'}}>
                    {b.paiement_mode === 'cesu' ? '🎫 CESU' : '🏦 Virement'}{b.paiement_ref ? ` · Réf: ${b.paiement_ref}` : ''}
                  </div>
                </div>
                <span style={{fontFamily:"'Baloo 2',cursive",fontWeight:800,color:'#15803d',fontSize:'1.1rem'}}>
                  {parseFloat(b.tarif_propose||0).toFixed(2)} €
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal déclarer paiement */}
      {modal && (
        <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,.5)',zIndex:600,display:'flex',alignItems:'center',justifyContent:'center',padding:'1rem'}} onClick={() => setModal(null)}>
          <div style={{background:'white',borderRadius:'var(--radius-xl)',width:'100%',maxWidth:420,overflow:'hidden',boxShadow:'0 24px 64px rgba(0,0,0,.2)'}} onClick={e=>e.stopPropagation()}>
            <div style={{background:'var(--nuit)',padding:'1.25rem 1.5rem',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <div>
                <h3 style={{fontFamily:"'Baloo 2',cursive",color:'white',fontSize:'1.1rem',margin:0}}>💶 Déclarer le paiement</h3>
                <span style={{fontSize:'.78rem',color:'rgba(210,225,255,.7)'}}>
                  {modal.slot?.date ? new Date(modal.slot.date+'T00:00:00').toLocaleDateString('fr-FR',{day:'numeric',month:'long'}) : ''} · {parseFloat(modal.tarif_propose||0).toFixed(2)} €
                </span>
              </div>
              <button onClick={() => setModal(null)} style={{background:'rgba(255,255,255,.15)',border:'none',color:'white',width:30,height:30,borderRadius:'50%',cursor:'pointer',fontFamily:'inherit',fontSize:'1rem'}}>✕</button>
            </div>
            <div style={{padding:'1.5rem',display:'flex',flexDirection:'column',gap:'1rem'}}>
              <div>
                <label style={{fontSize:'.78rem',fontWeight:700,color:'var(--nuit)',display:'block',marginBottom:6,textTransform:'uppercase'}}>Mode de paiement</label>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'.6rem'}}>
                  {[['virement','🏦 Virement'],['cesu','🎫 CESU']].map(([v,l]) => (
                    <button key={v} onClick={() => setForm(f=>({...f,mode:v}))}
                      style={{padding:'.75rem',border:`2px solid ${form.mode===v?'var(--sauge)':'var(--sable-dark)'}`,borderRadius:10,background:form.mode===v?'#f0fdf4':'white',fontWeight:700,fontSize:'.9rem',cursor:'pointer',fontFamily:'inherit',color:form.mode===v?'var(--sauge)':'var(--nuit)'}}>
                      {l}
                    </button>
                  ))}
                </div>
              </div>

              {form.mode === 'virement' && (
                <div>
                  <label style={{fontSize:'.78rem',fontWeight:700,color:'var(--nuit)',display:'block',marginBottom:6,textTransform:'uppercase'}}>Référence du virement *</label>
                  <input value={form.ref} onChange={e=>setForm(f=>({...f,ref:e.target.value}))}
                    placeholder="Ex: VIR-20240609-DUPONT"
                    style={{width:'100%',padding:'.6rem',border:'2px solid var(--sable-dark)',borderRadius:10,fontFamily:'inherit',fontSize:'.9rem'}}/>
                  <p style={{fontSize:'.75rem',color:'var(--text-muted)',marginTop:'.4rem'}}>
                    Indiquez la référence que vous avez mise dans le libellé du virement.
                  </p>
                </div>
              )}

              {form.mode === 'cesu' && (
                <div>
                  <label style={{fontSize:'.78rem',fontWeight:700,color:'var(--nuit)',display:'block',marginBottom:6,textTransform:'uppercase'}}>N° du chèque CESU (optionnel)</label>
                  <input value={form.ref} onChange={e=>setForm(f=>({...f,ref:e.target.value}))}
                    placeholder="Numéro du chèque CESU"
                    style={{width:'100%',padding:'.6rem',border:'2px solid var(--sable-dark)',borderRadius:10,fontFamily:'inherit',fontSize:'.9rem'}}/>
                  <div style={{background:'#e0f2fe',borderRadius:8,padding:'.75rem',marginTop:'.5rem',fontSize:'.82rem',color:'#0369a1'}}>
                    📮 Envoyez le(s) chèque(s) CESU à l'adresse communiquée lors de la réservation, avant la date de la séance.
                  </div>
                </div>
              )}

              <div style={{display:'flex',gap:'.75rem'}}>
                <button className="btn-secondary" onClick={() => setModal(null)} style={{flex:1}}>Annuler</button>
                <button className="btn-primary" onClick={declarerPaiement} style={{flex:1,justifyContent:'center'}}>Confirmer</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}