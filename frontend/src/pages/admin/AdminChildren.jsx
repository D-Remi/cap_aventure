import { useState, useEffect } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import AdminLayout from '../../components/layout/AdminLayout'
import DossierEnfant from '../../components/ui/DossierEnfant'

export default function AdminChildren() {
  const [children, setChildren] = useState([])
  const [selected, setSelected] = useState(null)
  const [notes, setNotes]       = useState('')
  const [editing, setEditing]   = useState(false)
  const [filter, setFilter]     = useState('tous')

  useEffect(()=>{ axios.get('/api/children').then(r=>setChildren(r.data)).catch(()=>{}) },[])

  const filtered = children.filter(c => {
    if (filter==='specifiques') return c.besoins_specifiques
    if (filter==='incomplet')   return !c.dossier_complete
    return true
  })

  const select = (c) => { setSelected(c); setNotes(c.notes_animateur||''); setEditing(false) }

  const saveNotes = async () => {
    try {
      await axios.patch(`/api/children/${selected.id}/notes`, { notes })
      setSelected(s => ({...s, notes_animateur: notes}))
      setEditing(false)
      toast.success('Notes sauvegardées')
    } catch { toast.error('Erreur') }
  }

  return (
    <AdminLayout>
      <div className="admin-page">
        <div className="admin-page__header">
          <div>
            <h1>🌿 Dossiers enfants</h1>
            <p className="admin-page__subtitle">{children.length} enfant{children.length>1?'s':''} enregistré{children.length>1?'s':''}</p>
          </div>
        </div>

        <div style={{display:'flex',gap:'.6rem',marginBottom:'1.5rem',flexWrap:'wrap'}}>
          {[{v:'tous',l:'Tous'},{v:'specifiques',l:'🌿 Besoins spécifiques'},{v:'incomplet',l:'⚠️ Dossier incomplet'}].map(({v,l})=>(
            <button key={v} className={`cal-filter-btn ${filter===v?'active':''}`} onClick={()=>setFilter(v)}>{l}</button>
          ))}
        </div>

        <div style={{display:'grid',gridTemplateColumns:'280px 1fr',gap:'1.5rem',alignItems:'start'}}>
          {/* Liste */}
          <div style={{display:'flex',flexDirection:'column',gap:'.5rem'}}>
            {filtered.map(c=>(
              <div key={c.id} onClick={()=>select(c)}
                style={{padding:'1rem',background:selected?.id===c.id?'#e8f5ed':'white',borderRadius:'var(--radius-lg)',border:`2px solid ${selected?.id===c.id?'var(--sauge)':'#eef2ee'}`,cursor:'pointer',transition:'all .18s'}}>
                <div style={{display:'flex',alignItems:'center',gap:'.6rem',marginBottom:'.25rem'}}>
                  <div style={{width:32,height:32,background:'var(--sauge)',color:'white',borderRadius:8,display:'flex',alignItems:'center',justifyContent:'center',fontWeight:800,fontSize:'.85rem',flexShrink:0}}>
                    {(c.prenom?.[0]||'')+(c.nom?.[0]||'')}
                  </div>
                  <div>
                    <div style={{fontWeight:700,color:'var(--nuit)',fontSize:'.88rem'}}>{c.prenom} {c.nom}</div>
                    <div style={{fontSize:'.72rem',color:'var(--text-muted)'}}>{c.user?.prenom} {c.user?.nom}</div>
                  </div>
                </div>
                <div style={{display:'flex',gap:'.4rem',flexWrap:'wrap'}}>
                  {c.besoins_specifiques && <span style={{fontSize:'.68rem',background:'#e3f2fd',color:'#1565c0',padding:'1px 6px',borderRadius:50,fontWeight:700}}>🌿 {c.type_besoin||'BS'}</span>}
                  {!c.dossier_complete && <span style={{fontSize:'.68rem',background:'#fff8e1',color:'#f57f17',padding:'1px 6px',borderRadius:50,fontWeight:700}}>⚠️ Incomplet</span>}
                </div>
              </div>
            ))}
            {filtered.length===0 && <div style={{textAlign:'center',color:'var(--text-muted)',padding:'2rem',fontSize:'.85rem'}}>Aucun enfant</div>}
          </div>

          {/* Dossier */}
          {selected ? (
            <div style={{display:'flex',flexDirection:'column',gap:'1rem'}}>
              <DossierEnfant child={selected} showPrivate={true} />
              {/* Notes animateur éditables */}
              <div style={{background:'white',borderRadius:'var(--radius-xl)',padding:'1.5rem',boxShadow:'var(--shadow-sm)'}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'1rem'}}>
                  <h3 style={{fontFamily:"'Baloo 2',cursive",color:'var(--nuit)',fontSize:'1rem'}}>🔒 Notes animateur (privées)</h3>
                  {!editing && <button className="btn-secondary" onClick={()=>setEditing(true)} style={{fontSize:'.82rem',padding:'.35rem .9rem'}}>Modifier</button>}
                </div>
                {editing ? (
                  <>
                    <textarea value={notes} onChange={e=>setNotes(e.target.value)} rows={4}
                      style={{width:'100%',padding:'.75rem',border:'2px solid var(--sable-dark)',borderRadius:10,fontFamily:'inherit',fontSize:'.88rem',resize:'vertical'}}
                      placeholder="Observations, comportements, préférences observées lors des séances…"/>
                    <div style={{display:'flex',gap:'.5rem',marginTop:'.75rem'}}>
                      <button className="btn-secondary" onClick={()=>setEditing(false)}>Annuler</button>
                      <button className="btn-primary" onClick={saveNotes}>Sauvegarder</button>
                    </div>
                  </>
                ) : (
                  <p style={{fontSize:'.88rem',color:'var(--text-muted)',whiteSpace:'pre-wrap'}}>{notes||"Aucune note pour l'instant."}</p>
                )}
              </div>
            </div>
          ) : (
            <div style={{textAlign:'center',padding:'4rem',background:'white',borderRadius:'var(--radius-xl)',color:'var(--text-muted)'}}>
              ← Sélectionnez un enfant pour voir son dossier
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}