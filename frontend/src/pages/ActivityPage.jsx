import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import { useAuth } from '../context/AuthContext'
import './ActivityPage.css'

const TYPE_ICONS = { ski:'⛷️', vtt:'🚵', rando:'🥾', scout:'🌲', autre:'🎯' }
const TYPE_LABELS = { ski:'Ski & Montagne', vtt:'VTT & Vélo', rando:'Randonnée', scout:'Nature & Scouts', autre:'Activité' }
const PAYMENT_INFO = {
  especes:  { icon:'💵', label:'Espèces',          desc:'Paiement en main propre lors de l\'activité' },
  virement: { icon:'🏦', label:'Virement bancaire', desc:'Coordonnées communiquées après inscription' },
  cesu:     { icon:'🎫', label:'CESU',              desc:'Chèque emploi service universel accepté' },
}
const POINTS_FOR_FREE = 200

function formatScheduleDisplay(a) {
  if (!a) return ''
  if (a.schedule_type === 'ponctuelle' && a.date) {
    const d = new Date(a.date)
    return {
      date: d.toLocaleDateString('fr-FR', { weekday:'long', day:'numeric', month:'long', year:'numeric' }),
      time: d.toLocaleTimeString('fr-FR', { hour:'2-digit', minute:'2-digit' }),
    }
  }
  if (a.schedule_type === 'multi_dates' && a.dates?.length) {
    return {
      dates: a.dates.map(d => new Date(d).toLocaleDateString('fr-FR', { weekday:'short', day:'numeric', month:'short' })),
    }
  }
  if (a.schedule_type === 'recurrente' || a.schedule_type === 'saisonniere') {
    return {
      recurring: a.periode_label || `${(a.recurrence_days||[]).join(', ')}`,
      period: a.date_debut && a.date_fin
        ? `Du ${new Date(a.date_debut).toLocaleDateString('fr-FR',{day:'numeric',month:'long'})} au ${new Date(a.date_fin).toLocaleDateString('fr-FR',{day:'numeric',month:'long',year:'numeric'})}`
        : '',
      time: a.recurrence_time,
    }
  }
  return {}
}

export default function ActivityPage() {
  const { id }          = useParams()
  const { user }        = useAuth()
  const navigate        = useNavigate()
  const [activity, setActivity]     = useState(null)
  const [children, setChildren]     = useState([])
  const [pointsData, setPointsData] = useState([])
  const [loading, setLoading]       = useState(true)
  const [childId, setChildId]       = useState('')
  const [payMode, setPayMode]       = useState('normal') // 'normal' | 'points'
  const [regStatus, setRegStatus]   = useState('idle')
  const [regMsg, setRegMsg]         = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`/api/activities/${id}`)
        setActivity(data)
        if (user) {
          const [c, p] = await Promise.all([
            axios.get('/api/children'),
            axios.get('/api/points/mine').catch(() => ({ data: [] })),
          ])
          setChildren(c.data)
          setPointsData(p.data)
          if (c.data.length > 0) setChildId(String(c.data[0].id))
        }
      } catch { navigate('/calendrier') }
      finally { setLoading(false) }
    }
    fetchData()
  }, [id, user])

  const getChildPoints = (cId) => {
    const found = pointsData.find(p => p.child?.id === parseInt(cId))
    return found?.total || 0
  }

  const handleRegister = async () => {
    if (!user) { navigate('/login'); return }
    if (!childId) { setRegMsg('Sélectionnez un enfant.'); return }
    const pts = getChildPoints(childId)
    if (payMode === 'points' && pts < POINTS_FOR_FREE) {
      setRegMsg(`Points insuffisants (${pts} / ${POINTS_FOR_FREE} requis).`); return
    }
    setRegStatus('loading'); setRegMsg('')
    try {
      await axios.post('/api/registrations', {
        activity_id: parseInt(id),
        child_id: parseInt(childId),
      })
      if (payMode === 'points') {
        await axios.post('/api/points/redeem', {
          child_id: parseInt(childId),
          cost: POINTS_FOR_FREE,
          description: `Journée gratuite — ${activity.titre}`,
        }).catch(() => {})
      }
      setRegStatus('success')
      setRegMsg(payMode === 'points'
        ? `🎉 Inscription gratuite ! ${POINTS_FOR_FREE} points déduits.`
        : 'Inscription enregistrée ! Vous recevrez un email de confirmation.'
      )
    } catch (e) {
      setRegStatus('error')
      setRegMsg(e.response?.data?.message || 'Erreur lors de l\'inscription.')
    }
  }

  if (loading) return (
    <>
      <Navbar />
      <div style={{ minHeight:'60vh', display:'flex', alignItems:'center', justifyContent:'center', color:'var(--text-muted)' }}>
        Chargement...
      </div>
      <Footer />
    </>
  )

  if (!activity) return null

  const isFull    = activity.places_restantes === 0
  const sched     = formatScheduleDisplay(activity)
  const selPts    = childId ? getChildPoints(childId) : 0
  const canPayPts = selPts >= POINTS_FOR_FREE

  return (
    <>
      <Navbar />
      <div className="activity-page">
        {/* Hero */}
        <div className="activity-hero" style={{
          backgroundImage: activity.image_url
            ? `linear-gradient(to bottom, rgba(13,44,74,0.6) 0%, rgba(13,44,74,0.85) 100%), url(${activity.image_url})`
            : 'linear-gradient(135deg, var(--bleu-nuit), var(--vert-foret))',
        }}>
          <div className="container activity-hero__inner">
            <Link to="/calendrier" className="activity-back">← Retour au calendrier</Link>
            <div className="activity-hero__type">
              <span>{TYPE_ICONS[activity.type] || '🎯'}</span>
              {TYPE_LABELS[activity.type] || 'Activité'}
            </div>
            <h1>{activity.titre}</h1>
            <div className="activity-hero__meta">
              {sched.date   && <span>📅 {sched.date}</span>}
              {sched.time   && <span>🕐 {sched.time}</span>}
              {sched.recurring && <span>🔄 {sched.recurring}</span>}
              {sched.period && <span>📆 {sched.period}</span>}
              {sched.dates  && <span>📆 {sched.dates.length} dates</span>}
              <span>👥 {isFull ? '🚫 Complet' : `${activity.places_restantes} place${activity.places_restantes > 1 ? 's' : ''} restante${activity.places_restantes > 1 ? 's' : ''}`}</span>
            </div>
          </div>
        </div>

        <div className="container activity-body">
          <div className="activity-content">
            {/* Description */}
            <div className="activity-section">
              <h2>📋 Description</h2>
              <p>{activity.description}</p>
            </div>

            {/* Infos pratiques */}
            <div className="activity-section">
              <h2>ℹ️ Informations pratiques</h2>
              <div className="activity-info-grid">
                {/* Dates selon le mode */}
                {activity.schedule_type === 'ponctuelle' && sched.date && (
                  <>
                    <div className="activity-info-card"><span className="activity-info-card__icon">📅</span><div><strong>Date</strong><span>{sched.date}</span></div></div>
                    <div className="activity-info-card"><span className="activity-info-card__icon">🕐</span><div><strong>Heure</strong><span>{sched.time}</span></div></div>
                  </>
                )}
                {activity.schedule_type === 'multi_dates' && sched.dates && (
                  <div className="activity-info-card" style={{ gridColumn:'span 2' }}>
                    <span className="activity-info-card__icon">📆</span>
                    <div>
                      <strong>Dates des séances</strong>
                      <span style={{ display:'flex', flexWrap:'wrap', gap:'0.35rem', marginTop:'0.25rem' }}>
                        {sched.dates.map((d,i) => (
                          <span key={i} style={{ background:'#e8f5ed', color:'var(--vert-foret)', borderRadius:50, padding:'0.15rem 0.6rem', fontSize:'0.78rem', fontWeight:600 }}>{d}</span>
                        ))}
                      </span>
                    </div>
                  </div>
                )}
                {(activity.schedule_type === 'recurrente' || activity.schedule_type === 'saisonniere') && (
                  <>
                    <div className="activity-info-card"><span className="activity-info-card__icon">🔄</span><div><strong>Récurrence</strong><span>{sched.recurring}</span></div></div>
                    {sched.time && <div className="activity-info-card"><span className="activity-info-card__icon">🕐</span><div><strong>Heure</strong><span>{sched.time}</span></div></div>}
                    {sched.period && <div className="activity-info-card" style={{ gridColumn:'span 2' }}><span className="activity-info-card__icon">📆</span><div><strong>Période</strong><span>{sched.period}</span></div></div>}
                  </>
                )}

                <div className="activity-info-card"><span className="activity-info-card__icon">💶</span><div><strong>Prix</strong>
                  <span>
                    {parseFloat(activity.prix).toFixed(2)}€
                    {activity.prix_seance && <> · {parseFloat(activity.prix_seance).toFixed(2)}€/séance</>}
                  </span>
                </div></div>
                <div className="activity-info-card"><span className="activity-info-card__icon">👥</span><div><strong>Places</strong><span>{isFull ? 'Complet' : `${activity.places_restantes} / ${activity.places_max} disponibles`}</span></div></div>
                {activity.lieu && <div className="activity-info-card"><span className="activity-info-card__icon">📍</span><div><strong>Lieu</strong><span>{activity.lieu}</span></div></div>}
                <div className="activity-info-card"><span className="activity-info-card__icon">✅</span><div><strong>Encadrement</strong><span>Animateur certifié BAFA</span></div></div>
                {(activity.age_min || activity.age_max) && (
                  <div className="activity-info-card"><span className="activity-info-card__icon">🎂</span><div><strong>Âge</strong><span>{activity.age_min && activity.age_max ? `${activity.age_min}–${activity.age_max} ans` : activity.age_min ? `Dès ${activity.age_min} ans` : `Jusqu'à ${activity.age_max} ans`}</span></div></div>
                )}
              </div>
            </div>

            {/* Modes de paiement */}
            {activity.payment_methods?.length > 0 && (
              <div className="activity-section">
                <h2>💳 Modes de paiement acceptés</h2>
                <div style={{ display:'flex', flexDirection:'column', gap:'0.75rem' }}>
                  {activity.payment_methods.map(m => {
                    const info = PAYMENT_INFO[m] || { icon:'💰', label:m, desc:'' }
                    return (
                      <div key={m} style={{ display:'flex', alignItems:'flex-start', gap:'0.85rem', background:'var(--bg-light)', borderRadius:'var(--radius-md)', padding:'1rem' }}>
                        <span style={{ fontSize:'1.5rem', flexShrink:0 }}>{info.icon}</span>
                        <div>
                          <strong style={{ display:'block', fontSize:'0.92rem', color:'var(--bleu-nuit)' }}>{info.label}</strong>
                          <span style={{ fontSize:'0.82rem', color:'var(--text-muted)' }}>{info.desc}</span>
                          {m === 'virement' && activity.virement_info && (
                            <pre style={{ marginTop:'0.5rem', fontSize:'0.8rem', background:'#fff', borderRadius:8, padding:'0.6rem', whiteSpace:'pre-wrap', color:'var(--text-dark)', border:'1px solid #dde8e1' }}>{activity.virement_info}</pre>
                          )}
                          {m === 'cesu' && activity.cesu_info && (
                            <p style={{ marginTop:'0.5rem', fontSize:'0.82rem', color:'var(--text-dark)' }}>{activity.cesu_info}</p>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar inscription */}
          <div className="activity-sidebar">
            <div className="activity-register-card">
              <div className="activity-register-card__price">
                <span className="activity-register-card__price-num">{parseFloat(activity.prix).toFixed(2)}€</span>
                <span>par enfant</span>
              </div>

              {isFull ? (
                <div className="activity-full-badge">🚫 Activité complète</div>
              ) : regStatus === 'success' ? (
                <div className="activity-success-msg">
                  <span>🎉</span>
                  <p>{regMsg}</p>
                  <Link to="/dashboard" className="btn-primary" style={{ textDecoration:'none', textAlign:'center' }}>
                    Voir mes inscriptions
                  </Link>
                </div>
              ) : (
                <>
                  {user ? (
                    <>
                      {children.length === 0 ? (
                        <div style={{ marginBottom:'1rem' }}>
                          <p style={{ fontSize:'0.88rem', color:'var(--text-muted)', marginBottom:'0.75rem' }}>
                            Ajoutez d'abord un enfant à votre espace.
                          </p>
                          <Link to="/dashboard" className="btn-secondary" style={{ textDecoration:'none', display:'block', textAlign:'center' }}>
                            Gérer mes enfants →
                          </Link>
                        </div>
                      ) : (
                        <>
                          {/* Sélecteur enfant */}
                          <div className="form-group" style={{ marginBottom:'1rem' }}>
                            <label>Inscrire quel enfant ?</label>
                            <select value={childId} onChange={e => { setChildId(e.target.value); setPayMode('normal') }}>
                              {children.map(c => (
                                <option key={c.id} value={c.id}>{c.prenom} {c.nom}</option>
                              ))}
                            </select>
                          </div>

                          {/* Choix mode de paiement */}
                          <div style={{ marginBottom:'1rem' }}>
                            <label style={{ fontSize:'0.8rem', fontWeight:700, color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.5px', display:'block', marginBottom:'0.5rem' }}>
                              Mode de paiement
                            </label>
                            <div style={{ display:'flex', flexDirection:'column', gap:'0.5rem' }}>
                              {/* Paiement normal */}
                              <button
                                type="button"
                                onClick={() => setPayMode('normal')}
                                style={{
                                  display:'flex', alignItems:'center', gap:'0.65rem',
                                  padding:'0.7rem 0.9rem', borderRadius:'var(--radius-md)',
                                  border: `2px solid ${payMode === 'normal' ? 'var(--vert-clair)' : '#dde8e1'}`,
                                  background: payMode === 'normal' ? '#e8f5ed' : 'var(--blanc)',
                                  cursor:'pointer', textAlign:'left', width:'100%',
                                  transition:'all 0.18s',
                                }}
                              >
                                <span style={{ fontSize:'1.2rem' }}>💶</span>
                                <div>
                                  <div style={{ fontWeight:700, fontSize:'0.88rem', color:'var(--bleu-nuit)' }}>
                                    Paiement normal
                                  </div>
                                  <div style={{ fontSize:'0.75rem', color:'var(--text-muted)' }}>
                                    {parseFloat(activity.prix).toFixed(2)}€
                                  </div>
                                </div>
                              </button>

                              {/* Paiement par points */}
                              <button
                                type="button"
                                onClick={() => setPayMode('points')}
                                style={{
                                  display:'flex', alignItems:'center', gap:'0.65rem',
                                  padding:'0.7rem 0.9rem', borderRadius:'var(--radius-md)',
                                  border: `2px solid ${payMode === 'points' ? 'var(--jaune)' : '#dde8e1'}`,
                                  background: payMode === 'points' ? '#fefce8' : 'var(--blanc)',
                                  cursor: canPayPts ? 'pointer' : 'not-allowed',
                                  textAlign:'left', width:'100%', opacity: canPayPts ? 1 : 0.6,
                                  transition:'all 0.18s',
                                }}
                              >
                                <span style={{ fontSize:'1.2rem' }}>🏆</span>
                                <div style={{ flex:1 }}>
                                  <div style={{ fontWeight:700, fontSize:'0.88rem', color:'var(--bleu-nuit)', display:'flex', justifyContent:'space-between' }}>
                                    <span>Payer avec des points</span>
                                    <span style={{ color: canPayPts ? 'var(--vert-foret)' : '#dc2626', fontFamily:"'Baloo 2',cursive" }}>
                                      {selPts} pts
                                    </span>
                                  </div>
                                  <div style={{ fontSize:'0.75rem', color:'var(--text-muted)' }}>
                                    {canPayPts
                                      ? `Gratuit · ${POINTS_FOR_FREE} pts déduits`
                                      : `${POINTS_FOR_FREE - selPts} pts manquants`
                                    }
                                  </div>
                                </div>
                              </button>
                            </div>
                          </div>

                          {regMsg && (
                            <p className={regStatus === 'error' ? 'auth-error' : 'profile-success'} style={{ marginBottom:'0.75rem', fontSize:'0.85rem' }}>
                              {regMsg}
                            </p>
                          )}
                          <button
                            className="btn-primary activity-register-btn"
                            onClick={handleRegister}
                            disabled={regStatus === 'loading'}
                            style={ payMode === 'points' ? { background:'linear-gradient(135deg,#f5c842,#f07d2a)', color:'var(--bleu-nuit)' } : {} }
                          >
                            {regStatus === 'loading'
                              ? '⏳ Inscription...'
                              : payMode === 'points'
                                ? `🏆 S'inscrire gratuitement (${POINTS_FOR_FREE} pts)`
                                : '🎿 S\'inscrire à cette activité'
                            }
                          </button>
                        </>
                      )}
                    </>
                  ) : (
                    <>
                      <p style={{ fontSize:'0.88rem', color:'var(--text-muted)', marginBottom:'1rem', lineHeight:1.6 }}>
                        Connectez-vous pour inscrire votre enfant à cette activité.
                      </p>
                      <Link to="/login" className="btn-primary" style={{ textDecoration:'none', display:'block', textAlign:'center', marginBottom:'0.5rem' }}>
                        Se connecter
                      </Link>
                      <Link to="/register" className="btn-secondary" style={{ textDecoration:'none', display:'block', textAlign:'center' }}>
                        Créer un compte
                      </Link>
                    </>
                  )}
                </>
              )}

              <div className="activity-register-card__footer">
                <span>🛡️ Encadrement certifié BAFA</span>
                <span>📩 Confirmation par email</span>
                <span>❌ Annulation possible</span>
              </div>
            </div>

            {/* Share */}
            <div className="activity-share">
              <h4>Partager</h4>
              <div className="activity-share__buttons">
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`}
                  target="_blank" rel="noreferrer"
                  className="activity-share__btn activity-share__btn--fb"
                >
                  Facebook
                </a>
                <button
                  className="activity-share__btn activity-share__btn--copy"
                  onClick={() => { navigator.clipboard.writeText(window.location.href); alert('Lien copié !') }}
                >
                  Copier le lien
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
