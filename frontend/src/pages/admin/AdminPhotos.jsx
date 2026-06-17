import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import AdminLayout from '../../components/layout/AdminLayout'

export default function AdminPhotos() {
  const [photos,    setPhotos]    = useState([])
  const [children,  setChildren]  = useState([])
  const [loading,   setLoading]   = useState(true)
  const [uploading, setUploading] = useState(false)
  const [viewing,   setViewing]   = useState(null)
  const [form,      setForm]      = useState({ child_id:'', titre:'', date_seance:'' })
  const fileRef = useRef(null)

  useEffect(() => {
    Promise.all([
      axios.get('/api/photos'),
      axios.get('/api/children'),
    ]).then(([p, c]) => { setPhotos(p.data); setChildren(c.data) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const upload = (e) => {
    const files = Array.from(e.target.files)
    if (!files.length) return
    setUploading(true)
    const reads = files.map(file => new Promise((res, rej) => {
      const reader = new FileReader()
      reader.onload = () => res({ data: reader.result, file })
      reader.onerror = rej
      reader.readAsDataURL(file)
    }))
    Promise.all(reads).then(async results => {
      let added = 0
      for (const { data, file } of results) {
        try {
          const { data: photo } = await axios.post('/api/photos', {
            child_id:    form.child_id ? +form.child_id : undefined,
            titre:       form.titre || file.name.replace(/\.[^.]+$/, ''),
            date_seance: form.date_seance || undefined,
            data,
            mimetype: file.type,
            taille:   file.size,
          })
          setPhotos(p => [photo, ...p])
          added++
        } catch {}
      }
      toast.success(`${added} photo${added>1?'s':''} ajoutée${added>1?'s':''}`)
      fileRef.current.value = ''
    }).catch(() => toast.error('Erreur lors du chargement'))
      .finally(() => setUploading(false))
  }

  const toggleVisible = async (photo) => {
    const { data } = await axios.patch(`/api/photos/${photo.id}/visible`, { visible: !photo.visible })
    setPhotos(p => p.map(x => x.id === photo.id ? { ...x, visible: data.visible } : x))
    toast.success(data.visible ? 'Photo visible par le parent' : 'Photo masquée')
  }

  const remove = async (id) => {
    if (!window.confirm('Supprimer cette photo ?')) return
    await axios.delete(`/api/photos/${id}`)
    setPhotos(p => p.filter(x => x.id !== id))
    toast.success('Photo supprimée')
  }

  const viewPhoto = async (photo) => {
    const { data } = await axios.get(`/api/photos/${photo.id}/data`)
    setViewing(data)
  }

  const fmtDate = (d) => d ? new Date(d+'T00:00:00').toLocaleDateString('fr-FR',{day:'numeric',month:'long',year:'numeric'}) : ''

  return (
    <AdminLayout>
      <div className="admin-page">
        <div className="admin-page__header">
          <div>
            <h1>📸 Photos des séances</h1>
            <p className="admin-page__subtitle">{photos.length} photo{photos.length>1?'s':''} · partagées avec les familles</p>
          </div>
        </div>

        {/* Upload */}
        <div style={{background:'white',borderRadius:'var(--radius-xl)',padding:'1.5rem',marginBottom:'1.5rem',boxShadow:'var(--shadow-sm)'}}>
          <h3 style={{fontFamily:"'Baloo 2',cursive",color:'var(--nuit)',fontSize:'1rem',marginBottom:'1rem'}}>📤 Ajouter des photos</h3>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'1rem',marginBottom:'1rem'}}>
            <div>
              <label style={{fontSize:'.78rem',fontWeight:700,color:'var(--nuit)',display:'block',marginBottom:4,textTransform:'uppercase'}}>Enfant</label>
              <select value={form.child_id} onChange={e=>setForm(f=>({...f,child_id:e.target.value}))}
                style={{width:'100%',padding:'.5rem',border:'1.5px solid var(--sable-dark)',borderRadius:8,fontFamily:'inherit'}}>
                <option value="">— Tous —</option>
                {children.map(c => <option key={c.id} value={c.id}>{c.prenom} {c.nom}</option>)}
              </select>
            </div>
            <div>
              <label style={{fontSize:'.78rem',fontWeight:700,color:'var(--nuit)',display:'block',marginBottom:4,textTransform:'uppercase'}}>Date de la séance</label>
              <input type="date" value={form.date_seance} onChange={e=>setForm(f=>({...f,date_seance:e.target.value}))}
                style={{width:'100%',padding:'.5rem',border:'1.5px solid var(--sable-dark)',borderRadius:8,fontFamily:'inherit'}}/>
            </div>
            <div>
              <label style={{fontSize:'.78rem',fontWeight:700,color:'var(--nuit)',display:'block',marginBottom:4,textTransform:'uppercase'}}>Titre (optionnel)</label>
              <input value={form.titre} onChange={e=>setForm(f=>({...f,titre:e.target.value}))}
                placeholder="Ex: Sortie forêt"
                style={{width:'100%',padding:'.5rem',border:'1.5px solid var(--sable-dark)',borderRadius:8,fontFamily:'inherit'}}/>
            </div>
          </div>
          <label style={{display:'block',cursor:'pointer'}}>
            <div style={{border:'2px dashed var(--sable-dark)',borderRadius:12,padding:'1.5rem',textAlign:'center',transition:'all .2s',background:uploading?'var(--sable-light)':'transparent'}}>
              {uploading ? (
                <span style={{color:'var(--text-muted)',fontSize:'.9rem'}}>⏳ Envoi en cours…</span>
              ) : (
                <>
                  <div style={{fontSize:'2rem',marginBottom:'.5rem'}}>📷</div>
                  <div style={{fontWeight:700,color:'var(--nuit)',marginBottom:'.25rem'}}>Cliquez pour ajouter des photos</div>
                  <div style={{fontSize:'.82rem',color:'var(--text-muted)'}}>JPG, PNG, WEBP · Plusieurs fichiers acceptés</div>
                </>
              )}
            </div>
            <input ref={fileRef} type="file" multiple accept="image/*" onChange={upload} style={{display:'none'}} disabled={uploading}/>
          </label>
        </div>

        {/* Galerie */}
        {loading ? <div className="admin-loading">Chargement…</div> :
         photos.length === 0 ? (
           <div className="admin-empty"><div style={{fontSize:'2rem'}}>📷</div><p>Aucune photo ajoutée</p></div>
         ) : (
           <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))',gap:'1rem'}}>
             {photos.map(p => (
               <div key={p.id} style={{background:'white',borderRadius:'var(--radius-lg)',overflow:'hidden',boxShadow:'var(--shadow-sm)',border:'1.5px solid var(--sable-light)',opacity:p.visible?1:.6}}>
                 <div style={{background:'var(--sable-light)',height:140,display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',fontSize:'3rem'}}
                   onClick={()=>viewPhoto(p)}>
                   🖼️
                 </div>
                 <div style={{padding:'.75rem'}}>
                   <div style={{fontWeight:700,fontSize:'.85rem',color:'var(--nuit)',marginBottom:'.2rem',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>
                     {p.titre || 'Photo'}
                   </div>
                   <div style={{fontSize:'.75rem',color:'var(--text-muted)',marginBottom:'.65rem'}}>
                     {p.child ? `${p.child.prenom} · ` : ''}{fmtDate(p.date_seance)}
                   </div>
                   <div style={{display:'flex',gap:'.4rem'}}>
                     <button onClick={()=>toggleVisible(p)}
                       style={{flex:1,background:p.visible?'#e8f5e9':'#f3f4f6',color:p.visible?'#2e7d32':'#6b7280',border:'none',borderRadius:6,padding:'4px 6px',cursor:'pointer',fontSize:'.72rem',fontWeight:700,fontFamily:'inherit'}}>
                       {p.visible ? '✅ Visible' : '👁️ Masqué'}
                     </button>
                     <button onClick={()=>remove(p.id)}
                       style={{background:'#fee2e2',color:'#991b1b',border:'none',borderRadius:6,padding:'4px 8px',cursor:'pointer',fontSize:'.78rem',fontFamily:'inherit'}}>
                       🗑️
                     </button>
                   </div>
                 </div>
               </div>
             ))}
           </div>
         )}

        {/* Modal */}
        {viewing && (
          <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,.85)',zIndex:700,display:'flex',alignItems:'center',justifyContent:'center',padding:'1rem'}}
            onClick={()=>setViewing(null)}>
            <div style={{background:'white',borderRadius:'var(--radius-xl)',overflow:'hidden',maxWidth:800,width:'100%',maxHeight:'92vh',display:'flex',flexDirection:'column'}}
              onClick={e=>e.stopPropagation()}>
              <div style={{background:'var(--nuit)',padding:'1rem 1.5rem',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <span style={{color:'white',fontWeight:700}}>{viewing.titre||'Photo'}</span>
                <div style={{display:'flex',gap:'.5rem'}}>
                  <a href={viewing.data} download style={{background:'rgba(255,255,255,.15)',color:'white',padding:'.3rem .85rem',borderRadius:8,fontSize:'.82rem',fontWeight:700,textDecoration:'none'}}>⬇️</a>
                  <button onClick={()=>setViewing(null)} style={{background:'rgba(255,255,255,.15)',border:'none',color:'white',width:30,height:30,borderRadius:'50%',cursor:'pointer',fontFamily:'inherit'}}>✕</button>
                </div>
              </div>
              <div style={{flex:1,overflow:'auto',background:'#111',display:'flex',alignItems:'center',justifyContent:'center'}}>
                <img src={viewing.data} alt={viewing.titre} style={{maxWidth:'100%',maxHeight:'80vh',objectFit:'contain'}}/>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
