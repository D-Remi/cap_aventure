import { useState, useEffect } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import AdminLayout from '../../components/layout/AdminLayout'

const TYPE_LABEL = {
  ordonnance:'💊 Ordonnance', pap:'📋 PAP/PPS', mdph:'🏛️ MDPH',
  autorisation_sortie:'✅ Autorisation sortie', autorisation_photo:'📷 Autorisation photo', autre:'📄 Autre',
}

export default function AdminDocuments() {
  const [docs,     setDocs]     = useState([])
  const [selected, setSelected] = useState(null)
  const [note,     setNote]     = useState('')
  const [filter,   setFilter]   = useState('tous')
  const [viewing,  setViewing]  = useState(null)

  useEffect(() => { axios.get('/api/documents').then(r => setDocs(r.data)).catch(() => {}) }, [])

  const validate = async (id, valide) => {
    await axios.patch(`/api/documents/${id}/validate`, { valide, note })
    setDocs(d => d.map(x => x.id===id ? {...x,valide,note_admin:note} : x))
    if (selected?.id === id) setSelected(s => ({...s,valide,note_admin:note}))
    toast.success(valide ? 'Document validé ✅' : 'Document refusé ❌')
  }

  const del = async (id) => {
    if (!window.confirm('Supprimer ce document ?')) return
    await axios.delete(`/api/documents/${id}`)
    setDocs(d => d.filter(x => x.id!==id))
    if (selected?.id===id) setSelected(null)
    toast.success('Document supprimé')
  }

  const filtered = docs.filter(d => {
    if (filter==='en_attente') return d.valide === null || d.valide === undefined
    if (filter==='valide')     return d.valide === true
    if (filter==='refuse')     return d.valide === false
    return true
  })

  const badge = (d) => {
    if (d.valide === true)  return <span style={{background:'#e8f5e9',color:'#2e7d32',fontSize:'.72rem',fontWeight:700,padding:'2px 8px',borderRadius:50}}>✅ Validé</span>
    if (d.valide === false) return <span style={{background:'#fee2e2',color:'#991b1b',fontSize:'.72rem',fontWeight:700,padding:'2px 8px',borderRadius:50}}>❌ Refusé</span>
    return <span style={{background:'#fff8e1',color:'#f57f17',fontSize:'.72rem',fontWeight:700,padding:'2px 8px',borderRadius:50}}>⏳ En attente</span>
  }

  return (
    <>
    <AdminLayout>
      <div className="admin-page">
        <div className="admin-page__header">
          <div><h1>📁 Documents</h1>
            <p className="admin-page__subtitle">{docs.filter(d=>d.valide===null||d.valide===undefined).length} en attente de vérification</p>
          </div>
        </div>

        <div style={{display:'flex',gap:'.6rem',marginBottom:'1.5rem',flexWrap:'wrap'}}>
          {[{v:'tous',l:'Tous'},{v:'en_attente',l:'⏳ En attente'},{v:'valide',l:'✅ Validés'},{v:'refuse',l:'❌ Refusés'}].map(({v,l})=>(
            <button key={v} className={`cal-filter-btn ${filter===v?'active':''}`} onClick={()=>setFilter(v)}>{l}</button>
          ))}
        </div>

        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1.5rem',alignItems:'start'}}>
          {/* Liste */}
          <div style={{display:'flex',flexDirection:'column',gap:'.65rem'}}>
            {filtered.length === 0 && <div style={{textAlign:'center',color:'var(--text-muted)',padding:'2rem',fontSize:'.85rem'}}>Aucun document</div>}
            {filtered.map(d => (
              <div key={d.id} onClick={()=>{setSelected(d);setNote(d.note_admin||'')}}
                style={{padding:'1rem 1.25rem',background:selected?.id===d.id?'var(--sable-light)':'white',border:`2px solid ${selected?.id===d.id?'var(--sauge)':'#eef2ee'}`,borderRadius:'var(--radius-lg)',cursor:'pointer',transition:'all .18s'}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'.35rem'}}>
                  <div style={{fontWeight:700,color:'var(--nuit)',fontSize:'.88rem'}}>{TYPE_LABEL[d.type]||'📄'} {d.nom}</div>
                  {badge(d)}
                </div>
                <div style={{fontSize:'.75rem',color:'var(--text-muted)'}}>
                  {d.user?.prenom} {d.user?.nom}{d.child ? ` · ${d.child.prenom}` : ''} · {new Date(d.created_at).toLocaleDateString('fr-FR')}
                  {d.taille ? ` · ${Math.round(d.taille/1024)} Ko` : ''}
                </div>
              </div>
            ))}
          </div>

          {/* Détail */}
          {selected ? (
            <div style={{background:'white',borderRadius:'var(--radius-xl)',padding:'1.75rem',boxShadow:'var(--shadow-sm)'}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'1.25rem'}}>
                <h3 style={{fontFamily:"'Baloo 2',cursive",color:'var(--nuit)',fontSize:'1rem',margin:0}}>{TYPE_LABEL[selected.type]||'📄'} {selected.nom}</h3>
                {badge(selected)}
              </div>
              <div style={{display:'flex',flexDirection:'column',gap:'.5rem',fontSize:'.85rem',color:'var(--text-dark)',marginBottom:'1.25rem'}}>
                <span>👤 {selected.user?.prenom} {selected.user?.nom} · {selected.user?.email}</span>
                {selected.child && <span>🧒 Pour {selected.child.prenom} {selected.child.nom}</span>}
                <span>📅 {new Date(selected.created_at).toLocaleDateString('fr-FR',{weekday:'long',day:'numeric',month:'long',year:'numeric'})}</span>
                {selected.taille && <span>💾 {Math.round(selected.taille/1024)} Ko</span>}
              </div>

              {/* Voir le fichier */}
              <button onClick={async()=>{const {data}=await axios.get(`/api/documents/${selected.id}/data`);setViewing(data)}}
                style={{display:'inline-flex',alignItems:'center',gap:'.5rem',marginBottom:'1.25rem',background:'none',border:'1.5px solid var(--sauge)',borderRadius:8,padding:'.4rem 1rem',fontSize:'.85rem',color:'var(--sauge)',fontWeight:700,cursor:'pointer',fontFamily:'inherit'}}>
                👁️ Voir le document
              </button>

              {/* Note admin */}
              <div style={{marginBottom:'1rem'}}>
                <label style={{display:'block',fontSize:'.78rem',fontWeight:700,color:'var(--nuit)',marginBottom:'.3rem',textTransform:'uppercase'}}>
                  Note (transmise au parent si refus)
                </label>
                <textarea value={note} onChange={e=>setNote(e.target.value)} rows={3}
                  placeholder="Ex: Document illisible, merci de renvoyer en meilleure qualité…"
                  style={{width:'100%',padding:'.6rem',border:'2px solid var(--sable-dark)',borderRadius:10,fontFamily:'inherit',fontSize:'.88rem',resize:'vertical'}}/>
              </div>

              <div style={{display:'flex',gap:'.65rem',flexWrap:'wrap'}}>
                <button className="btn-primary" onClick={()=>validate(selected.id,true)} style={{background:'#4caf50'}}>✅ Valider</button>
                <button className="btn-primary" onClick={()=>validate(selected.id,false)} style={{background:'#ef4444'}}>❌ Refuser</button>
                <button onClick={()=>del(selected.id)} style={{background:'#fee2e2',color:'#991b1b',border:'none',borderRadius:8,padding:'.5rem 1rem',fontWeight:700,fontSize:'.85rem',cursor:'pointer',fontFamily:'inherit'}}>🗑️ Supprimer</button>
              </div>
            </div>
          ) : (
            <div style={{textAlign:'center',padding:'3rem',background:'white',borderRadius:'var(--radius-xl)',color:'var(--text-muted)'}}>
              ← Sélectionnez un document
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
    {viewing && (
        <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,.7)',zIndex:700,display:'flex',alignItems:'center',justifyContent:'center',padding:'1rem'}} onClick={()=>setViewing(null)}>
          <div style={{background:'white',borderRadius:'var(--radius-xl)',overflow:'hidden',maxWidth:800,width:'100%',maxHeight:'90vh',display:'flex',flexDirection:'column'}} onClick={e=>e.stopPropagation()}>
            <div style={{padding:'1rem 1.5rem',background:'var(--nuit)',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <span style={{color:'white',fontWeight:700}}>{viewing.nom}</span>
              <div style={{display:'flex',gap:'.5rem'}}>
                <a href={viewing.data} download={viewing.filename} style={{background:'rgba(255,255,255,.15)',color:'white',padding:'.3rem .85rem',borderRadius:8,fontSize:'.82rem',fontWeight:700,textDecoration:'none'}}>⬇️ Télécharger</a>
                <button onClick={()=>setViewing(null)} style={{background:'rgba(255,255,255,.15)',border:'none',color:'white',width:30,height:30,borderRadius:'50%',cursor:'pointer',fontSize:'1rem',fontFamily:'inherit'}}>✕</button>
              </div>
            </div>
            <div style={{flex:1,overflow:'auto',padding:'1rem',textAlign:'center',background:'#f5f5f5'}}>
              {viewing.mimetype?.includes('image') ? (
                <img src={viewing.data} alt={viewing.nom} style={{maxWidth:'100%',maxHeight:'70vh',borderRadius:8}}/>
              ) : viewing.mimetype?.includes('pdf') ? (
                <iframe src={viewing.data} title={viewing.nom} style={{width:'100%',height:'70vh',border:'none'}}/>
              ) : (
                <div style={{padding:'3rem',color:'var(--text-muted)'}}><div style={{fontSize:'3rem',marginBottom:'1rem'}}>📄</div><p>Prévisualisation non disponible.</p><a href={viewing.data} download={viewing.filename} className="btn-primary" style={{textDecoration:'none',marginTop:'1rem',display:'inline-flex'}}>⬇️ Télécharger</a></div>
              )}
            </div>
          </div>
        </div>
    )}
    </>
  )
}