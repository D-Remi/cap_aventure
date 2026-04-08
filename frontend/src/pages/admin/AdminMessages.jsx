import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import AdminLayout from '../../components/layout/AdminLayout'
import { useAuth } from '../../context/AuthContext'

const STATUS_BADGE = {
  active:   { label: 'Active',   bg:'#e8f5ed', color:'#166534' },
  archived: { label: 'Clôturée', bg:'#f3f4f6', color:'#6b7280' },
}

export default function AdminMessages() {
  const { user }          = useAuth()
  const [convs, setConvs] = useState([])
  const [parents, setParents] = useState([])
  const [selected, setSelected] = useState(null)
  const [messages, setMessages] = useState([])
  const [text, setText]         = useState('')
  const [sending, setSending]   = useState(false)
  const [loading, setLoading]   = useState(true)
  const [showArchived, setShowArchived] = useState(false)
  const [confirm, setConfirm]   = useState(null) // { type, userId, label }
  const bottomRef = useRef(null)
  const pollRef   = useRef(null)

  const fetchConvs = async () => {
    const r = await axios.get('/api/messages/conversations').catch(() => null)
    if (r) setConvs(r.data)
  }

  const fetchConv = async (userId) => {
    const { data } = await axios.get(`/api/messages/with/${userId}`)
    setMessages(data)
  }

  useEffect(() => {
    Promise.all([
      fetchConvs(),
      axios.get('/api/messages/parents').then(r => setParents(r.data)),
    ]).finally(() => setLoading(false))

    pollRef.current = setInterval(async () => {
      await fetchConvs()
      if (selected) fetchConv(selected.id)
    }, 10000)
    return () => clearInterval(pollRef.current)
  }, [])

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:'smooth' }) }, [messages])

  const selectUser = async (u) => {
    setSelected(u)
    await fetchConv(u.id)
  }

  const sendMessage = async () => {
    if (!text.trim() || !selected || sending) return
    setSending(true)
    try {
      const { data } = await axios.post(`/api/messages/to/${selected.id}`, { content: text.trim() })
      setMessages(prev => [...prev, data])
      setText('')
      fetchConvs()
    } finally { setSending(false) }
  }

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() }
  }

  const handleArchive = async (userId, isArchived) => {
    const endpoint = isArchived ? 'unarchive' : 'archive'
    await axios.patch(`/api/messages/${endpoint}/${userId}`)
    fetchConvs()
    setConfirm(null)
  }

  const handleDeleteConv = async (userId) => {
    await axios.delete(`/api/messages/conv/${userId}`)
    setMessages([])
    setSelected(null)
    fetchConvs()
    setConfirm(null)
  }

  const handleDeleteMsg = async (msgId) => {
    await axios.delete(`/api/messages/msg/${msgId}`)
    setMessages(prev => prev.filter(m => m.id !== msgId))
  }

  const visibleConvs = convs.filter(c => showArchived ? c.archived : !c.archived)
  const convUserIds  = new Set(convs.map(c => c.user.id))
  const newParents   = parents.filter(p => !convUserIds.has(p.id))
  const selectedConv = convs.find(c => c.user.id === selected?.id)

  return (
    <AdminLayout>
      <div className="admin-page" style={{ padding:0, height:'calc(100vh - 80px)', display:'flex', flexDirection:'column' }}>
        <div style={{ padding:'1.25rem 2rem 0.75rem', flexShrink:0, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <div>
            <h1 style={{ fontSize:'1.3rem', fontFamily:"'Baloo 2',cursive", color:'var(--bleu-nuit)' }}>💬 Messages</h1>
            <p style={{ color:'var(--text-muted)', fontSize:'0.85rem' }}>
              {convs.filter(c => !c.archived).length} active{convs.filter(c=>!c.archived).length>1?'s':''} · {convs.filter(c=>c.archived).length} clôturée{convs.filter(c=>c.archived).length>1?'s':''}
            </p>
          </div>
          <button
            onClick={() => setShowArchived(s => !s)}
            style={{ padding:'0.4rem 0.85rem', border:'1.5px solid #dde8e1', borderRadius:50, fontSize:'0.8rem', fontWeight:700, cursor:'pointer', background: showArchived ? '#f3f4f6' : 'var(--blanc)', color:'var(--text-muted)' }}
          >
            {showArchived ? '← Actives' : '🗄️ Archivées'}
          </button>
        </div>

        <div style={{ display:'flex', flex:1, overflow:'hidden' }}>
          {/* Liste conversations */}
          <div style={{ width:270, borderRight:'1px solid #eef2ee', overflow:'auto', flexShrink:0 }}>
            {loading ? <div style={{ padding:'1rem', color:'var(--text-muted)', fontSize:'0.85rem' }}>Chargement...</div> : (
              <>
                {visibleConvs.map(c => {
                  const isSelected = selected?.id === c.user.id
                  return (
                    <div
                      key={c.user.id}
                      onClick={() => selectUser(c.user)}
                      style={{
                        padding:'0.85rem 1rem', cursor:'pointer',
                        borderBottom:'1px solid #f3f4f6',
                        background: isSelected ? '#e8f5ed' : 'var(--blanc)',
                        borderLeft: isSelected ? '3px solid var(--vert-clair)' : '3px solid transparent',
                        transition:'all 0.15s',
                      }}
                    >
                      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', gap:'0.5rem' }}>
                        <strong style={{ fontSize:'0.88rem', color:'var(--bleu-nuit)', flexShrink:0 }}>
                          {c.user.prenom} {c.user.nom}
                        </strong>
                        <div style={{ display:'flex', gap:'0.3rem', alignItems:'center' }}>
                          {c.archived && <span style={{ fontSize:'0.65rem', background:'#f3f4f6', color:'#6b7280', padding:'1px 6px', borderRadius:50, fontWeight:700 }}>Clôturée</span>}
                          {c.unreadCount > 0 && <span style={{ background:'#dc2626', color:'#fff', borderRadius:50, fontSize:'0.68rem', fontWeight:800, padding:'1px 6px', flexShrink:0 }}>{c.unreadCount}</span>}
                        </div>
                      </div>
                      <div style={{ fontSize:'0.75rem', color:'var(--text-muted)', marginTop:'0.2rem', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>
                        {c.lastMessage?.content?.slice(0,38)}{c.lastMessage?.content?.length > 38 ? '…' : ''}
                      </div>
                      <div style={{ fontSize:'0.68rem', color:'#c0cbc0', marginTop:'0.1rem' }}>
                        {c.totalMessages} message{c.totalMessages>1?'s':''} {c.hasDeleted ? '· contient des supprimés' : ''}
                      </div>
                    </div>
                  )
                })}
                {!showArchived && newParents.length > 0 && (
                  <>
                    <div style={{ padding:'0.4rem 1rem', fontSize:'0.68rem', fontWeight:800, color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.5px', background:'#f9fafb' }}>
                      Nouveau message
                    </div>
                    {newParents.map(p => (
                      <div key={p.id} onClick={() => selectUser(p)}
                        style={{ padding:'0.75rem 1rem', cursor:'pointer', borderBottom:'1px solid #f3f4f6', background: selected?.id === p.id ? '#e8f5ed' : 'var(--blanc)', fontSize:'0.85rem', color:'var(--text-muted)', borderLeft: selected?.id === p.id ? '3px solid var(--vert-clair)' : '3px solid transparent' }}>
                        + {p.prenom} {p.nom}
                      </div>
                    ))}
                  </>
                )}
                {visibleConvs.length === 0 && newParents.length === 0 && (
                  <div style={{ padding:'1.5rem 1rem', color:'var(--text-muted)', fontSize:'0.82rem', textAlign:'center' }}>
                    {showArchived ? 'Aucune conversation archivée' : 'Aucune conversation active'}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Zone chat */}
          {selected ? (
            <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>
              {/* Header chat avec actions */}
              <div style={{ padding:'0.75rem 1.25rem', borderBottom:'1px solid #eef2ee', background:'var(--bg-light)', flexShrink:0, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <div>
                  <strong style={{ fontSize:'0.95rem', color:'var(--bleu-nuit)' }}>{selected.prenom} {selected.nom}</strong>
                  {selectedConv?.archived && <span style={{ marginLeft:'0.5rem', fontSize:'0.72rem', background:'#f3f4f6', color:'#6b7280', padding:'2px 8px', borderRadius:50, fontWeight:700 }}>Clôturée</span>}
                </div>
                <div style={{ display:'flex', gap:'0.5rem' }}>
                  {/* Archiver / Réouvrir */}
                  <button
                    onClick={() => setConfirm({ type: selectedConv?.archived ? 'unarchive' : 'archive', userId: selected.id, label: `${selected.prenom} ${selected.nom}` })}
                    style={{ padding:'0.35rem 0.8rem', borderRadius:8, border:'1.5px solid #dde8e1', background:'var(--blanc)', fontSize:'0.78rem', fontWeight:700, cursor:'pointer', color:'var(--text-muted)' }}
                    title={selectedConv?.archived ? 'Réouvrir' : 'Clôturer la conversation'}
                  >
                    {selectedConv?.archived ? '🔓 Réouvrir' : '🗄️ Clôturer'}
                  </button>
                  {/* Supprimer conversation */}
                  <button
                    onClick={() => setConfirm({ type:'deleteConv', userId: selected.id, label: `${selected.prenom} ${selected.nom}` })}
                    style={{ padding:'0.35rem 0.8rem', borderRadius:8, border:'1.5px solid #fca5a5', background:'#fee2e2', fontSize:'0.78rem', fontWeight:700, cursor:'pointer', color:'#dc2626' }}
                    title="Supprimer la conversation (soft delete)"
                  >
                    🗑️ Supprimer
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div style={{ flex:1, overflow:'auto', padding:'1rem 1.25rem', display:'flex', flexDirection:'column', gap:'0.65rem' }}>
                {messages.length === 0 && (
                  <div style={{ textAlign:'center', color:'var(--text-muted)', fontSize:'0.85rem', marginTop:'2rem' }}>Aucun message</div>
                )}
                {messages.map(m => {
                  const isMe = m.sender?.id === user?.id
                  return (
                    <div key={m.id} style={{ maxWidth:'72%', alignSelf: isMe ? 'flex-end' : 'flex-start', position:'relative' }}
                      className="msg-row"
                      onMouseEnter={e => e.currentTarget.querySelector('.msg-del')?.style && (e.currentTarget.querySelector('.msg-del').style.opacity='1')}
                      onMouseLeave={e => e.currentTarget.querySelector('.msg-del')?.style && (e.currentTarget.querySelector('.msg-del').style.opacity='0')}
                    >
                      <div style={{
                        padding:'0.6rem 0.95rem', borderRadius:16, fontSize:'0.88rem', lineHeight:1.55,
                        background: isMe ? 'var(--bleu-nuit)' : '#f3f4f6',
                        color: isMe ? '#fff' : 'var(--text-dark)',
                        borderBottomRightRadius: isMe ? 3 : 16,
                        borderBottomLeftRadius: isMe ? 16 : 3,
                      }}>
                        {m.content}
                      </div>
                      <div style={{ fontSize:'0.68rem', color:'var(--text-muted)', marginTop:'0.15rem', textAlign: isMe ? 'right' : 'left', paddingInline:'0.2rem', display:'flex', justifyContent: isMe ? 'flex-end' : 'flex-start', alignItems:'center', gap:'0.4rem' }}>
                        {new Date(m.created_at).toLocaleString('fr-FR', { day:'numeric', month:'short', hour:'2-digit', minute:'2-digit' })}
                        {isMe && <span style={{ color:'var(--vert-clair)' }}>{m.read ? '✓✓' : '✓'}</span>}
                        {/* Bouton supprimer message individuel */}
                        <button
                          className="msg-del"
                          onClick={() => handleDeleteMsg(m.id)}
                          style={{ opacity:0, background:'none', border:'none', cursor:'pointer', fontSize:'0.7rem', color:'#dc2626', padding:0, transition:'opacity 0.15s' }}
                          title="Supprimer ce message"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  )
                })}
                <div ref={bottomRef} />
              </div>

              {/* Input */}
              {!selectedConv?.archived && (
                <div style={{ display:'flex', gap:'0.75rem', padding:'0.85rem 1.25rem', borderTop:'1px solid #eef2ee', background:'var(--bg-light)', flexShrink:0 }}>
                  <textarea
                    value={text} onChange={e => setText(e.target.value)} onKeyDown={handleKey}
                    placeholder="Votre réponse… (Entrée pour envoyer)"
                    rows={2}
                    style={{ flex:1, border:'1.5px solid #dde8e1', borderRadius:12, padding:'0.6rem 0.85rem', fontFamily:'Nunito,sans-serif', fontSize:'0.88rem', resize:'none' }}
                  />
                  <button onClick={sendMessage} disabled={!text.trim() || sending}
                    style={{ width:42, height:42, background:'var(--bleu-nuit)', color:'#fff', border:'none', borderRadius:'50%', fontSize:'1rem', cursor:'pointer', alignSelf:'flex-end', display:'flex', alignItems:'center', justifyContent:'center' }}>
                    {sending ? '⏳' : '➤'}
                  </button>
                </div>
              )}
              {selectedConv?.archived && (
                <div style={{ padding:'0.75rem', textAlign:'center', fontSize:'0.82rem', color:'var(--text-muted)', borderTop:'1px solid #eef2ee', background:'#f9fafb' }}>
                  Conversation clôturée — <button onClick={() => handleArchive(selected.id, true)} style={{ background:'none', border:'none', color:'var(--vert-foret)', fontWeight:700, cursor:'pointer', fontSize:'0.82rem' }}>Réouvrir</button>
                </div>
              )}
            </div>
          ) : (
            <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:'1rem', color:'var(--text-muted)' }}>
              <span style={{ fontSize:'3rem' }}>💬</span>
              <p style={{ fontSize:'0.9rem' }}>Sélectionnez une conversation</p>
            </div>
          )}
        </div>
      </div>

      {/* Modale de confirmation */}
      {confirm && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.45)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000 }} onClick={() => setConfirm(null)}>
          <div style={{ background:'var(--blanc)', borderRadius:16, padding:'1.75rem', maxWidth:380, width:'90%', boxShadow:'0 20px 60px rgba(0,0,0,0.2)' }} onClick={e => e.stopPropagation()}>
            <h3 style={{ fontFamily:"'Baloo 2',cursive", fontSize:'1.1rem', color:'var(--bleu-nuit)', marginBottom:'0.75rem' }}>
              {confirm.type === 'archive' && '🗄️ Clôturer la conversation'}
              {confirm.type === 'unarchive' && '🔓 Réouvrir la conversation'}
              {confirm.type === 'deleteConv' && '🗑️ Supprimer la conversation'}
            </h3>
            <p style={{ fontSize:'0.88rem', color:'var(--text-muted)', marginBottom:'1.25rem', lineHeight:1.6 }}>
              {confirm.type === 'archive' && `La conversation avec ${confirm.label} sera clôturée. Les messages restent visibles dans l'historique archivé.`}
              {confirm.type === 'unarchive' && `La conversation avec ${confirm.label} sera réouverte et visible dans la liste active.`}
              {confirm.type === 'deleteConv' && `Les messages avec ${confirm.label} seront supprimés (soft delete — trace conservée en base). Cette action est irréversible depuis l'interface.`}
            </p>
            <div style={{ display:'flex', gap:'0.75rem' }}>
              {confirm.type === 'archive' && <button className="btn-primary" onClick={() => handleArchive(confirm.userId, false)}>Clôturer</button>}
              {confirm.type === 'unarchive' && <button className="btn-primary" onClick={() => handleArchive(confirm.userId, true)}>Réouvrir</button>}
              {confirm.type === 'deleteConv' && <button style={{ padding:'0.6rem 1.1rem', background:'#dc2626', color:'#fff', border:'none', borderRadius:8, fontWeight:700, cursor:'pointer' }} onClick={() => handleDeleteConv(confirm.userId)}>Supprimer</button>}
              <button className="btn-secondary" onClick={() => setConfirm(null)}>Annuler</button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
