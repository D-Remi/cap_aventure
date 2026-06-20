import { useState, useEffect } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'

export default function PhotosTab() {
  const [photos,  setPhotos]  = useState([])
  const [loading, setLoading] = useState(true)
  const [viewing, setViewing] = useState(null)

  useEffect(() => {
    axios.get('/api/photos')
      .then(r => setPhotos(r.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const viewPhoto = async (photo) => {
    try {
      const { data } = await axios.get(`/api/photos/${photo.id}/data`)
      setViewing(data)
    } catch { toast.error('Impossible de charger la photo') }
  }

  const fmtDate = (d) => d ? new Date(d + 'T00:00:00').toLocaleDateString('fr-FR', { weekday:'long', day:'numeric', month:'long', year:'numeric' }) : ''

  // Grouper par date de séance
  const grouped = photos.reduce((acc, p) => {
    const key = p.date_seance || 'Sans date'
    if (!acc[key]) acc[key] = []
    acc[key].push(p)
    return acc
  }, {})

  if (loading) return <div style={{padding:'2rem',textAlign:'center',color:'var(--text-muted)'}}>Chargement…</div>

  return (
    <div className="dash-tab">
      <h2>Photos des séances</h2>
      <p className="dash-subtitle">Les souvenirs partagés par votre animateur après chaque séance.</p>

      {photos.length === 0 ? (
        <div className="dash-empty">
          <div style={{fontSize:'3rem',marginBottom:'.75rem'}}></div>
          <p>Aucune photo partagée pour le moment.</p>
          <p style={{fontSize:'.85rem',color:'var(--text-muted)',marginTop:'.4rem'}}>Les photos apparaîtront ici après les séances, si vous avez donné l'autorisation photo dans le dossier de votre enfant.</p>
        </div>
      ) : (
        <div>
          {Object.entries(grouped).sort(([a],[b]) => b.localeCompare(a)).map(([date, list]) => (
            <div key={date} style={{marginBottom:'2.5rem'}}>
              <div style={{display:'flex',alignItems:'center',gap:.75+'rem',marginBottom:'1rem'}}>
                <div style={{width:8,height:8,borderRadius:'50%',background:'var(--sauge)',flexShrink:0}}/>
                <h3 style={{fontFamily:"'Baloo 2',cursive",fontSize:'1rem',color:'var(--nuit)',fontWeight:700}}>
                  {date === 'Sans date' ? 'Photos diverses' : fmtDate(date)}
                </h3>
                <span style={{fontSize:'.78rem',color:'var(--text-muted)',marginLeft:'auto'}}>{list.length} photo{list.length>1?'s':''}</span>
              </div>

              <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(180px,1fr))',gap:'1rem'}}>
                {list.map(p => (
                  <div key={p.id}
                    onClick={() => viewPhoto(p)}
                    style={{
                      borderRadius:'var(--radius-lg)',overflow:'hidden',
                      background:'var(--sable-light)',cursor:'pointer',
                      border:'1.5px solid var(--sable-light)',
                      transition:'all .2s',position:'relative',
                      aspectRatio:'1',
                    }}
                    onMouseEnter={e => {e.currentTarget.style.transform='translateY(-4px)';e.currentTarget.style.boxShadow='var(--shadow-md)'}}
                    onMouseLeave={e => {e.currentTarget.style.transform='none';e.currentTarget.style.boxShadow='none'}}
                  >
                    {/* Placeholder — la vraie image se charge à l'ouverture */}
                    <div style={{width:'100%',height:'100%',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:'.5rem',padding:'1rem'}}>
                      <div style={{fontSize:'2.5rem'}}></div>
                      {p.titre && <div style={{fontSize:'.78rem',fontWeight:700,color:'var(--nuit)',textAlign:'center',lineHeight:1.3}}>{p.titre}</div>}
                      {p.child && <div style={{fontSize:'.72rem',color:'var(--text-muted)'}}>{p.child.prenom}</div>}
                    </div>
                    <div style={{position:'absolute',bottom:0,left:0,right:0,background:'rgba(45,58,107,.7)',padding:'.5rem .7rem'}}>
                      <div style={{fontSize:'.72rem',color:'white',fontWeight:600,display:'flex',alignItems:'center',gap:.3+'rem'}}>
                        Voir
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal visualisation */}
      {viewing && (
        <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,.85)',zIndex:600,display:'flex',alignItems:'center',justifyContent:'center',padding:'1rem'}}
          onClick={() => setViewing(null)}>
          <div style={{background:'white',borderRadius:'var(--radius-xl)',overflow:'hidden',maxWidth:700,width:'100%',maxHeight:'92vh',display:'flex',flexDirection:'column'}}
            onClick={e => e.stopPropagation()}>
            <div style={{background:'var(--nuit)',padding:'1rem 1.5rem',display:'flex',justifyContent:'space-between',alignItems:'center',flexShrink:0}}>
              <div>
                <div style={{color:'white',fontWeight:700,fontSize:'.95rem'}}>{viewing.titre || 'Photo de séance'}</div>
                {viewing.date_seance && <div style={{color:'rgba(210,225,255,.65)',fontSize:'.78rem'}}>{fmtDate(viewing.date_seance)}</div>}
              </div>
              <div style={{display:'flex',gap:'.6rem',alignItems:'center'}}>
                <a href={viewing.data} download={`CapAventure_${viewing.date_seance||'photo'}.jpg`}
                  style={{background:'rgba(255,255,255,.15)',color:'white',padding:'.3rem .85rem',borderRadius:8,fontSize:'.82rem',fontWeight:700,textDecoration:'none',display:'flex',alignItems:'center',gap:'.35rem'}}>
                  ⬇Télécharger
                </a>
                <button onClick={() => setViewing(null)}
                  style={{background:'rgba(255,255,255,.15)',border:'none',color:'white',width:30,height:30,borderRadius:'50%',cursor:'pointer',fontFamily:'inherit',fontSize:'1.1rem',display:'flex',alignItems:'center',justifyContent:'center'}}>
                                  </button>
              </div>
            </div>
            <div style={{flex:1,overflow:'auto',background:'#111',display:'flex',alignItems:'center',justifyContent:'center',minHeight:300}}>
              {viewing.mimetype?.includes('image') ? (
                <img src={viewing.data} alt={viewing.titre||'Photo'} style={{maxWidth:'100%',maxHeight:'75vh',objectFit:'contain'}}/>
              ) : (
                <div style={{padding:'3rem',textAlign:'center',color:'#999'}}>
                  <div style={{fontSize:'3rem',marginBottom:'1rem'}}></div>
                  <p>Prévisualisation non disponible.</p>
                  <a href={viewing.data} download style={{color:'var(--sauge)',display:'inline-block',marginTop:'1rem'}}>⬇Télécharger</a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
