import { useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import './AuthPages.css'
import './ProfilePage.css'

export default function ProfilePage() {
  const { user, login } = useAuth()

  const [info, setInfo]     = useState({ prenom: user?.prenom || '', nom: user?.nom || '', telephone: user?.telephone || '' })
  const [pass, setPass]     = useState({ currentPassword: '', newPassword: '', confirm: '' })
  const [infoMsg, setInfoMsg] = useState('')
  const [passMsg, setPassMsg] = useState('')
  const [infoErr, setInfoErr] = useState('')
  const [passErr, setPassErr] = useState('')
  const [loadInfo, setLoadInfo] = useState(false)
  const [loadPass, setLoadPass] = useState(false)

  const setI = (k) => (e) => setInfo(f => ({ ...f, [k]: e.target.value }))
  const setP = (k) => (e) => setPass(f => ({ ...f, [k]: e.target.value }))

  const handleInfoSubmit = async (e) => {
    e.preventDefault()
    setInfoErr(''); setInfoMsg(''); setLoadInfo(true)
    try {
      await axios.patch('/api/auth/profile', { prenom: info.prenom, nom: info.nom, telephone: info.telephone })
      setInfoMsg('Profil mis à jour ✅')
    } catch (err) {
      setInfoErr(err.response?.data?.message || 'Erreur lors de la mise à jour.')
    } finally { setLoadInfo(false) }
  }

  const handlePassSubmit = async (e) => {
    e.preventDefault()
    setPassErr(''); setPassMsg('')
    if (pass.newPassword !== pass.confirm) { setPassErr('Les mots de passe ne correspondent pas.'); return }
    if (pass.newPassword.length < 8) { setPassErr('Au moins 8 caractères.'); return }
    setLoadPass(true)
    try {
      await axios.patch('/api/auth/profile', {
        currentPassword: pass.currentPassword,
        newPassword: pass.newPassword,
      })
      setPassMsg('Mot de passe modifié ✅')
      setPass({ currentPassword: '', newPassword: '', confirm: '' })
    } catch (err) {
      setPassErr(err.response?.data?.message || 'Erreur lors du changement de mot de passe.')
    } finally { setLoadPass(false) }
  }

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-header">
          <Link to="/dashboard" className="profile-back">← Retour au tableau de bord</Link>
          <div className="profile-avatar">
            {user?.prenom?.[0]}{user?.nom?.[0]}
          </div>
          <h1>{user?.prenom} {user?.nom}</h1>
          <p>{user?.email}</p>
          <span className={`badge badge--${user?.role}`} style={{ marginTop: '0.5rem' }}>
            {user?.role}
          </span>
        </div>

        <div className="profile-cards">
          {/* Informations personnelles */}
          <div className="profile-card">
            <h2>👤 Informations personnelles</h2>
            <form onSubmit={handleInfoSubmit} className="auth-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Prénom</label>
                  <input value={info.prenom} onChange={setI('prenom')} required />
                </div>
                <div className="form-group">
                  <label>Nom</label>
                  <input value={info.nom} onChange={setI('nom')} required />
                </div>
              </div>
              <div className="form-group">
                <label>Téléphone</label>
                <input type="tel" placeholder="06 12 34 56 78" value={info.telephone} onChange={setI('telephone')} />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input value={user?.email} disabled style={{ opacity: 0.6, cursor: 'not-allowed' }} />
              </div>
              {infoErr && <p className="auth-error">{infoErr}</p>}
              {infoMsg && <p className="profile-success">{infoMsg}</p>}
              <button type="submit" className="btn-primary" disabled={loadInfo}>
                {loadInfo ? 'Enregistrement...' : 'Enregistrer'}
              </button>
            </form>
          </div>

          {/* Mot de passe */}
          <div className="profile-card">
            <h2>🔑 Changer le mot de passe</h2>
            <form onSubmit={handlePassSubmit} className="auth-form">
              <div className="form-group">
                <label>Mot de passe actuel</label>
                <input type="password" placeholder="••••••••" value={pass.currentPassword} onChange={setP('currentPassword')} required />
              </div>
              <div className="form-group">
                <label>Nouveau mot de passe</label>
                <input type="password" placeholder="8 caractères min." value={pass.newPassword} onChange={setP('newPassword')} required />
              </div>
              <div className="form-group">
                <label>Confirmer le nouveau</label>
                <input type="password" placeholder="••••••••" value={pass.confirm} onChange={setP('confirm')} required />
              </div>
              {passErr && <p className="auth-error">{passErr}</p>}
              {passMsg && <p className="profile-success">{passMsg}</p>}
              <button type="submit" className="btn-primary" disabled={loadPass}>
                {loadPass ? 'Modification...' : 'Changer le mot de passe'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
