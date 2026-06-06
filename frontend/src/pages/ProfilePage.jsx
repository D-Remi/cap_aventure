import { useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'

export default function ProfilePage() {
  const { user, setUser } = useAuth()
  const [form, setForm] = useState({
    prenom:    user?.prenom    || '',
    nom:       user?.nom       || '',
    telephone: user?.telephone || '',
  })
  const [pwd, setPwd]     = useState({ current:'', next:'', confirm:'' })
  const [saving, setSaving] = useState(false)
  const [savingPwd, setSavingPwd] = useState(false)
  const set  = k => e => setForm(f=>({...f,[k]:e.target.value}))
  const setP = k => e => setPwd(p=>({...p,[k]:e.target.value}))

  const saveProfile = async e => {
    e.preventDefault()
    setSaving(true)
    try {
      const { data } = await axios.put('/api/users/me', form)
      if (setUser) setUser(data)
      toast.success('Profil mis à jour')
    } catch { toast.error('Erreur') } finally { setSaving(false) }
  }

  const savePassword = async e => {
    e.preventDefault()
    if (pwd.next !== pwd.confirm) { toast.error('Les mots de passe ne correspondent pas'); return }
    if (pwd.next.length < 6) { toast.error('Minimum 6 caractères'); return }
    setSavingPwd(true)
    try {
      await axios.put('/api/users/me/password', { current: pwd.current, password: pwd.next })
      toast.success('Mot de passe modifié')
      setPwd({ current:'', next:'', confirm:'' })
    } catch(e) { toast.error(e.response?.data?.message || 'Erreur') } finally { setSavingPwd(false) }
  }

  const FG = ({label, children}) => (
    <div style={{marginBottom:'.85rem'}}>
      <label style={{display:'block',fontSize:'.78rem',fontWeight:700,color:'var(--nuit)',marginBottom:'.3rem',textTransform:'uppercase',letterSpacing:'.5px'}}>{label}</label>
      {children}
    </div>
  )
  const inp = (val, onChange, type='text', ph='') => (
    <input type={type} value={val} onChange={onChange} placeholder={ph}
      style={{width:'100%',padding:'.6rem .85rem',border:'2px solid var(--sable-dark)',borderRadius:10,fontFamily:'inherit',fontSize:'.9rem',background:'var(--blanc)'}}/>
  )

  return (
    <>
      <Navbar />
      <div style={{paddingTop:'6rem',paddingBottom:'4rem',minHeight:'100vh',background:'var(--sable-light)'}}>
        <div className="container" style={{maxWidth:600}}>
          <div style={{display:'flex',alignItems:'center',gap:'1rem',marginBottom:'2rem'}}>
            <Link to="/dashboard" style={{color:'var(--text-muted)',fontWeight:700,fontSize:'.88rem',textDecoration:'none'}}>← Mon espace</Link>
            <h1 style={{fontFamily:"'Baloo 2',cursive",color:'var(--nuit)',fontSize:'1.8rem',fontWeight:800,margin:0}}>Mon profil</h1>
          </div>

          {/* Avatar */}
          <div style={{background:'white',borderRadius:'var(--radius-xl)',padding:'1.75rem',boxShadow:'var(--shadow-sm)',marginBottom:'1.25rem',display:'flex',alignItems:'center',gap:'1.25rem'}}>
            <div style={{width:64,height:64,background:'var(--sauge)',color:'white',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:"'Baloo 2',cursive",fontWeight:800,fontSize:'1.4rem',flexShrink:0}}>
              {(user?.prenom?.[0]||'').toUpperCase()}{(user?.nom?.[0]||'').toUpperCase()}
            </div>
            <div>
              <div style={{fontFamily:"'Baloo 2',cursive",fontWeight:800,fontSize:'1.2rem',color:'var(--nuit)'}}>{user?.prenom} {user?.nom}</div>
              <div style={{fontSize:'.85rem',color:'var(--text-muted)'}}>{user?.email}</div>
              <div style={{fontSize:'.78rem',color:'var(--sauge)',fontWeight:700,marginTop:4}}>Espace parent</div>
            </div>
          </div>

          {/* Infos perso */}
          <form onSubmit={saveProfile} style={{background:'white',borderRadius:'var(--radius-xl)',padding:'1.75rem',boxShadow:'var(--shadow-sm)',marginBottom:'1.25rem'}}>
            <h2 style={{fontFamily:"'Baloo 2',cursive",color:'var(--nuit)',fontSize:'1.1rem',marginBottom:'1.25rem'}}>Informations personnelles</h2>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'.75rem'}}>
              <FG label="Prénom">{inp(form.prenom, set('prenom'))}</FG>
              <FG label="Nom">{inp(form.nom, set('nom'))}</FG>
            </div>
            <FG label="Email"><input value={user?.email||''} disabled style={{width:'100%',padding:'.6rem .85rem',border:'2px solid var(--sable-light)',borderRadius:10,fontFamily:'inherit',fontSize:'.9rem',background:'#f5f5f5',color:'var(--text-muted)'}}/></FG>
            <FG label="Téléphone">{inp(form.telephone, set('telephone'), 'tel', '06...')}</FG>
            <button type="submit" className="btn-primary" disabled={saving}>{saving?'Enregistrement…':'Enregistrer les modifications'}</button>
          </form>

          {/* Mot de passe */}
          <form onSubmit={savePassword} style={{background:'white',borderRadius:'var(--radius-xl)',padding:'1.75rem',boxShadow:'var(--shadow-sm)'}}>
            <h2 style={{fontFamily:"'Baloo 2',cursive",color:'var(--nuit)',fontSize:'1.1rem',marginBottom:'1.25rem'}}>Changer le mot de passe</h2>
            <FG label="Mot de passe actuel">{inp(pwd.current, setP('current'), 'password')}</FG>
            <FG label="Nouveau mot de passe">{inp(pwd.next, setP('next'), 'password', 'Minimum 6 caractères')}</FG>
            <FG label="Confirmer">{inp(pwd.confirm, setP('confirm'), 'password')}</FG>
            <button type="submit" className="btn-primary" disabled={savingPwd}>{savingPwd?'Modification…':'Changer le mot de passe'}</button>
          </form>
        </div>
      </div>
      <Footer />
    </>
  )
}