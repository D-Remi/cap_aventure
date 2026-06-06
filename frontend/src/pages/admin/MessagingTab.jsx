import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { useAuth } from '../../context/AuthContext'
import './MessagingTab.css'

export default function MessagingTab() {
  const { user }                = useAuth()
  const [messages, setMessages] = useState([])
  const [adminId,  setAdminId]  = useState(null)
  const [adminName,setAdminName]= useState("L'animateur")
  const [text,     setText]     = useState('')
  const [loading,  setLoading]  = useState(true)
  const [sending,  setSending]  = useState(false)
  const bottomRef = useRef(null)
  const pollRef   = useRef(null)

  useEffect(() => {
    init()
    pollRef.current = setInterval(fetchMsgs, 10000)
    return () => clearInterval(pollRef.current)
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior:'smooth' })
  }, [messages])

  const init = async () => {
    try {
      // 1. Chercher les conversations existantes
      const convs = await axios.get('/api/messages/conversations').then(r => r.data)
      if (convs.length > 0) {
        const other = convs[0].user
        setAdminId(other.id)
        setAdminName(`${other.prenom} ${other.nom}`.trim())
        const msgs = await axios.get(`/api/messages/with/${other.id}`).then(r => r.data)
        setMessages(msgs)
      } else {
        // 2. Pas encore de conv → chercher l'admin par les users
        try {
          const users = await axios.get('/api/users').then(r => r.data)
          const admin = users.find(u => u.role === 'admin')
          if (admin) {
            setAdminId(admin.id)
            setAdminName(`${admin.prenom} ${admin.nom}`.trim())
          } else {
            setAdminId(1)
          }
        } catch {
          setAdminId(1)
        }
        setMessages([])
      }
    } catch { setAdminId(1) }
    finally { setLoading(false) }
  }

  const fetchMsgs = async () => {
    if (!adminId) return
    try {
      const msgs = await axios.get(`/api/messages/with/${adminId}`).then(r => r.data)
      setMessages(msgs)
    } catch {}
  }

  // Quand adminId est défini après init, on recharge
  useEffect(() => {
    if (adminId) fetchMsgs()
  }, [adminId])

  const send = async () => {
    if (!text.trim() || sending || !adminId) return
    const content = text.trim()
    setText('')
    setSending(true)
    try {
      const { data } = await axios.post(`/api/messages/to/${adminId}`, { content })
      setMessages(prev => [...prev, data])
    } catch {
      setText(content) // remettre le texte si échec
    } finally { setSending(false) }
  }

  const onKey = e => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() }
  }

  if (loading) return <div style={{padding:'2rem',textAlign:'center',color:'var(--text-muted)'}}>Chargement…</div>

  return (
    <div className="msg-wrap">
      <div className="msg-header">
        <div className="msg-header__avatar">CA</div>
        <div>
          <div className="msg-header__name">{adminName}</div>
          <div className="msg-header__sub">Animateur CapAventure · Répond sous 24h</div>
        </div>
      </div>

      <div className="msg-body">
        {messages.length === 0 && (
          <div className="msg-empty">
            <span>💬</span>
            <p>Commencez la conversation ! Posez vos questions à l'animateur.</p>
          </div>
        )}
        {messages.map(m => {
          const mine = m.sender?.id === user?.id || m.sender_id === user?.id
          return (
            <div key={m.id} className={`msg-bubble ${mine ? 'msg-bubble--mine' : 'msg-bubble--other'}`}>
              <div className="msg-bubble__text">{m.content}</div>
              <div className="msg-bubble__time">
                {new Date(m.created_at).toLocaleTimeString('fr-FR',{hour:'2-digit',minute:'2-digit'})}
                {' · '}
                {new Date(m.created_at).toLocaleDateString('fr-FR',{day:'numeric',month:'short'})}
              </div>
            </div>
          )
        })}
        <div ref={bottomRef}/>
      </div>

      <div className="msg-input">
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={onKey}
          placeholder="Écrivez votre message… (Entrée pour envoyer)"
          rows={2}
          disabled={sending}
        />
        <button className="msg-send-btn" onClick={send} disabled={!text.trim() || sending || !adminId}>
          {sending ? '…' : '➤'}
        </button>
      </div>
    </div>
  )
}