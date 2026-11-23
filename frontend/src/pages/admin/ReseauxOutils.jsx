import { useState } from 'react'
import { CIBLES, noterPost } from './reseauxCibles'
import { choisirHashtags } from './reseauxModeles'

// ── Pour qui j'écris : client type, ce qui le convainc, accroches prêtes ──
export function CiblePost({ legende, setLegende }) {
  const [cle, setCle] = useState('parent')
  const c = CIBLES[cle]
  const accrocher = (a) => {
    const lignes = String(legende || '').split('\n')
    // Remplace la première ligne par l'accroche choisie, garde le reste
    setLegende([a, ...(lignes.length > 1 ? lignes.slice(1) : ['', ''])].join('\n'))
  }
  // Remplace les hashtags de la légende par les 5 de cette cible
  const mettreTags = () => {
    const sans = String(legende || '').replace(/(^|\s)#[\p{L}\p{N}_]+/gu, '').replace(/\n{3,}/g, '\n\n').trimEnd()
    setLegende(`${sans}\n\n${choisirHashtags(c.tags)}`)
  }
  return (
    <div style={{ background: '#F4F8F6', borderRadius: 12, padding: '.9rem 1rem', display: 'grid', gap: '.5rem' }}>
      <label className="al-field"><span>Pour qui j'écris</span>
        <select value={cle} onChange={e => setCle(e.target.value)}>
          {Object.entries(CIBLES).map(([k, x]) => <option key={k} value={k}>{x.label}</option>)}
        </select>
      </label>
      <p className="al-sub" style={{ margin: 0 }}><b>Qui :</b> {c.qui}</p>
      <p className="al-sub" style={{ margin: 0 }}><b>Ce qui l'inquiète :</b> {c.craintes}</p>
      <p className="al-sub" style={{ margin: 0 }}><b>Ce qui le convainc :</b> {c.convainc}</p>
      <p className="al-sub" style={{ margin: 0 }}><b>Où le trouver :</b> {c.ou} <b>Quand publier :</b> {c.quand}</p>
      <span className="al-sub" style={{ fontWeight: 700 }}>Accroches (clic = remplace la première ligne) :</span>
      <div className="al-actions">
        {c.accroches.map(a => (
          <button key={a} type="button" className="btn-secondary" style={{ padding: '.35rem .7rem', fontSize: '.78rem', textAlign: 'left' }} onClick={() => accrocher(a)}>{a}</button>
        ))}
      </div>
      <div className="al-actions"><button type="button" className="btn-secondary" style={{ padding: '.35rem .7rem', fontSize: '.78rem' }} onClick={mettreTags}>Mettre les 5 hashtags de cette cible</button></div>
    </div>
  )
}

// ── Note du post : ce qui fait cliquer et écrire les parents ──
export function NotePost({ legende }) {
  const { note, points, lien } = noterPost(legende)
  const couleur = note >= 80 ? '#136F5B' : note >= 60 ? '#B7791F' : '#B83A26'
  return (
    <div style={{ border: '1.5px solid #DFE7E3', borderRadius: 12, padding: '.9rem 1rem', display: 'grid', gap: '.45rem' }}>
      <div className="al-actions" style={{ justifyContent: 'space-between' }}>
        <b>Note du post</b>
        <b style={{ color: couleur, fontSize: '1.3rem' }}>{note} / 100</b>
      </div>
      {points.map(p => (
        <div key={p.texte} style={{ display: 'grid', gridTemplateColumns: '20px 1fr', gap: '.4rem', fontSize: '.85rem' }}>
          <span aria-hidden="true" style={{ color: p.ok ? '#136F5B' : '#B83A26', fontWeight: 700 }}>{p.ok ? '✓' : '!'}</span>
          <span><b>{p.texte}</b>{!p.ok && <><br /><span className="al-sub">{p.conseil}</span></>}</span>
        </div>
      ))}
      {lien && <p className="al-sub" style={{ margin: 0 }}>Sur Instagram, les liens dans la légende ne sont pas cliquables : écris plutôt « lien en bio » et mets {'educetvous74.fr/rendez-vous'} dans ta bio.</p>}
    </div>
  )
}

// ── Bilan des publications : ce qui marche vraiment ──
const JOURS = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi']
export function BilanPublications({ pubs, onMaj }) {
  const AUJ = new Date().toLocaleDateString('en-CA')
  const faites = pubs
    .filter(p => p.statut === 'publiee' || (p.date < AUJ && p.statut === 'programmee'))
    .sort((a, b) => b.date.localeCompare(a.date))
  const avecStats = faites.filter(p => p.vues || p.interactions || p.contacts)

  // Moyennes par sujet et par jour : engagement = interactions / vues
  const grouper = (cle) => {
    const g = {}
    avecStats.forEach(p => {
      const k = cle(p)
      g[k] = g[k] || { n: 0, vues: 0, inter: 0, contacts: 0 }
      g[k].n++; g[k].vues += p.vues || 0; g[k].inter += p.interactions || 0; g[k].contacts += p.contacts || 0
    })
    return Object.entries(g)
      .map(([k, x]) => ({ k, n: x.n, contacts: x.contacts, inter: Math.round(x.inter / x.n), taux: x.vues ? (x.inter / x.vues) * 100 : 0 }))
      .sort((a, b) => b.contacts - a.contacts || b.taux - a.taux)
  }
  const parSujet = grouper(p => p.theme || 'Sans sujet')
  const parJour = grouper(p => `${JOURS[new Date(`${p.date}T12:00:00`).getDay()]}${p.heure ? ` ${p.heure.slice(0, 2)} h` : ''}`)
  const champ = { width: 78, padding: '.3rem .4rem', borderRadius: 8, border: '1px solid #DFE7E3', fontFamily: 'inherit' }

  return (
    <section className="al-card">
      <h2>Bilan des publications</h2>
      <p className="al-sub">Deux ou trois jours après chaque post, note ses chiffres (Meta Business Suite &gt; Statistiques) : vues (couverture), interactions (j'aime, commentaires, partages, enregistrements) et contacts reçus grâce à lui. En quelques semaines, tu sauras quels sujets t'amènent des familles.</p>

      {avecStats.length >= 3 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
          {[['Les sujets qui marchent', parSujet], ['Les meilleurs moments', parJour]].map(([titre, liste]) => (
            <div key={titre} style={{ background: '#F4F8F6', borderRadius: 12, padding: '.9rem 1rem' }}>
              <b>{titre}</b>
              <ol style={{ margin: '.5rem 0 0', paddingLeft: '1.2rem', display: 'grid', gap: '.3rem', fontSize: '.88rem' }}>
                {liste.slice(0, 5).map(x => (
                  <li key={x.k}><b>{x.k}</b> · {x.contacts} contact{x.contacts > 1 ? 's' : ''} · {x.taux.toLocaleString('fr-FR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} % d'engagement · {x.n} post{x.n > 1 ? 's' : ''}</li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      )}
      {avecStats.length > 0 && avecStats.length < 3 && <p className="al-sub">Encore {3 - avecStats.length} bilan{3 - avecStats.length > 1 ? 's' : ''} à saisir pour voir ce qui marche le mieux.</p>}

      <div className="al-table-wrap">
        <table className="al-table">
          <thead><tr><th>Date</th><th>Sujet</th><th>Titre</th><th>Vues</th><th>Interactions</th><th>Contacts</th></tr></thead>
          <tbody>
            {faites.length === 0 && <tr><td colSpan={6} className="al-sub">Aucune publication passée. Passe tes posts en « Publiée » dans le planning une fois en ligne.</td></tr>}
            {faites.slice(0, 30).map(p => (
              <tr key={p.id}>
                <td>{new Date(`${p.date}T12:00:00`).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}</td>
                <td>{p.theme || '-'}</td>
                <td>{p.titre || '-'}</td>
                {['vues', 'interactions', 'contacts'].map(k => (
                  <td key={k}><input type="number" min={0} defaultValue={p[k] ?? ''} aria-label={`${k} de ${p.titre || 'la publication'}`} style={champ}
                    onBlur={e => { const val = e.target.value === '' ? null : Math.max(0, parseInt(e.target.value, 10) || 0); if (val !== (p[k] ?? null)) onMaj(p, { [k]: val }) }} /></td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
