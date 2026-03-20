import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './AuthPages.css'

export default function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    prenom: '', nom: '', email: '', telephone: '', password: '', confirm: '',
  })
  const [error, setError]   = useState('')
  const [loading, setLoading] = useState(false)

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (form.password !== form.confirm) { setError('Les mots de passe ne correspondent pas.'); return }
    if (form.password.length < 8) { setError('Le mot de passe doit contenir au moins 8 caractères.'); return }
    setLoading(true)
    try {
      await register({
        prenom: form.prenom, nom: form.nom,
        email: form.email, telephone: form.telephone,
        password: form.password,
      })
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la création du compte.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card auth-card--wide">
        <Link to="/" className="auth-logo">Cap<span>Aventure</span></Link>
        <h1>Créer un compte</h1>
        <p className="auth-sub">Inscrivez-vous pour gérer les activités de vos enfants</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-row">
            <div className="form-group">
              <label>Prénom *</label>
              <input type="text" placeholder="Marie" value={form.prenom} onChange={set('prenom')} required />
            </div>
            <div className="form-group">
              <label>Nom *</label>
              <input type="text" placeholder="Dupont" value={form.nom} onChange={set('nom')} required />
            </div>
          </div>

          <div className="form-group">
            <label>Email *</label>
            <input type="email" placeholder="marie@email.com" value={form.email} onChange={set('email')} required />
          </div>

          <div className="form-group">
            <label>Téléphone</label>
            <input type="tel" placeholder="06 12 34 56 78" value={form.telephone} onChange={set('telephone')} />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Mot de passe *</label>
              <input type="password" placeholder="8 caractères min." value={form.password} onChange={set('password')} required />
            </div>
            <div className="form-group">
              <label>Confirmer *</label>
              <input type="password" placeholder="••••••••" value={form.confirm} onChange={set('confirm')} required />
            </div>
          </div>

          {error && <p className="auth-error">{error}</p>}

          <button type="submit" className="btn-primary auth-submit" disabled={loading}>
            {loading ? 'Création...' : 'Créer mon compte'}
          </button>
        </form>

        <p className="auth-switch">
          Déjà un compte ? <Link to="/login">Se connecter</Link>
        </p>
      </div>
    </div>
  )
}
