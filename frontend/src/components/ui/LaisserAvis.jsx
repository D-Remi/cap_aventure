import { useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'

export default function LaisserAvis({ prenom }) {
  const [note,    setNote]    = useState(5)
  const [contenu, setContenu] = useState('')
  const [sent,    setSent]    = useState(false)
  const [open,    setOpen]    = useState(false)

  const submit = async () => {
    if (contenu.trim().length < 10) { toast.error('Votre avis est un peu court'); return }
    try {
      await axios.post('/api/temoignages', { prenom: prenom || 'Parent', note, contenu })
      setSent(true)
      toast.success('Merci ! Votre avis sera publié après validation.')
    } catch { toast.error('Erreur') }
  }

  if (sent) return (
    <div style={{background:'#f0fdf4',border:'1px solid #bbf7d0',borderRadius:12,padding:'1.25rem',textAlign:'center',color:'#15803d'}}>
      Merci pour votre avis ! Il sera publié après validation.
    </div>
  )

  if (!open) return (
    <button onClick={()=>setOpen(true)} className="btn-secondary" style={{fontSize:'.88rem'}}>
      Laisser un avis
    </button>
  )

  return (
    <div style={{background:'white',border:'1.5px solid var(--sable-light)',borderRadius:12,padding:'1.5rem'}}>
      <h3 style={{color:'var(--nuit)',fontSize:'1rem',marginBottom:'1rem'}}>Votre avis</h3>
      <div style={{marginBottom:'1rem'}}>
        <label style={{fontSize:'.78rem',fontWeight:700,color:'var(--nuit)',display:'block',marginBottom:'.4rem',textTransform:'uppercase'}}>Note</label>
        <div style={{display:'flex',gap:'.25rem',fontSize:'1.6rem',cursor:'pointer'}}>
          {[1,2,3,4,5].map(n => (
            <span key={n} onClick={()=>setNote(n)} style={{color:n<=note?'#f5a623':'#d1d5db',transition:'color .15s'}}></span>
          ))}
        </div>
      </div>
      <textarea value={contenu} onChange={e=>setContenu(e.target.value)} rows={4}
        placeholder="Partagez votre expérience avec Éduc & Vous…"
        style={{width:'100%',padding:'.75rem',border:'1.5px solid var(--sable-dark)',borderRadius:10,fontFamily:'inherit',resize:'vertical',marginBottom:'1rem'}}/>
      <div style={{display:'flex',gap:'.75rem'}}>
        <button onClick={()=>setOpen(false)} className="btn-secondary" style={{flex:1}}>Annuler</button>
        <button onClick={submit} className="btn-primary" style={{flex:1,justifyContent:'center'}}>Envoyer</button>
      </div>
    </div>
  )
}