import { useState, useEffect } from 'react'
import axios from 'axios'
import './PointsTab.css'

const REASON_LABELS = {
  inscription:        { label: 'Inscription',         icon: '📝', color: '#dbeafe' },
  presence:           { label: 'Présence confirmée',  icon: '✅', color: '#dcfce7' },
  parrainage:         { label: 'Parrainage',          icon: '🤝', color: '#ede9fe' },
  bonus_animateur:    { label: 'Bonus animateur',     icon: '⭐', color: '#fef9c3' },
  echange_recompense: { label: 'Échange récompense',  icon: '🎁', color: '#fee2e2' },
}

// Récompenses disponibles
const REWARDS = [
  { id: 1, label: '☕ Goûter offert',          cost: 50,  desc: 'Un goûter lors de la prochaine sortie' },
  { id: 2, label: '🎿 1 journée offerte',       cost: 200, desc: 'Une journée d\'activité entièrement gratuite' },
  { id: 3, label: '👕 T-shirt CapAventure',    cost: 150, desc: 'Le t-shirt officiel CapAventure' },
  { id: 4, label: '🏅 Diplôme explorateur',    cost: 80,  desc: 'Diplôme personnalisé + photo souvenir' },
  { id: 5, label: '🎒 Pack équipement',        cost: 300, desc: 'Sac à dos + accessoires outdoor' },
]

export default function PointsTab({ children }) {
  const [data, setData]       = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)  // enfant sélectionné
  const [rewardModal, setRewardModal] = useState(null)
  const [redeeming, setRedeeming]     = useState(false)
  const [msg, setMsg]                 = useState('')

  useEffect(() => {
    axios.get('/api/points/mine')
      .then(r => {
        setData(r.data)
        if (r.data.length > 0) setSelected(r.data[0].child.id)
      })
      .finally(() => setLoading(false))
  }, [])

  const currentChild = data.find(d => d.child.id === selected)

  const handleRedeem = async (reward) => {
    if (!currentChild) return
    if (currentChild.total < reward.cost) {
      setMsg(`❌ Pas assez de points (${currentChild.total} pts / ${reward.cost} requis)`)
      return
    }
    setRedeeming(true)
    try {
      await axios.post('/api/points/redeem', {
        child_id: currentChild.child.id,
        cost: reward.cost,
        description: reward.label,
      })
      // Rafraîchir
      const r = await axios.get('/api/points/mine')
      setData(r.data)
      setRewardModal(null)
      setMsg(`✅ Récompense "${reward.label}" demandée ! L'animateur sera informé.`)
    } catch (e) {
      setMsg(e.response?.data?.message || 'Erreur lors de l\'échange.')
    } finally { setRedeeming(false) }
  }

  if (loading) return <div className="dash-empty">Chargement...</div>
  if (data.length === 0) return (
    <div className="dash-section">
      <h1>Mes points</h1>
      <div className="dash-empty">
        Ajoutez d'abord un enfant pour voir ses points.
      </div>
    </div>
  )

  return (
    <div className="dash-section">
      <div className="dash-section__header">
        <div>
          <h1>🏆 Mes points</h1>
          <p className="dash-section__sub">Points cumulés par vos enfants — échangeables contre des récompenses</p>
        </div>
      </div>

      {msg && (
        <div className="dash-msg" style={{ marginBottom:'1.5rem' }}>{msg}</div>
      )}

      {/* Sélecteur enfant */}
      {data.length > 1 && (
        <div className="pts-child-tabs">
          {data.map(d => (
            <button
              key={d.child.id}
              className={`pts-child-tab ${selected === d.child.id ? 'active' : ''}`}
              onClick={() => setSelected(d.child.id)}
            >
              <div className="pts-child-tab__avatar">{d.child.prenom[0]}</div>
              <span>{d.child.prenom}</span>
              <span className="pts-child-tab__pts">{d.total} pts</span>
            </button>
          ))}
        </div>
      )}

      {currentChild && (
        <>
          {/* Score card */}
          <div className="pts-score-card">
            <div className="pts-score-card__left">
              <div className="pts-score-card__avatar">{currentChild.child.prenom[0]}</div>
              <div>
                <h2>{currentChild.child.prenom} {currentChild.child.nom}</h2>
                <p>Continue comme ça pour débloquer des récompenses !</p>
              </div>
            </div>
            <div className="pts-score-card__right">
              <div className="pts-score-card__total">{currentChild.total}</div>
              <div className="pts-score-card__label">points</div>
            </div>
          </div>

          {/* Barre de progression vers la prochaine récompense */}
          {(() => {
            const next = REWARDS.filter(r => r.cost > currentChild.total)
              .sort((a, b) => a.cost - b.cost)[0]
            if (!next) return (
              <div className="pts-congrats">
                🎉 Bravo ! Vous avez assez de points pour toutes les récompenses !
              </div>
            )
            const pct = Math.min(100, Math.round((currentChild.total / next.cost) * 100))
            return (
              <div className="pts-progress-card">
                <div className="pts-progress-card__header">
                  <span>Prochaine récompense : <strong>{next.label}</strong></span>
                  <span>{currentChild.total} / {next.cost} pts</span>
                </div>
                <div className="pts-progress-bar">
                  <div className="pts-progress-bar__fill" style={{ width: `${pct}%` }} />
                </div>
                <p>{next.cost - currentChild.total} points manquants</p>
              </div>
            )
          })()}

          {/* Comment gagner des points */}
          <div className="pts-how-grid">
            <div className="pts-how-card">
              <span>📝</span>
              <strong>+10 pts</strong>
              <p>Par inscription</p>
            </div>
            <div className="pts-how-card">
              <span>✅</span>
              <strong>+20 pts</strong>
              <p>Présence confirmée</p>
            </div>
            <div className="pts-how-card">
              <span>🤝</span>
              <strong>+50 pts</strong>
              <p>Parrainage d'un ami</p>
            </div>
            <div className="pts-how-card">
              <span>⭐</span>
              <strong>Bonus</strong>
              <p>De l'animateur</p>
            </div>
          </div>

          {/* Récompenses */}
          <h3 className="pts-section-title">🎁 Récompenses disponibles</h3>
          <div className="pts-rewards-grid">
            {REWARDS.map(r => {
              const canRedeem = currentChild.total >= r.cost
              return (
                <div key={r.id} className={`pts-reward-card ${!canRedeem ? 'locked' : ''}`}>
                  <div className="pts-reward-card__icon">{r.label.split(' ')[0]}</div>
                  <div className="pts-reward-card__body">
                    <strong>{r.label.split(' ').slice(1).join(' ')}</strong>
                    <p>{r.desc}</p>
                    <div className="pts-reward-card__footer">
                      <span className="pts-reward-card__cost">🏆 {r.cost} pts</span>
                      <button
                        className={`pts-reward-card__btn ${canRedeem ? 'can' : 'cannot'}`}
                        onClick={() => canRedeem && setRewardModal(r)}
                        disabled={!canRedeem}
                      >
                        {canRedeem ? 'Échanger' : `Il manque ${r.cost - currentChild.total} pts`}
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Historique */}
          {currentChild.history.length > 0 && (
            <>
              <h3 className="pts-section-title">📋 Historique récent</h3>
              <div className="pts-history">
                {currentChild.history.map(h => {
                  const info = REASON_LABELS[h.reason] || { label: h.reason, icon: '•', color: '#f3f4f6' }
                  return (
                    <div key={h.id} className="pts-history-item">
                      <div className="pts-history-item__icon" style={{ background: info.color }}>
                        {info.icon}
                      </div>
                      <div className="pts-history-item__body">
                        <strong>{info.label}</strong>
                        <span>{h.description || '—'}</span>
                        <span className="pts-history-item__date">
                          {new Date(h.created_at).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                      <div className={`pts-history-item__pts ${h.points > 0 ? 'positive' : 'negative'}`}>
                        {h.points > 0 ? '+' : ''}{h.points} pts
                      </div>
                    </div>
                  )
                })}
              </div>
            </>
          )}
        </>
      )}

      {/* Modal confirmation échange */}
      {rewardModal && (
        <div className="dash-modal-overlay" onClick={() => setRewardModal(null)}>
          <div className="dash-modal" onClick={e => e.stopPropagation()}>
            <h3>🎁 Échanger des points</h3>
            <p style={{ margin:'0.75rem 0', color:'var(--text-muted)' }}>
              Vous allez échanger <strong>{rewardModal.cost} points</strong> contre :
            </p>
            <div style={{ background:'var(--bg-light)', borderRadius:'var(--radius-md)', padding:'1rem', marginBottom:'1.25rem' }}>
              <strong>{rewardModal.label}</strong>
              <p style={{ fontSize:'0.88rem', color:'var(--text-muted)', marginTop:'0.3rem' }}>{rewardModal.desc}</p>
            </div>
            <p style={{ fontSize:'0.85rem', color:'var(--text-muted)', marginBottom:'1.25rem' }}>
              Il restera <strong>{currentChild.total - rewardModal.cost} points</strong> après l'échange.
              L'animateur sera notifié de votre demande.
            </p>
            <div style={{ display:'flex', gap:'0.75rem' }}>
              <button className="btn-primary" onClick={() => handleRedeem(rewardModal)} disabled={redeeming}>
                {redeeming ? '...' : 'Confirmer l\'échange'}
              </button>
              <button className="btn-secondary" onClick={() => setRewardModal(null)}>Annuler</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
