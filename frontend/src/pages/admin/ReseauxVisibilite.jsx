import { useState } from 'react'
import toast from 'react-hot-toast'

// Où être présent sur Instagram et Facebook pour se faire connaître des familles du Chablais, de Genève et de Vaud.
// Les noms de groupes changent souvent : on ouvre une recherche Facebook plutôt que des liens figés.
const fb = (q) => `https://www.facebook.com/search/groups/?q=${encodeURIComponent(q)}`
const google = (q) => `https://www.google.com/search?q=${encodeURIComponent(q)}`
const tag = (t) => `https://www.instagram.com/explore/tags/${encodeURIComponent(t)}/`

const BIO = `Accompagnant éducatif · garde et répit à domicile
Enfants autistes, TDAH, handicap · Chablais · Genève · Vaud
👇 Premier appel gratuit
educetvous74.fr/rendez-vous`

const REPONSE_GROUPE = `Bonjour ! Je suis Rémi, accompagnant éducatif dans le Chablais. Je garde les enfants à domicile, y compris quand ils ont des besoins particuliers (autisme, TDAH, handicap). Je vous écris en message privé si vous le souhaitez 🙂`

const PROFIL = [
  { k: 'insta_pro', t: 'Instagram en compte professionnel', d: 'Paramètres > Type de compte et outils. Tu obtiens les statistiques et un bouton « Contacter » sur ton profil.' },
  { k: 'bio', t: 'Une bio claire avec le lien de réservation', d: 'Trois lignes : ce que tu fais, pour qui, où. Puis le lien de réservation.', copie: BIO },
  { k: 'page_fb', t: 'Une Page Facebook reliée à Instagram', d: 'Une Page (pas seulement ton profil personnel), reliée à Instagram dans Meta Business Suite : un seul post publié sur les deux.', lien: 'https://business.facebook.com/' },
  { k: 'google', t: 'Fiche Google Business Profile', d: 'Zone desservie (Chablais, Genève, Vaud), photos, lien /rendez-vous. Demande un avis à chaque famille satisfaite.', lien: 'https://www.google.com/business/' },
  { k: 'whatsapp', t: 'WhatsApp Business', d: "Message d'accueil automatique, horaires, et un catalogue avec tes formules et leurs prix." },
  { k: 'alaune', t: 'Stories à la une sur Instagram', d: 'Quatre bulles permanentes : Tarifs, Qui je suis, Suisse, Conseils. Les parents les regardent avant d\'écrire.' },
  { k: 'linkedin', t: 'Profil LinkedIn', d: 'Pour les professionnels de santé, les SESSAD et les structures suisses qui recrutent.', lien: 'https://www.linkedin.com/' },
]

const GROUPES = [
  { zone: 'Chablais', items: [['Parents Thonon', 'parents Thonon'], ['Mamans Thonon et Évian', 'mamans Thonon Evian'], ['Entraide Chablais', 'entraide Chablais'], ['Bons plans Chablais', 'bons plans Chablais'], ['Groupes de Thonon-les-Bains', 'Thonon-les-Bains'], ['Groupes d\'Évian-les-Bains', 'Evian-les-Bains'], ['Douvaine, Sciez, Bas-Chablais', 'Douvaine Sciez']] },
  { zone: 'Frontaliers', items: [['Frontaliers Genève Haute-Savoie', 'frontaliers Genève Haute-Savoie'], ['Frontaliers du Chablais', 'frontaliers Chablais'], ['Travailleurs frontaliers Suisse', 'travailleurs frontaliers Suisse']] },
  { zone: 'Autisme, TDAH, handicap', items: [['Autisme Haute-Savoie', 'autisme Haute-Savoie'], ['Parents d\'enfants autistes', 'parents enfants autistes'], ['Parents TDAH', 'parents TDAH'], ['Handicap enfant Haute-Savoie', 'parents enfant handicap Haute-Savoie'], ['Parents d\'enfants DYS', 'parents enfants dys']] },
  { zone: 'Genève et Vaud', items: [['Parents à Genève', 'parents Genève'], ['Mamans de Genève', 'mamans Genève'], ['Expatriés à Genève', 'expats Geneva'], ['Geneva moms', 'Geneva moms'], ['Parents à Nyon', 'parents Nyon'], ['Parents à Lausanne', 'parents Lausanne'], ['Riviera vaudoise', 'parents Vevey Montreux']] },
  { zone: 'Stations (vacances)', items: [['Châtel', 'Châtel location chalet'], ['Morzine Avoriaz', 'Morzine Avoriaz'], ['Les Gets', 'Les Gets'], ['Abondance', 'Abondance vallée']] },
]

const PAGES = [
  ['Groupement transfrontalier européen', 'La grande association des frontaliers : ses publications touchent des milliers de familles.'],
  ['HyperSupers TDAH France', 'Association de familles TDAH : commente utilement ses publications.'],
  ['Autisme France', 'Réseau national de familles : veille et partages.'],
  ['Autisme Suisse romande', 'Familles d\'enfants autistes à Genève et dans le canton de Vaud.'],
  ['insieme Genève', 'Familles de personnes avec une déficience intellectuelle.'],
  ['Pro Infirmis', 'Relève et soutien aux familles en Suisse.'],
  ['Adapei de la Haute-Savoie', 'Établissements et familles du département.'],
  ['MDPH Haute-Savoie', 'Informations pour les familles : à suivre pour rester à jour.'],
  ["Office de tourisme de Thonon-les-Bains", 'Publications très vues localement : commente, partage les événements familles.'],
  ["Office de tourisme d'Évian", 'Même principe, côté Évian et pays d\'Évian.'],
]

const HASHTAGS = ['thonon', 'evianlesbains', 'chablais', 'hautesavoie', 'lacleman', 'frontalier', 'geneve', 'lausanne', 'autisme', 'tdah', 'aidantfamilial', 'parentalite']

const REGLES = [
  "Lis le règlement de chaque groupe : beaucoup interdisent la publicité, sauf un jour dédié.",
  'Présente-toi une seule fois, avec un vrai conseil utile et une photo d\'illustration (jamais un enfant identifiable).',
  'Réponds vite aux messages « je cherche quelqu\'un pour garder mon enfant » avec la réponse type, puis continue en privé.',
  'Une publication promotionnelle par mois et par groupe au maximum.',
  "Commente utilement les posts des autres parents : c'est ce qui te rend visible, bien plus que la publicité.",
  "Ne parle jamais d'une famille que tu gardes, même sans nom.",
]

const ROUTINE = [
  ['5 min', 'Répondre aux messages et aux commentaires.'],
  ['5 min', 'Parcourir les groupes et répondre aux demandes de garde.'],
  ['5 min', "Commenter trois publications de comptes locaux (mairie, office de tourisme, association)."],
  ['1 fois par semaine', 'Préparer les publications de la semaine et noter le bilan des précédentes.'],
]

const CLE = 'ev-visibilite'
const lire = () => { try { return JSON.parse(localStorage.getItem(CLE)) || {} } catch { return {} } }

export default function ReseauxVisibilite() {
  const [fait, setFait] = useState(lire)
  const basculer = (k) => setFait(f => {
    const n = { ...f, [k]: !f[k] }
    try { localStorage.setItem(CLE, JSON.stringify(n)) } catch { /* navigation privée */ }
    return n
  })
  const copier = async (t) => {
    try { await navigator.clipboard.writeText(t); toast.success('Copié') } catch { toast.error('Copie impossible') }
  }
  const nbGroupes = GROUPES.reduce((n, g) => n + g.items.length, 0)
  const groupesRejoints = GROUPES.reduce((n, g) => n + g.items.filter(([, q]) => fait[`g:${q}`]).length, 0)
  const profilFait = PROFIL.filter(p => fait[p.k]).length

  const case_ = (k) => <input type="checkbox" checked={!!fait[k]} onChange={() => basculer(k)} style={{ width: 18, height: 18, accentColor: '#136F5B', flexShrink: 0 }} />

  return (
    <section className="al-card">
      <h2>Où être présent pour gagner en visibilité</h2>
      <p className="al-sub">Coche au fur et à mesure : ta progression est gardée sur cet ordinateur. Profil {profilFait}/{PROFIL.length} · groupes rejoints {groupesRejoints}/{nbGroupes}.</p>

      <h3>1. Des profils qui donnent envie d'écrire</h3>
      <div className="al-steps">
        {PROFIL.map(p => (
          <label key={p.k} className="al-step" style={{ gridTemplateColumns: '24px 1fr', cursor: 'pointer' }}>
            {case_(p.k)}
            <div>
              <b>{p.t}</b>
              <p>{p.d}</p>
              {p.copie && <><pre style={{ whiteSpace: 'pre-wrap', background: '#F4F8F6', borderRadius: 10, padding: '.6rem .8rem', fontFamily: 'inherit', margin: '.4rem 0' }}>{p.copie}</pre><button type="button" className="btn-secondary" style={{ padding: '.3rem .7rem', fontSize: '.78rem' }} onClick={e => { e.preventDefault(); copier(p.copie) }}>Copier la bio</button></>}
              {p.lien && <a href={p.lien} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}>Ouvrir</a>}
            </div>
          </label>
        ))}
      </div>

      <h3>2. Les groupes Facebook à rejoindre</h3>
      <p className="al-sub">Rejoins-les avec ton profil personnel (beaucoup de groupes n'acceptent pas les Pages). Chaque lien ouvre la recherche : choisis les groupes actifs, avec des publications récentes, et coche-les ici.</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '.8rem' }}>
        {GROUPES.map(g => (
          <div key={g.zone} style={{ background: '#F4F8F6', borderRadius: 12, padding: '.8rem .9rem' }}>
            <b>{g.zone}</b>
            <div style={{ display: 'grid', gap: '.35rem', marginTop: '.45rem' }}>
              {g.items.map(([l, q]) => (
                <div key={q} style={{ display: 'flex', gap: '.5rem', alignItems: 'center' }}>
                  {case_(`g:${q}`)}
                  <a href={fb(q)} target="_blank" rel="noopener noreferrer" style={{ fontSize: '.88rem' }}>{l}</a>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: '.8rem' }}>
        <span className="al-sub" style={{ fontWeight: 700 }}>Réponse type quand un parent cherche une garde :</span>
        <pre style={{ whiteSpace: 'pre-wrap', background: '#F4F8F6', borderRadius: 10, padding: '.6rem .8rem', fontFamily: 'inherit', margin: '.4rem 0' }}>{REPONSE_GROUPE}</pre>
        <button type="button" className="btn-secondary" style={{ padding: '.3rem .7rem', fontSize: '.78rem' }} onClick={() => copier(REPONSE_GROUPE)}>Copier la réponse</button>
      </div>

      <h3>3. Les pages à suivre et à commenter</h3>
      <p className="al-sub">Abonne-toi avec ta Page et ton profil, puis laisse des commentaires utiles sous leurs publications : leurs abonnés sont tes futurs clients.</p>
      <div className="al-steps">
        {PAGES.map(([nom, pourquoi]) => (
          <div key={nom} className="al-step" style={{ gridTemplateColumns: '24px 1fr' }}>
            {case_(`p:${nom}`)}
            <div><a href={google(`${nom} Facebook Instagram`)} target="_blank" rel="noopener noreferrer"><b>{nom}</b></a><p>{pourquoi}</p></div>
          </div>
        ))}
      </div>

      <h3>4. Instagram : les hashtags locaux à suivre</h3>
      <p className="al-sub">Suis-les pour voir passer les publications des parents et des acteurs locaux, et commente celles qui te concernent.</p>
      <div className="al-actions">
        {HASHTAGS.map(t => <a key={t} className="btn-secondary" style={{ padding: '.3rem .7rem', fontSize: '.8rem' }} href={tag(t)} target="_blank" rel="noopener noreferrer">#{t}</a>)}
      </div>

      <h3>5. Les règles pour ne pas être exclu des groupes</h3>
      <ul style={{ margin: 0, paddingLeft: '1.2rem', display: 'grid', gap: '.35rem' }}>
        {REGLES.map(r => <li key={r}>{r}</li>)}
      </ul>

      <h3>6. La routine de 15 minutes par jour</h3>
      <div className="al-steps">
        {ROUTINE.map(([duree, quoi]) => (
          <div key={quoi} className="al-step" style={{ gridTemplateColumns: '130px 1fr' }}><b>{duree}</b><p style={{ margin: 0 }}>{quoi}</p></div>
        ))}
      </div>
    </section>
  )
}
