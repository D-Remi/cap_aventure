import { useState } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import './AuthPages.css'

export default function ResetPasswordPage() {
  const [searchParams]  = useSearchParams()
  const navigate        = useNavigate()
  const token           = searchParams.get('token') || ''
  const [form, setForm] = useState({ password: '', confirm: '' })
  const [status, setStatus] = useState('idle')
  const [error, setError]   = useState('')

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (form.password !== form.confirm) { setError('Les mots de passe ne correspondent pas.'); return }
    if (form.password.length < 8) { setError('Au moins 8 caractères.'); return }
    setStatus('loading')
    try {
      await axios.post('/api/auth/reset-password', { token, password: form.password })
      setStatus('done')
      setTimeout(() => navigate('/login'), 2500)
    } catch (err) {
      setError(err.response?.data?.message || 'Lien invalide ou expiré.')
      setStatus('idle')
    }
  }

  if (!token) return (
    <div className="auth-page">
      <div className="auth-card">
        <Link to="/" className="auth-logo">Cap<span>Aventure</span></Link>
        <p className="auth-error" style={{ marginTop: '1rem' }}>Lien invalide. Faites une nouvelle demande.</p>
        <p className="auth-switch"><Link to="/forgot-password">Mot de passe oublié →</Link></p>
      </div>
    </div>
  )

  return (
    <div className="auth-page">
      <div className="auth-card">
        <Link to="/" className="auth-logo">Cap<span>Aventure</span></Link>
        <h1>Nouveau mot de passe</h1>
        <p className="auth-sub">Choisissez un mot de passe sécurisé (8 caractères min.)</p>

        {status === 'done' ? (
          <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
            <h3 style={{ fontFamily: "'Baloo 2',cursive", color: 'var(--vert-foret)', marginBottom: '0.5rem' }}>
              Mot de passe modifié !
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
              Redirection vers la connexion...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label>Nouveau mot de passe</label>
              <input type="password" placeholder="8 caractères minimum" value={form.password} onChange={set('password')} required />
            </div>
            <div className="form-group">
              <label>Confirmer le mot de passe</label>
              <input type="password" placeholder="••••••••" value={form.confirm} onChange={set('confirm')} required />
            </div>
            {error && <p className="auth-error">{error}</p>}
            <button type="submit" className="btn-primary auth-submit" disabled={status === 'loading'}>
              {status === 'loading' ? 'Enregistrement...' : 'Changer le mot de passe'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
