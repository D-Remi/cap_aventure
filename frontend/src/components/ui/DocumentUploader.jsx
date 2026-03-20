import { useState, useRef, useEffect } from 'react'
import axios from 'axios'
import './DocumentUploader.css'

const DOC_TYPES = [
  { value: 'fiche_sanitaire', label: '🏥 Fiche sanitaire' },
  { value: 'autorisation',    label: '✍️ Autorisation parentale' },
  { value: 'assurance',       label: '🛡️ Attestation assurance' },
  { value: 'autre',           label: '📄 Autre document' },
]

const TYPE_ICONS = {
  fiche_sanitaire: '🏥',
  autorisation:    '✍️',
  assurance:       '🛡️',
  autre:           '📄',
}

export default function DocumentsTab({ children }) {
  const [docs, setDocs]         = useState([])
  const [loading, setLoading]   = useState(true)
  const [uploading, setUploading] = useState(false)
  const [error, setError]       = useState('')
  const [form, setForm]         = useState({ child_id: '', type: 'fiche_sanitaire' })
  const [showForm, setShowForm] = useState(false)
  const inputRef = useRef()

  useEffect(() => { fetchDocs() }, [])

  const fetchDocs = async () => {
    try {
      const { data } = await axios.get('/api/documents')
      setDocs(data)
    } finally { setLoading(false) }
  }

  const handleUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (file.size > 10 * 1024 * 1024) { setError('Fichier trop lourd (max 10 Mo).'); return }
    setError(''); setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      if (form.child_id) formData.append('child_id', form.child_id)
      formData.append('type', form.type)
      await axios.post('/api/documents/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      await fetchDocs()
      setShowForm(false)
      setForm({ child_id: '', type: 'fiche_sanitaire' })
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de l\'upload.')
    } finally { setUploading(false) }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer ce document ?')) return
    await axios.delete(`/api/documents/${id}`)
    fetchDocs()
  }

  const formatSize = (bytes) => {
    if (bytes < 1024) return `${bytes} o`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} Ko`
    return `${(bytes / 1024 / 1024).toFixed(1)} Mo`
  }

  return (
    <div className="dash-section">
      <div className="dash-section__header">
        <div>
          <h1>Documents</h1>
          <p className="dash-section__sub">Fiches sanitaires, autorisations, assurances de vos enfants</p>
        </div>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? '✕ Annuler' : '+ Ajouter un document'}
        </button>
      </div>

      {showForm && (
        <div className="dash-form-card" style={{ marginBottom: '1.5rem' }}>
          <h3>📎 Nouveau document</h3>
          <div className="form-row">
            <div className="form-group">
              <label>Type de document *</label>
              <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
                {DOC_TYPES.map(t => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Concerne l'enfant</label>
              <select value={form.child_id} onChange={e => setForm(f => ({ ...f, child_id: e.target.value }))}>
                <option value="">-- Tous / Général --</option>
                {children.map(c => (
                  <option key={c.id} value={c.id}>{c.prenom} {c.nom}</option>
                ))}
              </select>
            </div>
          </div>

          {error && <p className="auth-error">{error}</p>}

          <div
            className="doc-upload-zone"
            onClick={() => inputRef.current.click()}
          >
            {uploading ? (
              <div className="doc-upload-zone__loading">
                <div className="img-uploader__spinner" />
                <span>Upload en cours...</span>
              </div>
            ) : (
              <>
                <span style={{ fontSize: '2rem' }}>📎</span>
                <p><strong>Cliquez pour choisir un fichier</strong></p>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>PDF, JPG, PNG — max 10 Mo</span>
              </>
            )}
          </div>
          <input
            ref={inputRef}
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            style={{ display: 'none' }}
            onChange={handleUpload}
          />
        </div>
      )}

      {loading ? (
        <div className="dash-empty">Chargement...</div>
      ) : docs.length === 0 ? (
        <div className="dash-empty">
          Aucun document enregistré. Ajoutez vos fiches sanitaires, autorisations et assurances pour les avoir à portée.
        </div>
      ) : (
        <div className="docs-list">
          {/* Grouper par type */}
          {DOC_TYPES.map(type => {
            const typeDocs = docs.filter(d => d.type === type.value)
            if (typeDocs.length === 0) return null
            return (
              <div key={type.value} className="docs-group">
                <h3 className="docs-group__title">{type.label}</h3>
                <div className="docs-group__items">
                  {typeDocs.map(doc => (
                    <div key={doc.id} className="doc-card">
                      <div className="doc-card__icon">{TYPE_ICONS[doc.type] || '📄'}</div>
                      <div className="doc-card__info">
                        <strong>{doc.original_name}</strong>
                        <div className="doc-card__meta">
                          {doc.child && <span>👧 {doc.child.prenom} {doc.child.nom}</span>}
                          <span>📦 {formatSize(doc.size)}</span>
                          <span>📅 {new Date(doc.created_at).toLocaleDateString('fr-FR')}</span>
                        </div>
                      </div>
                      <div className="doc-card__actions">
                        <a
                          href={doc.url}
                          target="_blank"
                          rel="noreferrer"
                          className="btn-icon btn-icon--view"
                          title="Voir le document"
                        >
                          👁
                        </a>
                        <button
                          className="btn-icon btn-icon--delete"
                          onClick={() => handleDelete(doc.id)}
                          title="Supprimer"
                        >
                          🗑
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
