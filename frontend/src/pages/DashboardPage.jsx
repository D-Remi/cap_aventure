import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import MessagingTab from '../components/ui/MessagingTab'
import ContratTab   from '../components/ui/ContratTab'
import PlanningTab       from '../components/ui/PlanningTab'
import PaiementTab      from '../components/ui/PaiementTab'
import MultiDateBooking from '../components/ui/MultiDateBooking'
import './DashboardPage.css'

export default function DashboardPage() {
  const { user } = useAuth()
  const [tab, setTab]           = useState('accueil')
  const [children, setChildren] = useState([])
  const [bookings, setBookings] = useState([])
  const [slots, setSlots]       = useState([])
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    Promise.all([
      axios.get('/api/children'),
      axios.get('/api/bookings/mine'),
      axios.get('/api/slots'),
    ]).then(([c, b, s]) => {
      setChildren(c.data)
      setBookings(b.data)
      setSlots(s.data)
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const TABS = [
    { id:'accueil',       label:'🏠 Accueil' },
    { id:'creneaux',      label:'📅 Réserver' },
    { id:'reservations',  label:'📋 Mes réservations' },
    { id:'enfants',       label:'👶 Mes enfants' },
    { id:'planning',      label:'🗓️ Planning' },
    { id:'paiements',     label:'💶 Paiements' },
    { id:'contrats',      label:'📄 Contrats' },
    { id:'documents',     label:'📁 Documents' },
    { id:'messages',      label:'💬 Messages' },
  ]

  return (
    <div className="dashboard">
      <div className="dashboard__sidebar">
        <div className="dashboard__user">
          <div className="dashboard__avatar">{user?.prenom?.[0]?.toUpperCase()}</div>
          <div>
            <div className="dashboard__name">{user?.prenom} {user?.nom}</div>
            <div className="dashboard__role">Espace parent</div>
          </div>
        </div>
        <nav className="dashboard__nav">
          {TABS.map(t => (
            <button key={t.id} className={`dashboard__nav-btn ${tab===t.id?'active':''}`} onClick={() => setTab(t.id)}>{t.label}</button>
          ))}
          <Link to="/" className="dashboard__nav-btn">← Retour au site</Link>
        </nav>
      </div>

      <div className="dashboard__content">

        {/* ACCUEIL */}
        {tab === 'accueil' && (
          <div className="dash-tab">
            <h2>Bonjour {user?.prenom} 👋</h2>
            <p className="dash-subtitle">Bienvenue dans votre espace CapAventure</p>
            <div className="dash-cards">
              <div className="dash-card" onClick={() => setTab('creneaux')}>
                <span>📅</span>
                <strong>Créneaux disponibles</strong>
                <p>{slots.filter(s => s.statut === 'ouvert').length} créneau{slots.filter(s => s.statut === 'ouvert').length > 1 ? 'x' : ''} disponible{slots.filter(s => s.statut === 'ouvert').length > 1 ? 's' : ''}</p>
              </div>
              <div className="dash-card" onClick={() => setTab('reservations')}>
                <span>📋</span>
                <strong>Mes réservations</strong>
                <p>{bookings.filter(b => b.status === 'confirmed').length} confirmée{bookings.filter(b => b.status === 'confirmed').length > 1 ? 's' : ''}</p>
              </div>
              <div className="dash-card" onClick={() => setTab('enfants')}>
                <span>👶</span>
                <strong>Mes enfants</strong>
                <p>{children.length} fiche{children.length > 1 ? 's' : ''} enregistrée{children.length > 1 ? 's' : ''}</p>
              </div>
              <div className="dash-card" onClick={() => setTab('paiements')}>
                <span>💶</span>
                <strong>Paiements</strong>
                <p>CESU, virement, suivi</p>
              </div>
              <div className="dash-card" onClick={() => setTab('contrats')}>
                <span>📄</span>
                <strong>Contrats répit</strong>
                <p>Lire et signer vos contrats</p>
              </div>
              <div className="dash-card" onClick={() => setTab('documents')}>
                <span>📁</span>
                <strong>Documents</strong>
                <p>Ordonnances, PAP, autorisations</p>
              </div>
              <div className="dash-card" onClick={() => setTab('messages')}>
                <span>💬</span>
                <strong>Messages</strong>
                <p>Contacter l'animateur</p>
              </div>
            </div>
          </div>
        )}

        {/* CRÉNEAUX */}
        {tab === 'creneaux' && children.length > 0 && <MultiDateBooking children={children} isLoggedIn={true} onClose={() => setTab('accueil')} />}
        {tab === 'creneaux' && children.length === 0 && (
          <div className="dash-tab">
            <h2>📅 Créneaux disponibles</h2>
            <p className="dash-subtitle">Réservez une journée pour votre enfant</p>
            {loading ? <div className="dash-loading">Chargement...</div>
            : slots.length === 0 ? (
              <div className="dash-empty">
                <div>📭</div>
                <p>Aucun créneau disponible pour le moment.<br/>Revenez prochainement ou <a href="/#contact">contactez-nous</a>.</p>
              </div>
            ) : (
              <div className="slots-list">
                {slots.map(s => (
                  <div key={s.id} className={`slot-card ${s.statut === 'complet' ? 'slot-card--full' : ''}`}>
                    <div className="slot-card__date">
                      <strong>{new Date(s.date+'T00:00:00').toLocaleDateString('fr-FR', { weekday:'short', day:'numeric', month:'short' })}</strong>
                      <span>{s.periode === 'matin' ? '🌅 Matin' : s.periode === 'apres_midi' ? '☀️ Après-midi' : '📅 Journée'}</span>
                    </div>
                    <div className="slot-card__info">
                      <div className="slot-card__title">{s.titre || "Créneau d'accueil"}</div>
                      {s.description && <div className="slot-card__desc">{s.description}</div>}
                      <div className="slot-card__meta">
                        <span>🕐 {s.heure_debut?.slice(0,5)}–{s.heure_fin?.slice(0,5)}</span>
                        <span>👥 {s.places_prises}/{s.places_max} places</span>
                        {s.lieu && <span>📍 {s.lieu}</span>}
                        <span className={`slot-tag ${s.type_accueil === 'adapte' ? 'slot-tag--adapte' : ''}`}>
                          {s.type_accueil === 'adapte' ? '🌿 Accueil adapté' : s.type_accueil === 'mixte' ? '👥 Mixte' : '🏠 Standard'}
                        </span>
                      </div>
                    </div>
                    <div className="slot-card__right">
                      <div className="slot-card__price">{parseFloat(s.tarif).toFixed(0)}€</div>
                      {s.statut === 'ouvert' ? (
                        <ReserverBtn slot={s} children={children} onDone={() => axios.get('/api/bookings/mine').then(r => setBookings(r.data))} />
                      ) : (
                        <span className="slot-card__full">Complet</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* RÉSERVATIONS */}
        {tab === 'reservations' && (
          <div className="dash-tab">
            <h2>📋 Mes réservations</h2>
            {bookings.length === 0 ? (
              <div className="dash-empty">
                <div>📭</div>
                <p>Aucune réservation.<br/><button className="btn-primary" onClick={() => setTab('creneaux')}>Voir les créneaux</button></p>
              </div>
            ) : (
              <div className="slots-list">
                {bookings.map(b => (
                  <div key={b.id} className="slot-card">
                    <div className="slot-card__date">
                      <strong>{b.slot?.date ? new Date(b.slot.date+'T00:00:00').toLocaleDateString('fr-FR', { weekday:'short', day:'numeric', month:'short' }) : '—'}</strong>
                      <span className={`booking-status booking-status--${b.status}`}>
                        {b.status === 'confirmed' ? '✅ Confirmé' : b.status === 'pending' ? '⏳ En attente' : '❌ Annulé'}
                      </span>
                    </div>
                    <div className="slot-card__info">
                      <div className="slot-card__title">{b.slot?.titre || "Créneau d'accueil"}</div>
                      <div className="slot-card__meta">
                        <span>👶 {b.child?.prenom}</span>
                        <span>💶 {parseFloat(b.tarif_applique || 0).toFixed(0)}€</span>
                        <span>{b.formule}</span>
                      </div>
                      {b.compte_rendu && (
                        <div className="booking-cr">
                          <span>📝 Compte-rendu :</span> {b.compte_rendu}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ENFANTS */}
        {tab === 'enfants' && <EnfantsTab children={children} setChildren={setChildren} />}

        {/* PLANNING */}
        {tab === 'contrats'  && <div className="dash-tab"><h2>📄 Contrats répit</h2><p className="dash-subtitle">Consultez et signez vos contrats de répit.</p><ContratTab /></div>}
        {tab === 'documents' && <DocumentsTab />}
        {tab === 'planning' && <div className="dash-tab"><h2>🗓️ Planning</h2><PlanningTab /></div>}

        {/* MESSAGES */}
        {tab === 'messages' && <div className="dash-tab"><h2>💬 Messages</h2><MessagingTab /></div>}

      </div>
    </div>
  )
}

function ReserverBtn({ slot, children, onDone }) {
  const [open, setOpen]     = useState(false)
  const [childId, setChild] = useState('')
  const [sending, setSend]  = useState(false)

  const submit = async () => {
    if (!childId) return
    setSend(true)
    try {
      await axios.post('/api/bookings', { slot_id: slot.id, child_id: +childId, formule: slot.periode === 'journee' ? 'journee' : 'demi_journee', tarif_applique: slot.tarif })
      setOpen(false); onDone()
    } catch (e) {
      alert(e.response?.data?.message || 'Erreur lors de la réservation')
    } finally { setSend(false) }
  }

  if (!open) return <button className="btn-primary" onClick={() => setOpen(true)}>Réserver</button>

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:'.5rem' }}>
      <select value={childId} onChange={e => setChild(e.target.value)}
        style={{ padding:'.4rem', borderRadius:8, border:'1.5px solid var(--sable-dark)', fontFamily:'inherit', fontSize:'.85rem' }}>
        <option value="">Choisir un enfant</option>
        {children.map(c => <option key={c.id} value={c.id}>{c.prenom}</option>)}
      </select>
      <div style={{ display:'flex', gap:'.4rem' }}>
        <button className="btn-primary" onClick={submit} disabled={!childId || sending} style={{ fontSize:'.82rem', padding:'.4rem .9rem' }}>
          {sending ? '...' : 'Confirmer'}
        </button>
        <button onClick={() => setOpen(false)} style={{ background:'none', border:'none', cursor:'pointer', fontSize:'.82rem', color:'var(--text-muted)' }}>Annuler</button>
      </div>
    </div>
  )
}


function EnfantsTab({ children, setChildren }) {
  const [adding,       setAdding]       = useState(false)
  const [dossierChild, setDossierChild] = useState(null)   // enfant dont on complète le dossier
  const [saving,       setSaving]       = useState(false)

  // Formulaire étape 1
  const [form, setForm] = useState({
    prenom:'', nom:'', date_naissance:'', niveau_natation:'',
    infos_medicales:'', allergie:'', medecin_nom:'', medecin_telephone:'',
    contact_urgence_nom:'', contact_urgence_lien:'', contact_urgence_telephone:''
  })

  // Formulaire étape 2 — dossier complet
  const [dossier, setDossier] = useState({
    besoins_specifiques: false, type_besoin:'',
    niveau_autonomie:'total', mode_communication:'verbal',
    centres_interet:'', activites_aimees:'', activites_a_eviter:'',
    declencheurs_crise:'', signes_avant_crise:'',
    hypersensibilites:'', hyposensibilites:'',
    methodes_apaisement:'', protocole_urgence:'',
    consignes_communication:'',
    traitement_medicamenteux: false, details_traitement:'',
    autorisation_sortie: true, autorisation_photo: false,
    suivi_professionnel:'', infos_medicales:'',
  })

  const setF = k => e => setForm(f => ({...f, [k]: e.target.type==='checkbox' ? e.target.checked : e.target.value }))
  const setD = k => e => setDossier(d => ({...d, [k]: e.target.type==='checkbox' ? e.target.checked : e.target.value }))

  const saveStep1 = async e => {
    e.preventDefault()
    if (!form.prenom || !form.nom || !form.date_naissance) return alert('Prénom, nom et date de naissance requis')
    setSaving(true)
    try {
      const { data } = await axios.post('/api/children', form)
      setChildren(c => [...c, data])
      setAdding(false)
      setForm({ prenom:'', nom:'', date_naissance:'', niveau_natation:'', infos_medicales:'', allergie:'', medecin_nom:'', medecin_telephone:'', contact_urgence_nom:'', contact_urgence_lien:'', contact_urgence_telephone:'' })
    } catch { alert('Erreur') } finally { setSaving(false) }
  }

  const openDossier = (c) => {
    setDossierChild(c)
    setDossier({
      besoins_specifiques: c.besoins_specifiques || false,
      type_besoin: c.type_besoin || '',
      niveau_autonomie: c.niveau_autonomie || 'total',
      mode_communication: c.mode_communication || 'verbal',
      centres_interet: c.centres_interet || '',
      activites_aimees: c.activites_aimees || '',
      activites_a_eviter: c.activites_a_eviter || '',
      declencheurs_crise: c.declencheurs_crise || '',
      signes_avant_crise: c.signes_avant_crise || '',
      hypersensibilites: c.hypersensibilites || '',
      hyposensibilites: c.hyposensibilites || '',
      methodes_apaisement: c.methodes_apaisement || '',
      protocole_urgence: c.protocole_urgence || '',
      consignes_communication: c.consignes_communication || '',
      traitement_medicamenteux: c.traitement_medicamenteux || false,
      details_traitement: c.details_traitement || '',
      autorisation_sortie: c.autorisation_sortie !== false,
      autorisation_photo: c.autorisation_photo || false,
      suivi_professionnel: c.suivi_professionnel || '',
      infos_medicales: c.infos_medicales || '',
    })
  }

  const saveDossier = async e => {
    e.preventDefault()
    setSaving(true)
    try {
      const { data } = await axios.put(`/api/children/${dossierChild.id}/step2`, dossier)
      setChildren(c => c.map(x => x.id === dossierChild.id ? data : x))
      setDossierChild(null)
    } catch { alert('Erreur lors de la sauvegarde') } finally { setSaving(false) }
  }

  const fi = (label, key, type='text', setter=setD) => (
    <div className="form-group" style={{marginBottom:'.75rem'}}>
      <label>{label}</label>
      <input type={type} value={dossier[key]} onChange={setter(key)}/>
    </div>
  )
  const ta = (label, key) => (
    <div className="form-group" style={{marginBottom:'.75rem'}}>
      <label>{label}</label>
      <textarea rows={3} value={dossier[key]} onChange={setD(key)}/>
    </div>
  )
  const sel = (label, key, opts) => (
    <div className="form-group" style={{marginBottom:'.75rem'}}>
      <label>{label}</label>
      <select value={dossier[key]} onChange={setD(key)}>
        {opts.map(([v,l]) => <option key={v} value={v}>{l}</option>)}
      </select>
    </div>
  )

  // ── Vue dossier complet ──
  if (dossierChild) return (
    <div className="dash-tab">
      <div style={{display:'flex',alignItems:'center',gap:'.75rem',marginBottom:'1.5rem'}}>
        <button onClick={() => setDossierChild(null)} style={{background:'none',border:'none',cursor:'pointer',color:'var(--text-muted)',fontSize:'1rem'}}>← Retour</button>
        <h2 style={{margin:0}}>🌿 Dossier de {dossierChild.prenom}</h2>
      </div>
      <form onSubmit={saveDossier}>

        <div className="child-form" style={{marginBottom:'1rem'}}>
          <div className="child-form__section">Profil général</div>
          <div className="child-form__row">
            <div className="form-group">
              <label>Besoins spécifiques ?</label>
              <label style={{display:'flex',alignItems:'center',gap:'.6rem',marginTop:'.4rem',fontWeight:600,fontSize:'.9rem',color:'var(--nuit)'}}>
                <input type="checkbox" checked={dossier.besoins_specifiques} onChange={setD('besoins_specifiques')} style={{width:16,height:16,accentColor:'var(--sauge)'}}/>
                Oui, cet enfant a des besoins spécifiques
              </label>
            </div>
            {dossier.besoins_specifiques && (
              <div className="form-group">
                <label>Type de besoin</label>
                <input value={dossier.type_besoin} onChange={setD('type_besoin')} placeholder="TSA, TDAH, Trouble comportement..."/>
              </div>
            )}
          </div>
          {sel("Niveau d'autonomie", 'niveau_autonomie', [['total','Autonome'],['partiel','Partiellement autonome'],['accompagne','Accompagnement permanent']])}
          {sel('Mode de communication', 'mode_communication', [['verbal','Verbal'],['pictogrammes','Pictogrammes'],['mixte','Mixte verbal + pictogrammes'],['lsf','Langue des signes (LSF)'],['autre','Autre']])}
          {dossier.mode_communication !== 'verbal' && ta('Consignes de communication', 'consignes_communication')}
        </div>

        <div className="child-form" style={{marginBottom:'1rem'}}>
          <div className="child-form__section">❤️ Centres d'intérêt & activités</div>
          {ta("Centres d'intérêt & canaux d'attention", 'centres_interet')}
          {ta('Activités appréciées', 'activites_aimees')}
          {ta('Activités à éviter', 'activites_a_eviter')}
        </div>

        <div className="child-form" style={{marginBottom:'1rem'}}>
          <div className="child-form__section">⚠️ Facteurs déclencheurs de crise</div>
          {ta('Facteurs déclencheurs (bruits, transitions, frustration...)', 'declencheurs_crise')}
          {ta('Signaux précoces observables (avant la crise)', 'signes_avant_crise')}
        </div>

        <div className="child-form" style={{marginBottom:'1rem'}}>
          <div className="child-form__section">🔔 Hypersensibilités sensorielles</div>
          {ta('Hypersensibilités (sons, textures, lumière, foule...)', 'hypersensibilites')}
          {ta('Hyposensibilités (manque de sensibilité à la douleur...)', 'hyposensibilites')}
        </div>

        <div className="child-form" style={{marginBottom:'1rem'}}>
          <div className="child-form__section">✅ Protocole d'apaisement</div>
          {ta("Méthodes d'apaisement validées", 'methodes_apaisement')}
          {ta("Protocole d'urgence (que faire / ne pas faire en cas de crise grave)", 'protocole_urgence')}
        </div>

        <div className="child-form" style={{marginBottom:'1rem'}}>
          <div className="child-form__section">💊 Santé & Suivi</div>
          <label style={{display:'flex',alignItems:'center',gap:'.6rem',marginBottom:'.75rem',fontWeight:600,fontSize:'.9rem',color:'var(--nuit)'}}>
            <input type="checkbox" checked={dossier.traitement_medicamenteux} onChange={setD('traitement_medicamenteux')} style={{width:16,height:16,accentColor:'var(--sauge)'}}/>
            Traitement médicamenteux en cours
          </label>
          {dossier.traitement_medicamenteux && ta('Détails du traitement (médicament, dosage, horaire)', 'details_traitement')}
          {ta('Infos médicales complémentaires', 'infos_medicales')}
          {ta('Suivi professionnel (psychologue, orthophoniste, AESH, MDPH...)', 'suivi_professionnel')}
        </div>

        <div className="child-form" style={{marginBottom:'1.5rem'}}>
          <div className="child-form__section">✅ Autorisations</div>
          <div style={{display:'flex',flexDirection:'column',gap:'.65rem'}}>
            <label style={{display:'flex',alignItems:'center',gap:'.6rem',fontWeight:600,fontSize:'.9rem',color:'var(--nuit)'}}>
              <input type="checkbox" checked={dossier.autorisation_sortie} onChange={setD('autorisation_sortie')} style={{width:16,height:16,accentColor:'var(--sauge)'}}/>
              ✅ Autorisé(e) à quitter le domicile pour les sorties
            </label>
            <label style={{display:'flex',alignItems:'center',gap:'.6rem',fontWeight:600,fontSize:'.9rem',color:'var(--nuit)'}}>
              <input type="checkbox" checked={dossier.autorisation_photo} onChange={setD('autorisation_photo')} style={{width:16,height:16,accentColor:'var(--sauge)'}}/>
              📷 Autorisation de prise de photo
            </label>
          </div>
        </div>

        <div style={{display:'flex',gap:'.75rem'}}>
          <button type="button" className="btn-secondary" onClick={() => setDossierChild(null)}>Annuler</button>
          <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Enregistrement...' : '✅ Enregistrer le dossier'}</button>
        </div>
      </form>
    </div>
  )

  return (
    <div className="dash-tab">
      <h2>👶 Mes enfants</h2>
      <div className="children-list">
        {children.map(c => (
          <div key={c.id} className="child-card">
            <div className="child-card__avatar">{c.prenom?.[0]}</div>
            <div className="child-card__info" style={{flex:1}}>
              <strong>{c.prenom} {c.nom}</strong>
              {c.date_naissance && <span>{Math.floor((Date.now()-new Date(c.date_naissance))/(365.25*86400000))} ans</span>}
              <div style={{display:'flex',gap:'.4rem',flexWrap:'wrap',marginTop:'.2rem'}}>
                {c.besoins_specifiques && <span className="child-badge">🌿 {c.type_besoin || 'Besoins spécifiques'}</span>}
                {!c.dossier_complete && <span className="child-badge child-badge--warn">⚠️ Dossier incomplet</span>}
                {c.dossier_complete && <span className="child-badge" style={{background:'#e8f5e9',color:'#2e7d32'}}>✅ Dossier complet</span>}
              </div>
            </div>
            <button className="btn-secondary" onClick={() => openDossier(c)} style={{fontSize:'.82rem',padding:'.38rem .9rem',flexShrink:0}}>
              {c.dossier_complete ? '✏️ Modifier' : '📋 Compléter le dossier'}
            </button>
          </div>
        ))}

        {!adding ? (
          <button className="btn-secondary" onClick={() => setAdding(true)}>+ Ajouter un enfant</button>
        ) : (
          <form onSubmit={saveStep1} className="child-form">
            <h3>🧒 Nouveau profil enfant</h3>
            <div className="child-form__section">IDENTITÉ</div>
            <div className="child-form__row">
              <div className="form-group"><label>Prénom *</label><input value={form.prenom} onChange={setF('prenom')} placeholder="Prénom"/></div>
              <div className="form-group"><label>Nom *</label><input value={form.nom} onChange={setF('nom')} placeholder="Nom"/></div>
            </div>
            <div className="child-form__row">
              <div className="form-group"><label>Date de naissance *</label><input type="date" value={form.date_naissance} onChange={setF('date_naissance')}/></div>
              <div className="form-group"><label>Niveau natation</label>
                <select value={form.niveau_natation} onChange={setF('niveau_natation')}>
                  <option value="">—</option>
                  <option>Non nageur</option>
                  <option>Aisance Aquatique (Test OK)</option>
                  <option>Nageur confirmé</option>
                </select>
              </div>
            </div>
            <div className="child-form__section">SANTÉ</div>
            <div className="form-group"><label>Infos médicales</label><textarea rows={2} value={form.infos_medicales} onChange={setF('infos_medicales')}/></div>
            <div className="form-group"><label>Allergie alimentaire</label><input value={form.allergie} onChange={setF('allergie')} placeholder="Aucune"/></div>
            <div className="child-form__row">
              <div className="form-group"><label>Médecin traitant</label><input value={form.medecin_nom} onChange={setF('medecin_nom')}/></div>
              <div className="form-group"><label>Tél. médecin</label><input value={form.medecin_telephone} onChange={setF('medecin_telephone')}/></div>
            </div>
            <div className="child-form__section">CONTACT D'URGENCE</div>
            <div className="child-form__row">
              <div className="form-group"><label>Nom</label><input value={form.contact_urgence_nom} onChange={setF('contact_urgence_nom')}/></div>
              <div className="form-group"><label>Lien</label><input value={form.contact_urgence_lien} onChange={setF('contact_urgence_lien')} placeholder="Maman, Papa..."/></div>
            </div>
            <div className="form-group"><label>Téléphone d'urgence</label><input value={form.contact_urgence_telephone} onChange={setF('contact_urgence_telephone')}/></div>
            <div style={{display:'flex',gap:'.75rem',marginTop:'1rem'}}>
              <button type="button" className="btn-secondary" onClick={() => setAdding(false)}>Annuler</button>
              <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Enregistrement...' : 'Enregistrer'}</button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

function DocumentsTab() {
  const { user }                = useAuth()
  const [docs,     setDocs]     = useState([])
  const [children, setChildren] = useState([])
  const [loading,  setLoading]  = useState(true)
  const [uploading,setUploading]= useState(false)
  const [viewing,  setViewing]  = useState(null)
  const [form,     setForm]     = useState({ child_id:'', type:'autre' })
  const fileRef = useRef(null)

  useEffect(() => {
    Promise.all([
      axios.get('/api/documents'),
      axios.get('/api/children'),
    ]).then(([d,c]) => { setDocs(d.data); setChildren(c.data) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const TYPE_LABEL = {
    ordonnance:         '💊 Ordonnance',
    pap:                '📋 PAP / PPS',
    mdph:               '🏛️ MDPH',
    autorisation_sortie:'✅ Autorisation sortie',
    autorisation_photo: '📷 Autorisation photo',
    autre:              '📄 Autre document',
  }

  const upload = (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (file.size > 10 * 1024 * 1024) { alert('Fichier trop lourd (max 10 Mo)'); return }
    setUploading(true)
    const reader = new FileReader()
    reader.onload = async () => {
      try {
        const { data } = await axios.post('/api/documents/upload', {
          child_id: form.child_id ? +form.child_id : undefined,
          type:     form.type,
          filename: file.name,
          nom:      file.name,
          mimetype: file.type,
          taille:   file.size,
          data:     reader.result,   // base64 complet avec préfixe data:...
        })
        setDocs(d => [data, ...d])
        fileRef.current.value = ''
        toast.success('Document envoyé ✅')
      } catch (err) {
        toast.error(err.response?.data?.message || "Erreur lors de l'envoi")
      } finally { setUploading(false) }
    }
    reader.onerror = () => { toast.error('Erreur de lecture'); setUploading(false) }
    reader.readAsDataURL(file)
  }

  const viewDoc = async (doc) => {
    try {
      const { data } = await axios.get(`/api/documents/${doc.id}/data`)
      setViewing(data)
    } catch { toast.error('Impossible de charger le document') }
  }

  const del = async (id) => {
    if (!window.confirm('Supprimer ce document ?')) return
    await axios.delete(`/api/documents/${id}`)
    setDocs(d => d.filter(x => x.id !== id))
    toast.success('Document supprimé')
  }

  if (loading) return <div style={{padding:'2rem',textAlign:'center',color:'var(--text-muted)'}}>Chargement…</div>

  return (
    <div className="dash-tab">
      <h2>📁 Mes documents</h2>
      <p className="dash-subtitle">Partagez vos documents avec l'animateur (ordonnances, PAP, autorisations…)</p>

      {/* Zone upload */}
      <div className="doc-upload-box">
        <div className="doc-upload-box__form">
          <div className="form-group">
            <label>Type de document</label>
            <select value={form.type} onChange={e => setForm(f=>({...f,type:e.target.value}))}>
              {Object.entries(TYPE_LABEL).map(([v,l]) => <option key={v} value={v}>{l}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Enfant concerné (optionnel)</label>
            <select value={form.child_id} onChange={e => setForm(f=>({...f,child_id:e.target.value}))}>
              <option value="">— Document général —</option>
              {children.map(c => <option key={c.id} value={c.id}>{c.prenom} {c.nom}</option>)}
            </select>
          </div>
        </div>
        <label className={`doc-upload-btn ${uploading?'doc-upload-btn--loading':''}`}>
          {uploading ? '⏳ Envoi en cours…' : '📤 Choisir un fichier à envoyer'}
          <input ref={fileRef} type="file" accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" onChange={upload} style={{display:'none'}} disabled={uploading}/>
        </label>
        <p className="doc-upload-hint">Formats acceptés : PDF, images, Word · Max 10 Mo · Stocké de façon sécurisée</p>
      </div>

      {/* Liste documents */}
      {docs.length === 0 ? (
        <div className="dash-empty">
          <div>📭</div>
          <p>Aucun document envoyé pour le moment.</p>
        </div>
      ) : (
        <div className="doc-list">
          {docs.map(d => (
            <div key={d.id} className="doc-item">
              <div className="doc-item__icon">
                {d.mimetype?.includes('image') ? '🖼️' : d.mimetype?.includes('pdf') ? '📕' : '📄'}
              </div>
              <div className="doc-item__info">
                <strong>{TYPE_LABEL[d.type] || '📄'} — {d.nom}</strong>
                <span>
                  {d.child ? `${d.child.prenom} ${d.child.nom} · ` : ''}
                  {new Date(d.created_at).toLocaleDateString('fr-FR')}
                  {d.taille ? ` · ${(d.taille/1024).toFixed(0)} Ko` : ''}
                </span>
                <span className={`doc-status ${d.valide===true?'doc-status--ok':d.valide===false?'doc-status--ko':'doc-status--wait'}`}>
                  {d.valide===true ? '✅ Validé par l\'animateur' : d.valide===false ? '❌ Refusé — '+( d.note_admin||'') : '⏳ En attente de vérification'}
                </span>
              </div>
              <div className="doc-item__actions">
                <button className="doc-btn doc-btn--view" onClick={() => viewDoc(d)} title="Visualiser">👁️</button>
                <button className="doc-btn doc-btn--del"  onClick={() => del(d.id)} title="Supprimer">🗑️</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal visualisation */}
      {viewing && (
        <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,.7)',zIndex:600,display:'flex',alignItems:'center',justifyContent:'center',padding:'1rem'}}
          onClick={() => setViewing(null)}>
          <div style={{background:'white',borderRadius:'var(--radius-xl)',overflow:'hidden',maxWidth:700,width:'100%',maxHeight:'90vh',display:'flex',flexDirection:'column'}}
            onClick={e => e.stopPropagation()}>
            <div style={{padding:'1rem 1.5rem',background:'var(--nuit)',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <span style={{color:'white',fontWeight:700,fontSize:'.95rem'}}>{viewing.nom}</span>
              <div style={{display:'flex',gap:'.5rem'}}>
                <a href={viewing.data} download={viewing.filename}
                  style={{background:'rgba(255,255,255,.15)',color:'white',padding:'.3rem .85rem',borderRadius:8,fontSize:'.82rem',fontWeight:700,textDecoration:'none'}}>
                  ⬇️ Télécharger
                </a>
                <button onClick={() => setViewing(null)}
                  style={{background:'rgba(255,255,255,.15)',border:'none',color:'white',width:30,height:30,borderRadius:'50%',cursor:'pointer',fontSize:'1rem',display:'flex',alignItems:'center',justifyContent:'center'}}>✕</button>
              </div>
            </div>
            <div style={{flex:1,overflow:'auto',padding:'1rem',textAlign:'center',background:'#f5f5f5'}}>
              {viewing.mimetype?.includes('image') ? (
                <img src={viewing.data} alt={viewing.nom} style={{maxWidth:'100%',maxHeight:'70vh',borderRadius:8,boxShadow:'0 4px 20px rgba(0,0,0,.15)'}}/>
              ) : viewing.mimetype?.includes('pdf') ? (
                <iframe src={viewing.data} title={viewing.nom} style={{width:'100%',height:'70vh',border:'none',borderRadius:8}}/>
              ) : (
                <div style={{padding:'3rem',color:'var(--text-muted)'}}>
                  <div style={{fontSize:'3rem',marginBottom:'1rem'}}>📄</div>
                  <p>Prévisualisation non disponible pour ce format.</p>
                  <a href={viewing.data} download={viewing.filename} className="btn-primary" style={{textDecoration:'none',marginTop:'1rem',display:'inline-flex'}}>
                    ⬇️ Télécharger le fichier
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}