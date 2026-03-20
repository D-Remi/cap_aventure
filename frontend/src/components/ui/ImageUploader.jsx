import { useState, useRef } from 'react'
import axios from 'axios'
import './ImageUploader.css'

export default function ImageUploader({ value, onChange }) {
  const [dragging, setDragging]   = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError]         = useState('')
  const inputRef = useRef()

  const handleFile = async (file) => {
    if (!file) return
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    if (!allowed.includes(file.type)) {
      setError('Format non supporté. Utilisez JPG, PNG ou WebP.')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('Fichier trop lourd (max 5 Mo).')
      return
    }
    setError('')
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const { data } = await axios.post('/api/upload/activity-image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      onChange(data.url)
    } catch (e) {
      setError(e.response?.data?.message || 'Erreur lors de l\'upload.')
    } finally {
      setUploading(false)
    }
  }

  const onDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    handleFile(e.dataTransfer.files[0])
  }

  return (
    <div className="img-uploader">
      {value ? (
        <div className="img-uploader__preview">
          <img src={value} alt="Aperçu" />
          <div className="img-uploader__preview-actions">
            <button type="button" onClick={() => inputRef.current.click()} className="img-uploader__change">
              🔄 Changer
            </button>
            <button type="button" onClick={() => onChange('')} className="img-uploader__remove">
              🗑 Supprimer
            </button>
          </div>
        </div>
      ) : (
        <div
          className={`img-uploader__zone ${dragging ? 'dragging' : ''} ${uploading ? 'uploading' : ''}`}
          onDragEnter={() => setDragging(true)}
          onDragLeave={() => setDragging(false)}
          onDragOver={e => e.preventDefault()}
          onDrop={onDrop}
          onClick={() => inputRef.current.click()}
        >
          {uploading ? (
            <div className="img-uploader__loading">
              <div className="img-uploader__spinner" />
              <span>Upload en cours...</span>
            </div>
          ) : (
            <>
              <span className="img-uploader__icon">📷</span>
              <p><strong>Glissez une photo</strong> ou cliquez pour en choisir une</p>
              <span className="img-uploader__hint">JPG, PNG, WebP — max 5 Mo</span>
            </>
          )}
        </div>
      )}

      {error && <p className="img-uploader__error">{error}</p>}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        style={{ display: 'none' }}
        onChange={e => handleFile(e.target.files[0])}
      />
    </div>
  )
}
