import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { useAuth } from '../../context/AuthContext'
import './MessagingTab.css'

const ADMIN_ID = 1 // l'animateur — on cherche l'admin dynamiquement

export default function MessagingTab() {
  const { user }        = useAuth()
  const [messages, setMessages] = useState([])
  const [adminUser, setAdminUser] = useState(null)
  const [text, setText]   = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const bottomRef = useRef(null)
  const pollRef   = useRef(null)

  // Trouver l'animateur/admin
  useEffect(() => {
    // Pour un parent : on envoie à l'admin (id le plus bas avec role admin)
    // On cherche dans la liste des conversations ou on suppose id=1
    fetchMessages()
    pollRef.current = setInterval(fetchMessages, 15000) // polling toutes les 15s
    return () => clearInterval(pollRef.current)
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const fetchMessages = async () => {
    try {
      // Récupérer les conversations — si aucune, le parent écrit à l'admin
      const convs = await axios.get('/api/messages/conversations').then(r => r.data)
      if (convs.length > 0) {
        const firstConv = convs[0]
        const otherId = firstConv.user.id
        setAdminUser(firstConv.user)
        const msgs = await axios.get(`/api/messages/with/${otherId}`).then(r => r.data)
        setMessages(msgs)
      } else {
        // Pas encore de conversation — chercher un admin
        setMessages([])
        setAdminUser({ id: 1, prenom: 'L\'animateur', nom: '' })
      }
    } catch {}
    finally { setLoading(false) }
  }

  const sendMessage = async () => {
    if (!text.trim() || sending) return
    const toId = adminUser?.id || 1
    setSending(true)
    try {
      const { data } = await axios.post(`/api/messages/to/${toId}`, { content: text.trim() })
      setMessages(prev => [...prev, data])
      setText('')
    } finally { setSending(false) }
  }

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="dash-section msg-section">
      <div className="dash-section__header">
        <div>
          <h1>💬 Messages</h1>
          <p className="dash-section__sub">Échangez directement avec l'animateur</p>
        </div>
      </div>

      <div className="msg-chat">
        <div className="msg-chat__header">
          <div className="msg-chat__avatar">🧗</div>
          <div>
            <strong>{adminUser?.prenom} {adminUser?.nom}</strong>
            <span>Animateur CapAventure</span>
          </div>
        </div>

        <div className="msg-chat__body">
          {loading ? (
            <div className="msg-loading">Chargement...</div>
          ) : messages.length === 0 ? (
            <div className="msg-empty">
              <span>👋</span>
              <p>Pas encore de message. Posez votre question, l'animateur vous répondra rapidement !</p>
            </div>
          ) : (
            messages.map(m => {
              const isMe = m.sender?.id === user?.id
              return (
                <div key={m.id} className={`msg-bubble ${isMe ? 'msg-bubble--me' : 'msg-bubble--them'}`}>
                  <div className="msg-bubble__content">{m.content}</div>
                  <div className="msg-bubble__time">
                    {new Date(m.created_at).toLocaleTimeString('fr-FR', { hour:'2-digit', minute:'2-digit' })}
                    {' · '}
                    {new Date(m.created_at).toLocaleDateString('fr-FR', { day:'numeric', month:'short' })}
                    {isMe && <span className="msg-bubble__read">{m.read ? ' ✓✓' : ' ✓'}</span>}
                  </div>
                </div>
              )
            })
          )}
          <div ref={bottomRef} />
        </div>

        <div className="msg-chat__input">
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Votre message... (Entrée pour envoyer)"
            rows={2}
            disabled={sending}
          />
          <button
            className="msg-send-btn"
            onClick={sendMessage}
            disabled={!text.trim() || sending}
          >
            {sending ? '⏳' : '➤'}
          </button>
        </div>
      </div>
    </div>
  )
}
