import { useState, useEffect } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import AdminLayout from '../../components/layout/AdminLayout'

export default function AdminTemoignages() {
  const [avis, setAvis] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetch() }, [])
  const fetch = () => axios.get('/api/temoignages/all').then(r => setAvis(r.data)).catch(()=>{}).finally(()=>setLoading(false))

  const approve = async (id, val) => {
    await axios.patch(`/api/temoignages/${id}/approve`, { approuve: val })
    setAvis(a => a.map(x => x.id===id ? {...x, approuve:val} : x))
    toast.success(val ? 'Avis publié' : 'Avis masqué')
  }
  const remove = async (id) => {
    if (!window.confirm('Supprimer cet avis ?')) return
    await axios.delete(`/api/temoignages/${id}`)
    setAvis(a => a.filter(x => x.id !== id))
    toast.success('Supprimé')
  }

  const approuves = avis.filter(a => a.approuve).length

  return (
    <AdminLayout>
      <div className="admin-page">
        <div className="admin-page__header">
          <div>
            <h1>⭐ Témoignages</h1>
            <p className="admin-page__subtitle">
              {approuves} publié{approuves>1?'s':''} · {avis.length - approuves} en attente
              {approuves < 5 && ` · ${5-approuves} avis encore nécessaire(s) avant affichage public`}
            </p>
          </div>
        </div>

        {approuves < 5 && (
          <div style={{background:'#fff8e1',border:'1px solid #fde68a',borderRadius:12,padding:'1rem 1.25rem',marginBottom:'1.5rem',fontSize:'.88rem',color:'#92660e'}}>
            ℹ️ La section témoignages n'apparaît sur le site public qu'à partir de <strong>5 avis approuvés</strong>. Il en faut encore {5-approuves}.
          </div>
        )}

        {loading ? <div className="admin-loading">Chargement…</div> :
         avis.length === 0 ? <div className="admin-empty"><div>⭐</div><p>Aucun avis pour le moment</p></div> :
        <div style={{display:'flex',flexDirection:'column',gap:'.85rem'}}>
          {avis.map(a => (
            <div key={a.id} style={{background:'white',borderRadius:'var(--radius-lg)',padding:'1.25rem',boxShadow:'var(--shadow-sm)',border:`1.5px solid ${a.approuve?'#bbf7d0':'#fde68a'}`}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'.5rem'}}>
                <div>
                  <strong style={{color:'var(--nuit)'}}>{a.prenom}</strong>
                  <span style={{color:'#f5a623',marginLeft:'.5rem'}}>{'★'.repeat(a.note)}{'☆'.repeat(5-a.note)}</span>
                </div>
                <span style={{fontSize:'.72rem',color:'var(--text-muted)'}}>{new Date(a.created_at).toLocaleDateString('fr-FR')}</span>
              </div>
              <p style={{fontSize:'.9rem',color:'var(--text-dark)',lineHeight:1.6,fontStyle:'italic',margin:'0 0 .85rem'}}>"{a.contenu}"</p>
              <div style={{display:'flex',gap:'.6rem',alignItems:'center'}}>
                {a.approuve ? (
                  <>
                    <span style={{background:'#f0fdf4',color:'#15803d',fontSize:'.75rem',fontWeight:700,padding:'3px 10px',borderRadius:50}}>✅ Publié</span>
                    <button onClick={()=>approve(a.id,false)} style={{background:'#f3f4f6',color:'#6b7280',border:'none',borderRadius:6,padding:'3px 10px',cursor:'pointer',fontSize:'.78rem',fontFamily:'inherit',fontWeight:700}}>Masquer</button>
                  </>
                ) : (
                  <button onClick={()=>approve(a.id,true)} style={{background:'#e8f5e9',color:'#2e7d32',border:'none',borderRadius:6,padding:'3px 12px',cursor:'pointer',fontSize:'.78rem',fontFamily:'inherit',fontWeight:700}}>✅ Approuver</button>
                )}
                <button onClick={()=>remove(a.id)} style={{background:'#fee2e2',color:'#991b1b',border:'none',borderRadius:6,padding:'3px 10px',cursor:'pointer',fontSize:'.78rem',fontFamily:'inherit',fontWeight:700,marginLeft:'auto'}}>🗑️</button>
              </div>
            </div>
          ))}
        </div>}
      </div>
    </AdminLayout>
  )
}