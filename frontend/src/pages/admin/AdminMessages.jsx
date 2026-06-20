import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import AdminLayout from '../../components/layout/AdminLayout'

export default function AdminMessages() {
  const [convs,    setConvs]    = useState([])
  const [active,   setActive]   = useState(null)
  const [messages, setMessages] = useState([])
  const [text,     setText]     = useState('')
  const [sending,  setSending]  = useState(false)
  const bottomRef = useRef(null)
  const pollRef   = useRef(null)

  useEffect(() => {
    fetchConvs()
    pollRef.current = setInterval(fetchConvs, 8000)
    return () => clearInterval(pollRef.current)
  }, [])

  useEffect(() => {
    if (active) fetchMsgs(active.user.id)
  }, [active])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior:'smooth' })
  }, [messages])

  const fetchConvs = () =>
    axios.get('/api/messages/conversations').then(r => setConvs(r.data)).catch(() => {})

  const fetchMsgs = (uid) =>
    axios.get(`/api/messages/with/${uid}`).then(r => setMessages(r.data)).catch(() => {})

  const selectConv = (conv) => {
    setActive(conv)
    fetchMsgs(conv.user.id)
  }

  const send = async () => {
    if (!text.trim() || !active) return
    const content = text.trim()
    setText('')
    setSending(true)
    try {
      const { data } = await axios.post(`/api/messages/to/${active.user.id}`, { content })
      setMessages(prev => [...prev, data])
      fetchConvs()
    } catch { setText(content) }
    finally { setSending(false) }
  }

  const onKey = e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }

  const ini = (u) => ((u?.prenom?.[0]||'') + (u?.nom?.[0]||'')).toUpperCase()

  return (
    <AdminLayout>
      <div className="admin-page" style={{padding:0,height:'calc(100vh - 64px)',display:'flex',overflow:'hidden'}}>
        {/* Liste conversations */}
        <div style={{width:280,flexShrink:0,borderRight:'1px solid var(--sable-light)',display:'flex',flexDirection:'column',background:'white'}}>
          <div style={{padding:'1rem 1.25rem',borderBottom:'1px solid var(--sable-light)'}}>
            <h2 style={{fontFamily:"'Baloo 2',cursive",fontSize:'1.1rem',color:'var(--nuit)',margin:0}}>Messages</h2>
            <p style={{fontSize:'.78rem',color:'var(--text-muted)',margin:'4px 0 0'}}>{convs.length} conversation{convs.length>1?'s':''}</p>
          </div>
          <div style={{flex:1,overflowY:'auto'}}>
            {convs.length === 0 ? (
              <div style={{padding:'2rem',textAlign:'center',color:'var(--text-muted)',fontSize:'.85rem'}}>Aucune conversation</div>
            ) : convs.map(c => (
              <div key={c.user.id}
                onClick={() => selectConv(c)}
                style={{padding:'.85rem 1.25rem',cursor:'pointer',background:active?.user.id===c.user.id?'var(--sable-light)':'white',borderBottom:'1px solid #f5f5f5',transition:'background .15s'}}>
                <div style={{display:'flex',alignItems:'center',gap:'.65rem'}}>
                  <div style={{width:36,height:36,background:'var(--sauge)',color:'white',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:800,fontSize:'.82rem',flexShrink:0}}>
                    {ini(c.user)}
                  </div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontWeight:700,fontSize:'.88rem',color:'var(--nuit)',display:'flex',justifyContent:'space-between'}}>
                      <span>{c.user.prenom} {c.user.nom}</span>
                      {c.unreadCount > 0 && <span style={{background:'var(--sauge)',color:'white',fontSize:'.65rem',fontWeight:800,padding:'1px 6px',borderRadius:50}}>{c.unreadCount}</span>}
                    </div>
                    <div style={{fontSize:'.75rem',color:'var(--text-muted)',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis',marginTop:2}}>
                      {c.lastMessage?.content?.slice(0,40)}…
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Zone messages */}
        {active ? (
          <div style={{flex:1,display:'flex',flexDirection:'column',overflow:'hidden'}}>
            {/* Header */}
            <div style={{padding:'.85rem 1.5rem',borderBottom:'1px solid var(--sable-light)',background:'white',display:'flex',alignItems:'center',gap:'.85rem'}}>
              <div style={{width:36,height:36,background:'var(--sauge)',color:'white',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:800,fontSize:'.82rem',flexShrink:0}}>
                {ini(active.user)}
              </div>
              <div>
                <div style={{fontWeight:700,color:'var(--nuit)',fontSize:'.95rem'}}>{active.user.prenom} {active.user.nom}</div>
                <div style={{fontSize:'.75rem',color:'var(--text-muted)'}}>{active.user.email}</div>
              </div>
            </div>

            {/* Messages */}
            <div style={{flex:1,overflowY:'auto',padding:'1.25rem',display:'flex',flexDirection:'column',gap:'.65rem',background:'var(--sable-light)'}}>
              {messages.map(m => {
                const mine = m.sender?.role === 'admin' || m.sender_id !== active.user.id
                return (
                  <div key={m.id} style={{display:'flex',justifyContent:mine?'flex-end':'flex-start'}}>
                    <div style={{maxWidth:'70%',background:mine?'var(--nuit)':'white',color:mine?'white':'var(--text-dark)',borderRadius:mine?'16px 16px 4px 16px':'16px 16px 16px 4px',padding:'.65rem 1rem',boxShadow:'0 1px 3px rgba(0,0,0,.08)'}}>
                      <div style={{fontSize:'.9rem',lineHeight:1.55}}>{m.content}</div>
                      <div style={{fontSize:'.65rem',opacity:.6,marginTop:4,textAlign:'right'}}>
                        {new Date(m.created_at).toLocaleTimeString('fr-FR',{hour:'2-digit',minute:'2-digit'})}
                      </div>
                    </div>
                  </div>
                )
              })}
              <div ref={bottomRef}/>
            </div>

            {/* Input */}
            <div style={{padding:'.85rem 1.25rem',borderTop:'1px solid var(--sable-light)',background:'white',display:'flex',gap:'.75rem',alignItems:'flex-end'}}>
              <textarea value={text} onChange={e=>setText(e.target.value)} onKeyDown={onKey}
                placeholder="Répondre… (Entrée pour envoyer)" rows={2} disabled={sending}
                style={{flex:1,resize:'none',border:'2px solid var(--sable-dark)',borderRadius:12,padding:'.55rem .85rem',fontFamily:'inherit',fontSize:'.9rem',lineHeight:1.5,background:'var(--blanc)'}}/>
              <button onClick={send} disabled={!text.trim()||sending}
                style={{width:42,height:42,background:'var(--sauge)',color:'white',border:'none',borderRadius:'50%',cursor:'pointer',fontSize:'1.1rem',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,transition:'background .18s'}}>
                              </button>
            </div>
          </div>
        ) : (
          <div style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column',gap:'.75rem',color:'var(--text-muted)'}}>
            <span style={{fontSize:'2.5rem'}}></span>
            <p style={{fontSize:'.9rem'}}>Sélectionnez une conversation</p>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}