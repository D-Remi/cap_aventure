import { useEffect, useRef, useState, useCallback } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import AdminLayout from '../../components/layout/AdminLayout'
import { img, P } from '../../data/photos'
import { TEL_AFFICHE } from '../../data/contact'
import { THEMES, HASHTAGS, COULEURS as C, FORMATS, MODELES } from './reseauxModeles'
import './AdminLegal.css'

const SITE = 'educetvous74.fr'
const PHOTOS = [
  ['foret', 'Adulte et enfant en forêt'], ['balade', 'Balade main dans la main'], ['blocs', 'Jeu de construction'],
  ['lecture', 'Lecture sur le canapé'], ['dessin', 'Dessin à table'], ['saut', 'Enfants qui sautent'],
  ['coloriage', 'Coloriage'], ['cubes', 'Cubes'], ['automne', 'Forêt en automne'], ['mains', 'Main d\'enfant'],
  ['lavaux', 'Léman et montagnes'], ['banc', 'Banc face au lac'], ['coucher', 'Coucher de soleil'],
  ['vapeur', 'Bateau CGN et jet d\'eau'], ['chillon', 'Léman fleuri'], ['chalet', 'Chalet sous la neige'],
]
const STATUTS = { idee: 'Idée', prete: 'Prête', programmee: 'Programmée', publiee: 'Publiée' }
const AUJ = new Date().toISOString().slice(0, 10)

// ── Dessin ─────────────────────────────────────────────────────────────
function lignes(ctx, texte, largeur) {
  const out = []
  String(texte || '').split('\n').forEach(par => {
    let l = ''
    par.split(' ').forEach(mot => {
      const essai = l ? `${l} ${mot}` : mot
      if (ctx.measureText(essai).width > largeur && l) { out.push(l); l = mot } else l = essai
    })
    out.push(l)
  })
  return out
}
function bloc(ctx, texte, x, y, largeur, taille, poids, police, couleur, interligne = 1.18, maxLignes = 99) {
  let t = taille, ls
  do { ctx.font = `${poids} ${t}px ${police}`; ls = lignes(ctx, texte, largeur); t -= 4 } while (ls.length > maxLignes && t > 24)
  ctx.fillStyle = couleur
  ls.forEach((l, i) => ctx.fillText(l, x, y + i * (t + 4) * interligne))
  return y + ls.length * (t + 4) * interligne
}
// Taille finale et hauteur d'un bloc de texte, sans le dessiner
function mesurer(ctx, texte, largeur, taille, poids, police, interligne = 1.18, maxLignes = 99) {
  let t = taille, ls
  do { ctx.font = `${poids} ${t}px ${police}`; ls = lignes(ctx, texte, largeur); t -= 4 } while (ls.length > maxLignes && t > 24)
  t += 4
  return { taille: t, hauteur: ls.length * (t + 4) * interligne }
}
function couvrir(ctx, image, w, h) {
  const r = Math.max(w / image.width, h / image.height)
  const iw = image.width * r, ih = image.height * r
  ctx.drawImage(image, (w - iw) / 2, (h - ih) / 2, iw, ih)
}
function pied(ctx, w, h, clair) {
  ctx.font = '600 30px Inter, sans-serif'
  ctx.fillStyle = clair ? C.foret : 'rgba(255,255,255,.85)'
  ctx.fillText(`${SITE}  ·  ${TEL_AFFICHE}`, 80, h - 70)
  ctx.font = '700 36px Outfit, sans-serif'
  ctx.textAlign = 'right'
  ctx.fillStyle = clair ? C.foret : C.blanc
  ctx.fillText('Éduc', w - 80 - ctx.measureText(' & Vous').width, h - 68)
  ctx.fillStyle = clair ? C.vert : C.citron
  ctx.fillText(' & Vous', w - 80, h - 68)
  ctx.textAlign = 'left'
}
function surtitre(ctx, texte, x, y, couleur) {
  ctx.font = '700 28px Inter, sans-serif'
  ctx.fillStyle = couleur
  ctx.fillText(texte.toUpperCase().split('').join(String.fromCharCode(8202)), x, y)
}

function dessiner(ctx, { modele, format, titre, texte, image }) {
  const { w, h } = FORMATS[format]
  ctx.clearRect(0, 0, w, h)
  ctx.textBaseline = 'top'
  const fond = (c) => { ctx.fillStyle = c; ctx.fillRect(0, 0, w, h) }
  const cercles = (c) => {
    ctx.strokeStyle = c; ctx.lineWidth = 2
    ;[420, 560].forEach(r => { ctx.beginPath(); ctx.arc(w - 60, 120, r, 0, Math.PI * 2); ctx.stroke() })
  }

  if (modele === 'photo') {
    fond(C.foret)
    if (image) couvrir(ctx, image, w, h)
    const g = ctx.createLinearGradient(0, h * 0.35, 0, h)
    g.addColorStop(0, 'rgba(7,29,23,0)'); g.addColorStop(0.55, 'rgba(7,29,23,.78)'); g.addColorStop(1, 'rgba(7,29,23,.95)')
    ctx.fillStyle = g; ctx.fillRect(0, 0, w, h)
    // On empile depuis le bas : pied, texte, titre, surtitre
    let bas = h - 150
    if (texte) {
      const m = mesurer(ctx, texte, w - 160, 38, 400, 'Inter, sans-serif', 1.3, 5)
      bas -= m.hauteur
      bloc(ctx, texte, 80, bas, w - 160, m.taille, 400, 'Inter, sans-serif', 'rgba(255,255,255,.9)', 1.3, 5)
      bas -= 36
    }
    const mt = mesurer(ctx, titre, w - 160, 92, 700, 'Outfit, sans-serif', 1.05, 3)
    bas -= mt.hauteur
    bloc(ctx, titre, 80, bas, w - 160, mt.taille, 700, 'Outfit, sans-serif', C.blanc, 1.05, 3)
    surtitre(ctx, 'Éduc & Vous · Chablais', 80, bas - 60, C.citron)
    pied(ctx, w, h, false)
  }

  if (modele === 'citation') {
    fond(C.foret); cercles('rgba(200,241,105,.12)')
    ctx.font = '700 300px Outfit, sans-serif'; ctx.fillStyle = C.citron; ctx.fillText('“', 60, h * 0.12)
    const fin = bloc(ctx, titre, 80, h * 0.12 + 260, w - 160, 74, 600, 'Outfit, sans-serif', C.blanc, 1.12, 8)
    ctx.fillStyle = C.citron; ctx.fillRect(80, fin + 40, 60, 5)
    bloc(ctx, texte || 'Rémi, accompagnant éducatif', 160, fin + 22, w - 240, 34, 500, 'Inter, sans-serif', 'rgba(255,255,255,.8)')
    pied(ctx, w, h, false)
  }

  if (modele === 'prix') {
    fond(C.foret); cercles('rgba(200,241,105,.1)')
    surtitre(ctx, 'Le vrai prix d\'une garde', 80, h * 0.14, C.citron)
    bloc(ctx, titre || 'Un éducateur chez vous', 80, h * 0.14 + 60, w - 160, 70, 700, 'Outfit, sans-serif', C.blanc, 1.08, 3)
    const y = h * 0.48
    ctx.font = '600 120px Outfit, sans-serif'; ctx.fillStyle = 'rgba(255,255,255,.45)'; ctx.fillText('40 €', 80, y)
    const lw = ctx.measureText('40 €').width
    ctx.fillStyle = 'rgba(255,255,255,.6)'; ctx.fillRect(76, y + 64, lw + 8, 8)
    ctx.font = '700 240px Outfit, sans-serif'; ctx.fillStyle = C.citron; ctx.fillText('20 €', 80, y + 150)
    ctx.font = '500 46px Inter, sans-serif'; ctx.fillStyle = C.blanc
    ctx.fillText('de l\'heure pour vous', 90, y + 420)
    bloc(ctx, texte || 'Avec le crédit d\'impôt de 50 % déduit tout de suite (avance immédiate). Sous conditions, dans la limite des plafonds annuels.',
      90, y + 500, w - 180, 30, 400, 'Inter, sans-serif', 'rgba(255,255,255,.75)', 1.3, 4)
    pied(ctx, w, h, false)
  }

  if (modele === 'dispo') {
    fond(C.brume)
    ctx.fillStyle = C.citron; ctx.beginPath(); ctx.arc(w - 140, 200, 230, 0, Math.PI * 2); ctx.fill()
    surtitre(ctx, 'Garde à domicile · Chablais', 80, h * 0.1, C.vert)
    let y = bloc(ctx, titre || 'Créneaux disponibles', 80, h * 0.1 + 60, w - 300, 96, 700, 'Outfit, sans-serif', C.foret, 1.04, 3) + 60
    const items = String(texte || 'Mercredi après-midi\nSamedi matin\nFin de journée en semaine').split('\n').filter(Boolean).slice(0, 6)
    items.forEach(t => {
      ctx.fillStyle = C.blanc
      const hh = 110
      ctx.beginPath(); ctx.roundRect(80, y, w - 160, hh, 28); ctx.fill()
      ctx.fillStyle = C.vert; ctx.beginPath(); ctx.arc(140, y + hh / 2, 18, 0, Math.PI * 2); ctx.fill()
      ctx.font = '600 44px Inter, sans-serif'; ctx.fillStyle = C.foret; ctx.textBaseline = 'middle'
      ctx.fillText(t, 190, y + hh / 2); ctx.textBaseline = 'top'
      y += hh + 24
    })
    pied(ctx, w, h, true)
  }

  if (modele === 'conseil') {
    fond(C.blanc)
    ctx.fillStyle = C.foret; ctx.fillRect(0, 0, 36, h)
    ctx.fillStyle = C.citron; ctx.fillRect(0, 0, 36, h * 0.3)
    surtitre(ctx, 'Le conseil de Rémi', 110, h * 0.1, C.vert)
    const y = bloc(ctx, titre || 'Préparer une première garde', 110, h * 0.1 + 60, w - 200, 84, 700, 'Outfit, sans-serif', C.foret, 1.06, 4) + 50
    bloc(ctx, texte || '', 110, y, w - 200, 42, 400, 'Inter, sans-serif', '#34423D', 1.4, 14)
    pied(ctx, w, h, true)
  }
}

// ── Page ───────────────────────────────────────────────────────────────
export default function AdminReseaux() {
  const canvasRef = useRef(null)
  const [v, setV] = useState({ modele: 'photo', format: 'portrait', titre: 'Votre enfant a des besoins particuliers. Vous avez le droit de souffler.', texte: '', photo: 'foret' })
  const [image, setImage] = useState(null)
  const [theme, setTheme] = useState('presentation')
  const [version, setVersion] = useState(0)
  const [legende, setLegende] = useState('')
  const [pubs, setPubs] = useState([])
  const [datePub, setDatePub] = useState(AUJ)

  const set = (k, val) => setV(s => ({ ...s, [k]: val }))

  // Charge la photo choisie (Unsplash autorise l'utilisation sur les réseaux sociaux)
  useEffect(() => {
    if (!v.photo || v.photo === 'perso') return
    const im = new Image()
    im.crossOrigin = 'anonymous'
    im.onload = () => setImage(im)
    im.onerror = () => toast.error('Photo indisponible')
    im.src = img(P[v.photo], 1600)
  }, [v.photo])

  const redessiner = useCallback(async () => {
    const c = canvasRef.current
    if (!c) return
    const { w, h } = FORMATS[v.format]
    c.width = w; c.height = h
    try { await Promise.all([document.fonts.load('700 40px Outfit'), document.fonts.load('400 40px Inter'), document.fonts.load('600 40px Inter')]) } catch { /* polices système */ }
    dessiner(c.getContext('2d'), { ...v, image })
  }, [v, image])
  useEffect(() => { redessiner() }, [redessiner])

  // Légende
  const genererLegende = useCallback((t = theme, n = version) => {
    const th = THEMES[t]
    const base = th.versions[n % th.versions.length]
    const tags = th.hashtags.map(k => HASHTAGS[k]).join(' ')
    setLegende(`${base.replaceAll('{tel}', TEL_AFFICHE).replaceAll('{site}', SITE)}\n\n${tags}`)
  }, [theme, version])
  useEffect(() => { genererLegende() }, [genererLegende])

  const charger = () => axios.get('/api/marketing/publications').then(r => setPubs(r.data || [])).catch(() => {})
  useEffect(() => { charger() }, [])

  const choisirTheme = (t) => {
    setTheme(t); setVersion(0)
    set('titre', THEMES[t].titre)
    if (t === 'prix') set('modele', 'prix')
    if (t === 'disponibilites') set('modele', 'dispo')
    if (t === 'conseil') set('modele', 'conseil')
  }

  const photoPerso = (e) => {
    const f = e.target.files?.[0]
    if (!f) return
    const im = new Image()
    im.onload = () => { setImage(im); set('photo', 'perso') }
    im.src = URL.createObjectURL(f)
  }

  const blobImage = () => new Promise(res => canvasRef.current.toBlob(res, 'image/jpeg', 0.92))

  const telecharger = async () => {
    const b = await blobImage()
    const url = URL.createObjectURL(b)
    const a = document.createElement('a')
    a.href = url; a.download = `educetvous-${v.modele}-${AUJ}.jpg`; a.click()
    setTimeout(() => URL.revokeObjectURL(url), 2000)
  }

  const partager = async () => {
    const b = await blobImage()
    const f = new File([b], `educetvous-${AUJ}.jpg`, { type: 'image/jpeg' })
    try { await navigator.clipboard.writeText(legende) } catch { /* pas grave */ }
    if (navigator.canShare?.({ files: [f] })) {
      try { await navigator.share({ files: [f], text: legende }); return } catch { return }
    }
    toast('Partage direct disponible sur téléphone. Ici : télécharge l\'image, la légende est copiée.')
  }

  const copier = async () => {
    try { await navigator.clipboard.writeText(legende); toast.success('Légende copiée') }
    catch { toast.error('Copie impossible : sélectionne le texte à la main') }
  }

  const ajouterPlanning = async () => {
    try {
      await axios.post('/api/marketing/publications', { date: datePub, theme: THEMES[theme].label, titre: v.titre, legende, statut: 'prete', format: v.format === 'story' ? 'story' : 'post' })
      toast.success('Ajouté au planning'); charger()
    } catch { toast.error("Impossible d'ajouter (migration de la base faite ?)") }
  }

  const genererMois = async () => {
    const cles = ['presentation', 'conseil', 'repit', 'frontaliers', 'prix', 'disponibilites', 'conseil', 'repit', 'rentree', 'conseil', 'frontaliers', 'presentation']
    const jours = [2, 4, 0] // mardi, jeudi, dimanche
    const d = new Date(); let n = 0
    while (n < 12) {
      d.setDate(d.getDate() + 1)
      if (!jours.includes(d.getDay())) continue
      const t = THEMES[cles[n]]
      await axios.post('/api/marketing/publications', { date: d.toISOString().slice(0, 10), heure: d.getDay() === 0 ? '10:00' : '19:30', theme: t.label, titre: t.titre, statut: 'idee' }).catch(() => {})
      n++
    }
    toast.success('12 idées ajoutées sur 4 semaines'); charger()
  }

  const majPub = async (p, statut) => { await axios.put(`/api/marketing/publications/${p.id}`, { statut }); charger() }
  const supPub = async (p) => { await axios.delete(`/api/marketing/publications/${p.id}`); charger() }
  const reprendre = (p) => {
    const cle = Object.keys(THEMES).find(k => THEMES[k].label === p.theme)
    if (cle) setTheme(cle)
    if (p.titre) set('titre', p.titre)
    if (p.legende) setLegende(p.legende)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const aVenir = pubs.filter(p => p.date >= AUJ && p.statut !== 'publiee')

  return (
    <AdminLayout>
      <div className="admin-page">
        <div className="admin-page__header">
          <div>
            <h1>Réseaux sociaux</h1>
            <p className="admin-page__subtitle">Crée un visuel et sa légende en deux minutes, puis programme-les sur Instagram et Facebook en même temps.</p>
          </div>
        </div>

        <div className="al">
          <div className="al-alert al-alert--info">
            <b>Règle</b><span>Ne publie jamais la photo d'un enfant accompagné sans l'accord écrit de ses parents (droit à l'image). Les photos proposées ici sont des photos d'illustration libres de droits.</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.4rem', alignItems: 'start' }}>
            {/* Studio */}
            <section className="al-card">
              <h2>1. Le visuel</h2>
              <div className="al-grid">
                <label className="al-field"><span>Modèle</span>
                  <select value={v.modele} onChange={e => set('modele', e.target.value)}>
                    {Object.entries(MODELES).map(([k, l]) => <option key={k} value={k}>{l}</option>)}
                  </select>
                </label>
                <label className="al-field"><span>Format</span>
                  <select value={v.format} onChange={e => set('format', e.target.value)}>
                    {Object.entries(FORMATS).map(([k, f]) => <option key={k} value={k}>{f.label}</option>)}
                  </select>
                </label>
              </div>
              <label className="al-field"><span>Titre</span><textarea rows={2} value={v.titre} onChange={e => set('titre', e.target.value)} /></label>
              <label className="al-field"><span>{v.modele === 'dispo' ? 'Créneaux (un par ligne)' : v.modele === 'citation' ? 'Signature' : 'Texte'}</span>
                <textarea rows={3} value={v.texte} onChange={e => set('texte', e.target.value)} placeholder={v.modele === 'dispo' ? 'Mercredi après-midi\nSamedi matin' : ''} />
              </label>
              {v.modele === 'photo' && (
                <div className="al-grid">
                  <label className="al-field"><span>Photo</span>
                    <select value={v.photo} onChange={e => set('photo', e.target.value)}>
                      {PHOTOS.map(([k, l]) => <option key={k} value={k}>{l}</option>)}
                      {v.photo === 'perso' && <option value="perso">Ma photo</option>}
                    </select>
                  </label>
                  <label className="al-field"><span>Ou ta propre photo</span><input type="file" accept="image/*" onChange={photoPerso} /></label>
                </div>
              )}
              <canvas ref={canvasRef} style={{ width: '100%', height: 'auto', borderRadius: 14, boxShadow: '0 10px 30px -18px rgba(0,0,0,.5)', background: '#EEF4F1' }} />
              <div className="al-actions">
                <button className="btn-primary" onClick={telecharger}>Télécharger l'image</button>
                <button className="btn-secondary" onClick={partager}>Partager (téléphone)</button>
              </div>
            </section>

            {/* Légende */}
            <section className="al-card">
              <h2>2. La légende</h2>
              <div className="al-actions">
                {Object.entries(THEMES).map(([k, t]) => (
                  <button key={k} onClick={() => choisirTheme(k)} className={theme === k ? 'btn-primary' : 'btn-secondary'} style={{ padding: '.4rem .8rem', fontSize: '.82rem' }}>{t.label}</button>
                ))}
              </div>
              <label className="al-field"><span>Texte (modifiable)</span><textarea rows={14} value={legende} onChange={e => setLegende(e.target.value)} /></label>
              <div className="al-actions">
                <button className="btn-secondary" onClick={() => { const n = version + 1; setVersion(n); genererLegende(theme, n) }}>Autre version</button>
                <button className="btn-primary" onClick={copier}>Copier la légende</button>
              </div>
              <p className="al-sub">Pour publier sur Instagram et Facebook en même temps, et programmer à l'avance, utilise Meta Business Suite (gratuit) : colle la légende, ajoute l'image, choisis la date.</p>
              <div className="al-actions">
                <a className="btn-secondary" href="https://business.facebook.com/latest/composer" target="_blank" rel="noopener noreferrer">Ouvrir Meta Business Suite</a>
              </div>
              <h3>3. Ajouter au planning</h3>
              <div className="al-actions">
                <input type="date" value={datePub} onChange={e => setDatePub(e.target.value)} style={{ padding: '.5rem', border: '1.5px solid #DFE7E3', borderRadius: 10, fontFamily: 'inherit' }} />
                <button className="btn-primary" onClick={ajouterPlanning}>Ajouter</button>
              </div>
            </section>
          </div>

          {/* Planning */}
          <section className="al-card">
            <div className="al-actions" style={{ justifyContent: 'space-between' }}>
              <h2>Planning des publications</h2>
              <button className="btn-secondary" onClick={genererMois}>Proposer 4 semaines d'idées</button>
            </div>
            <p className="al-sub">Le rythme qui fonctionne : 2 à 3 publications par semaine, en soirée ou le dimanche matin, quand les parents ont un moment. Varie les sujets : conseils, coulisses, disponibilités, frontaliers.</p>
            <div className="al-table-wrap">
              <table className="al-table">
                <thead><tr><th>Date</th><th>Sujet</th><th>Titre</th><th>Statut</th><th /></tr></thead>
                <tbody>
                  {aVenir.length === 0 && <tr><td colSpan={5} className="al-sub">Rien de prévu. Clique sur « Proposer 4 semaines d'idées ».</td></tr>}
                  {aVenir.map(p => (
                    <tr key={p.id}>
                      <td>{new Date(p.date + 'T00:00:00').toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' })}{p.heure ? ` · ${p.heure}` : ''}</td>
                      <td>{p.theme || '-'}</td>
                      <td>{p.titre || '-'}</td>
                      <td>
                        <select value={p.statut} onChange={e => majPub(p, e.target.value)} style={{ padding: '.3rem', borderRadius: 8, border: '1px solid #DFE7E3', fontFamily: 'inherit' }}>
                          {Object.entries(STATUTS).map(([k, l]) => <option key={k} value={k}>{l}</option>)}
                        </select>
                      </td>
                      <td className="r">
                        <button className="btn-secondary" style={{ padding: '.3rem .7rem', fontSize: '.78rem' }} onClick={() => reprendre(p)}>Préparer</button>{' '}
                        <button className="btn-secondary" style={{ padding: '.3rem .7rem', fontSize: '.78rem' }} onClick={() => supPub(p)}>Retirer</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
    </AdminLayout>
  )
}
