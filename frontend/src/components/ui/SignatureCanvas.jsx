import { useRef, useEffect, useState } from 'react'
import './SignatureCanvas.css'

export default function SignatureCanvas({ onSave, onCancel, label = 'Signez ici' }) {
  const canvasRef = useRef(null)
  const [drawing, setDrawing] = useState(false)
  const [empty,   setEmpty]   = useState(true)
  const lastPos = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx    = canvas.getContext('2d')
    ctx.strokeStyle = '#1c1a14'
    ctx.lineWidth   = 2.5
    ctx.lineCap     = 'round'
    ctx.lineJoin    = 'round'
  }, [])

  const getPos = (e) => {
    const r = canvasRef.current.getBoundingClientRect()
    if (e.touches) return { x: e.touches[0].clientX - r.left, y: e.touches[0].clientY - r.top }
    return { x: e.clientX - r.left, y: e.clientY - r.top }
  }

  const start = (e) => {
    e.preventDefault()
    setDrawing(true)
    setEmpty(false)
    lastPos.current = getPos(e)
  }

  const move = (e) => {
    if (!drawing) return
    e.preventDefault()
    const ctx = canvasRef.current.getContext('2d')
    const pos = getPos(e)
    ctx.beginPath()
    ctx.moveTo(lastPos.current.x, lastPos.current.y)
    ctx.lineTo(pos.x, pos.y)
    ctx.stroke()
    lastPos.current = pos
  }

  const end = () => setDrawing(false)

  const clear = () => {
    const canvas = canvasRef.current
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
    setEmpty(true)
  }

  const save = () => {
    if (empty) return
    const data = canvasRef.current.toDataURL('image/png')
    onSave(data)
  }

  return (
    <div className="sig-wrap">
      <p className="sig-label">{label}</p>
      <div className="sig-canvas-wrap">
        <canvas ref={canvasRef} width={480} height={160}
          className="sig-canvas"
          onMouseDown={start} onMouseMove={move} onMouseUp={end} onMouseLeave={end}
          onTouchStart={start} onTouchMove={move} onTouchEnd={end}
        />
        {empty && <div className="sig-placeholder">✍️ Tracez votre signature</div>}
      </div>
      <div className="sig-actions">
        <button type="button" className="btn-secondary" onClick={clear} style={{fontSize:'.85rem'}}>Effacer</button>
        <button type="button" className="btn-secondary" onClick={onCancel} style={{fontSize:'.85rem'}}>Annuler</button>
        <button type="button" className="btn-primary" onClick={save} disabled={empty} style={{fontSize:'.85rem'}}>
          Valider la signature
        </button>
      </div>
    </div>
  )
}