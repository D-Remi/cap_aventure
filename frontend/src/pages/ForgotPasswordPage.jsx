import { useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import './AuthPages.css'

export default function ForgotPasswordPage() {
  const [email, setEmail]   = useState('')
  const [status, setStatus] = useState('idle') // idle | loading | done
  const [error, setError]   = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setStatus('loading')
    try {
      await axios.post('/api/auth/forgot-password', { email })
      setStatus('done')
    } catch {
      setError('Une erreur est survenue. Réessayez.')
      setStatus('idle')
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <Link to="/" className="auth-logo">Cap<span>Aventure</span></Link>
        <h1>Mot de passe oublié</h1>
        <p className="auth-sub">Entrez votre email pour recevoir un lien de réinitialisation</p>

        {status === 'done' ? (
          <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📬</div>
            <h3 style={{ fontFamily: "'Baloo 2',cursive", color: 'var(--vert-foret)', marginBottom: '0.5rem' }}>
              Email envoyé !
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: 1.7 }}>
              Si un compte existe avec cette adresse, vous recevrez un lien dans quelques minutes.
              Vérifiez aussi vos spams.
            </p>
            <Link to="/login" style={{ display: 'inline-block', marginTop: '1.5rem', color: 'var(--vert-clair)', fontWeight: 700 }}>
              ← Retour à la connexion
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label>Adresse email</label>
              <input
                type="email"
                placeholder="marie@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoFocus
              />
            </div>
            {error && <p className="auth-error">{error}</p>}
            <button type="submit" className="btn-primary auth-submit" disabled={status === 'loading'}>
              {status === 'loading' ? 'Envoi...' : 'Envoyer le lien'}
            </button>
          </form>
        )}

        <p className="auth-switch">
          <Link to="/login">← Retour à la connexion</Link>
        </p>
      </div>
    </div>
  )
}
