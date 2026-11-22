import { useEffect, useState, useCallback } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import AdminLayout from '../../components/layout/AdminLayout'
import { CANTONS, METIERS, SITES_EMPLOI, STRUCTURES, lienOffres, RECHERCHES_FAMILLES_CH } from './radarSuisse'
import './AdminLegal.css'

const CANDIDATURE = 'Candidature Suisse'

const AUJ = new Date().toISOString().slice(0, 10)
const STATUTS = {
  a_contacter: 'À contacter', contacte: 'Contacté', rdv: 'Rendez-vous', partenaire: 'Partenaire', client: 'Client', sans_suite: 'Sans suite',
}
const TYPES = { prescripteur: 'Prescripteur', famille: 'Famille', association: 'Association', etablissement: 'Établissement', autre: 'Autre' }
const TYPE_PAR_CATEGORIE = { etablissements: 'etablissement', associations: 'association', creches: 'etablissement' }

// Recherches manuelles (sites sans API : on ne les aspire pas, on ouvre la recherche)
const RECHERCHES = [
  ['France Travail', "Annonces « garde d'enfants » en Haute-Savoie", 'https://candidat.francetravail.fr/offres/recherche?motsCles=garde+d%27enfants&lieux=74D'],
  ['Indeed', 'Garde d\'enfants autour de Thonon', 'https://fr.indeed.com/jobs?q=garde+d%27enfants&l=Thonon-les-Bains+%2874%29&radius=25'],
  ['Leboncoin', 'Annonces de parents « garde enfant »', 'https://www.leboncoin.fr/recherche?text=garde%20enfant%20Thonon'],
  ['Facebook', 'Groupes de parents du Chablais', 'https://www.facebook.com/search/groups/?q=parents%20Thonon%20Chablais'],
  ['Facebook', 'Groupes de frontaliers', 'https://www.facebook.com/search/groups/?q=frontaliers%20Chablais'],
  ['Google Maps', 'Orthophonistes et psychomotriciens autour de Thonon', 'https://www.google.com/maps/search/orthophoniste+psychomotricien+Thonon-les-Bains'],
]

const lien = (q) => `https://www.google.com/search?q=${encodeURIComponent(q)}`
const carte = (q) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`

export default function AdminRadar() {
  const [onglet, setOnglet] = useState('prescripteurs')
  const [config, setConfig] = useState(null)
  const [cat, setCat] = useState('reeducation')
  const [page, setPage] = useState(1)
  const [res, setRes] = useState(null)
  const [chargement, setChargement] = useState(false)
  const [offres, setOffres] = useState(null)
  const [q, setQ] = useState("garde d'enfants")
  const [prospects, setProspects] = useState([])
  const [filtre, setFiltre] = useState('actifs')
  const [ouvert, setOuvert] = useState(null)
  const [nouveau, setNouveau] = useState({ nom: '', type: 'famille', telephone: '', ville: '', source: 'Bouche-à-oreille' })
  const [canton, setCanton] = useState('GE')
  const [metier, setMetier] = useState(METIERS[0])
  const [cantonStructures, setCantonStructures] = useState('tous')

  const chargerProspects = () => axios.get('/api/marketing/prospects').then(r => setProspects(r.data || [])).catch(() => {})
  useEffect(() => {
    axios.get('/api/marketing/radar/config').then(r => setConfig(r.data)).catch(() => toast.error('Radar indisponible (migration de la base faite ?)'))
    chargerProspects()
  }, [])

  const chercher = useCallback(async (c = cat, p = page) => {
    setChargement(true)
    try { setRes((await axios.get(`/api/marketing/radar/entreprises?categorie=${c}&page=${p}`)).data) }
    catch (e) { toast.error(e?.response?.data?.message || 'Recherche impossible') }
    finally { setChargement(false) }
  }, [cat, page])
  useEffect(() => { if (onglet === 'prescripteurs') chercher() }, [onglet, chercher])

  const chercherOffres = async () => {
    setChargement(true)
    try { setOffres((await axios.get(`/api/marketing/radar/offres?q=${encodeURIComponent(q)}`)).data) }
    catch (e) { toast.error(e?.response?.data?.message || 'Recherche impossible') }
    finally { setChargement(false) }
  }
  useEffect(() => { if (onglet === 'annonces' && !offres) chercherOffres() }, [onglet]) // eslint-disable-line react-hooks/exhaustive-deps

  const dejaSuivi = (siret) => siret && prospects.some(p => p.siret === siret)
  const dejaCandidat = (nom) => prospects.some(p => p.categorie === CANDIDATURE && p.nom === nom)

  const ajouter = async (data) => {
    try {
      await axios.post('/api/marketing/prospects', data)
      toast.success('Ajouté à ton suivi'); chargerProspects()
    } catch { toast.error("Impossible d'ajouter") }
  }

  const maj = async (p, champs) => {
    setProspects(ps => ps.map(x => x.id === p.id ? { ...x, ...champs } : x))
    try { await axios.put(`/api/marketing/prospects/${p.id}`, champs) } catch { toast.error('Non enregistré') }
  }
  const supprimer = async (p) => { await axios.delete(`/api/marketing/prospects/${p.id}`); chargerProspects() }

  const relancesDues = prospects.filter(p => p.relance && p.relance <= AUJ && !['client', 'partenaire', 'sans_suite'].includes(p.statut))
  const visibles = prospects.filter(p =>
    filtre === 'tous' ? true :
    filtre === 'relances' ? relancesDues.includes(p) :
    filtre === 'candidatures' ? p.categorie === CANDIDATURE :
    filtre === 'actifs' ? p.statut !== 'sans_suite' : p.statut === filtre)
  const compte = (s) => prospects.filter(p => p.statut === s).length

  const catInfo = config?.categories.find(c => c.cle === cat)

  return (
    <AdminLayout>
      <div className="admin-page">
        <div className="admin-page__header">
          <div>
            <h1>Radar clients</h1>
            <p className="admin-page__subtitle">Trouve les professionnels qui peuvent t'envoyer des familles, repère les annonces de parents, et suis chaque contact jusqu'au premier rendez-vous.</p>
          </div>
        </div>

        <div className="al">
          <div className="al-actions">
            {[['prescripteurs', 'Prescripteurs'], ['annonces', 'Annonces de familles'], ['emplois', 'Emplois en Suisse'], ['suivi', `Mon suivi (${prospects.length})`]].map(([k, l]) => (
              <button key={k} className={onglet === k ? 'btn-primary' : 'btn-secondary'} onClick={() => setOnglet(k)}>{l}</button>
            ))}
            {relancesDues.length > 0 && <span className="al-pill al-pill--wait">{relancesDues.length} relance{relancesDues.length > 1 ? 's' : ''} à faire</span>}
          </div>

          {onglet === 'prescripteurs' && (
            <section className="al-card">
              <h2>Qui peut t'envoyer des familles ?</h2>
              <p className="al-sub">
                Données de l'annuaire officiel des entreprises (INSEE, via recherche-entreprises.api.gouv.fr), uniquement les établissements en activité.
                Le téléphone n'y figure pas : utilise « Trouver le contact ». Prospecter des professionnels est autorisé ; si quelqu'un ne souhaite pas être recontacté, passe-le en « Sans suite ».
              </p>
              <div className="al-actions">
                {config?.categories.map(c => (
                  <button key={c.cle} className={cat === c.cle ? 'btn-primary' : 'btn-secondary'} style={{ padding: '.4rem .8rem', fontSize: '.82rem' }}
                    onClick={() => { setCat(c.cle); setPage(1) }}>{c.label}</button>
                ))}
              </div>
              {catInfo && <div className="al-alert al-alert--info"><b>Pourquoi</b><span>{catInfo.aide} {catInfo.zone === 'chablais' ? 'Zone : Chablais et stations.' : 'Zone : toute la Haute-Savoie.'}</span></div>}
              {chargement && <p className="al-sub">Recherche…</p>}
              {res && !chargement && (
                <>
                  <p className="al-sub">{res.resultats.length} résultat{res.resultats.length > 1 ? 's' : ''} sur cette page · page {res.page} / {res.pages}</p>
                  <div className="al-table-wrap">
                    <table className="al-table">
                      <thead><tr><th>Nom</th><th>Adresse</th><th>Depuis</th><th /></tr></thead>
                      <tbody>
                        {res.resultats.length === 0 && <tr><td colSpan={4} className="al-sub">Aucun résultat dans la zone.</td></tr>}
                        {res.resultats.map(r => (
                          <tr key={r.siret}>
                            <td><b>{r.nom}</b>{r.raison_sociale && r.raison_sociale !== r.nom && <><br /><small className="al-sub">{r.raison_sociale}</small></>}{r.entrepreneur_individuel && <span className="al-pill al-pill--todo" style={{ marginLeft: 6 }}>Libéral</span>}</td>
                            <td>{r.adresse}</td>
                            <td>{r.date_creation ? new Date(r.date_creation).getFullYear() : '-'}</td>
                            <td className="r" style={{ whiteSpace: 'nowrap' }}>
                              <a href={lien(`${r.nom} ${r.ville} téléphone`)} target="_blank" rel="noopener noreferrer" style={{ color: '#136F5B', fontWeight: 600, fontSize: '.8rem', marginRight: 10 }}>Trouver le contact</a>
                              <a href={carte(`${r.nom} ${r.adresse}`)} target="_blank" rel="noopener noreferrer" style={{ color: '#136F5B', fontWeight: 600, fontSize: '.8rem', marginRight: 10 }}>Carte</a>
                              {dejaSuivi(r.siret)
                                ? <span className="al-pill al-pill--ok">Suivi</span>
                                : <button className="btn-secondary" style={{ padding: '.3rem .7rem', fontSize: '.78rem' }}
                                    onClick={() => ajouter({ type: TYPE_PAR_CATEGORIE[cat] || 'prescripteur', nom: r.nom, organisme: r.raison_sociale, categorie: catInfo?.label, siret: r.siret, adresse: r.adresse, code_postal: r.code_postal, ville: r.ville, source: 'Annuaire des entreprises' })}>
                                    Ajouter au suivi</button>}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="al-actions">
                    <button className="btn-secondary" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>Page précédente</button>
                    <button className="btn-secondary" disabled={page >= res.pages} onClick={() => setPage(p => p + 1)}>Page suivante</button>
                  </div>
                </>
              )}
            </section>
          )}

          {onglet === 'annonces' && (
            <section className="al-card">
              <h2>Des parents qui cherchent une garde</h2>
              {offres && !offres.configure && (
                <div className="al-alert al-alert--attention">
                  <b>À activer</b>
                  <span>
                    Pour voir ici les annonces de France Travail : crée un compte gratuit sur francetravail.io, déclare une application et abonne-la à l'API « Offres d'emploi ».
                    Ajoute ensuite dans <code>backend/.env</code> du serveur : <code>FT_CLIENT_ID=…</code> et <code>FT_CLIENT_SECRET=…</code>, puis redémarre l'API.
                    En attendant, utilise les recherches rapides ci-dessous.
                  </span>
                </div>
              )}
              {offres?.configure && (
                <>
                  <div className="al-actions">
                    <input value={q} onChange={e => setQ(e.target.value)} style={{ padding: '.55rem .7rem', border: '1.5px solid #DFE7E3', borderRadius: 10, fontFamily: 'inherit', minWidth: 240 }} />
                    <button className="btn-primary" onClick={chercherOffres}>Chercher en Haute-Savoie</button>
                  </div>
                  {chargement && <p className="al-sub">Recherche…</p>}
                  <div className="al-steps">
                    {offres.offres.length === 0 && !chargement && <p className="al-sub">Aucune annonce en ce moment.</p>}
                    {offres.offres.map(o => (
                      <div key={o.id} className="al-step" style={{ gridTemplateColumns: '1fr' }}>
                        <div>
                          <b>{o.intitule}</b>
                          <p>{o.lieu} · {o.employeur}{o.contrat ? ` · ${o.contrat}` : ''}{o.horaires ? ` · ${o.horaires}` : ''} · {o.date ? new Date(o.date).toLocaleDateString('fr-FR') : ''}</p>
                          {o.chablais && <span className="al-pill al-pill--ok">Chablais</span>}
                          <p>{o.description}…</p>
                          <div className="al-actions" style={{ marginTop: '.4rem' }}>
                            <a href={o.url} target="_blank" rel="noopener noreferrer">Voir l'annonce</a>
                            <button className="btn-secondary" style={{ padding: '.3rem .7rem', fontSize: '.78rem' }}
                              onClick={() => ajouter({ type: 'famille', nom: o.intitule, ville: o.lieu, source: 'France Travail', notes: `Annonce ${o.id} : ${o.url}` })}>Ajouter au suivi</button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
              <h3>Recherches rapides côté français</h3>
              <p className="al-sub">Ces sites n'ont pas d'accès automatique autorisé : le radar ouvre directement la bonne recherche. Réponds aux annonces par les moyens qu'elles indiquent.</p>
              <div className="al-steps">
                {RECHERCHES.map(([site, t, url]) => (
                  <a key={url} href={url} target="_blank" rel="noopener noreferrer" className="al-step" style={{ gridTemplateColumns: '1fr', textDecoration: 'none' }}>
                    <div><b>{site}</b><p>{t}</p></div>
                  </a>
                ))}
              </div>
              <h3>Familles qui habitent en Suisse</h3>
              <p className="al-sub">Gardes ponctuelles uniquement, déclarées sur easygov.swiss au moins 8 jours avant (90 jours par an au maximum). Pour une garde régulière, la famille t'emploie via Chèque service (Genève) ou Chèques-emploi (Vaud).</p>
              <div className="al-steps">
                {RECHERCHES_FAMILLES_CH.map(([site, t, url]) => (
                  <a key={url} href={url} target="_blank" rel="noopener noreferrer" className="al-step" style={{ gridTemplateColumns: '1fr', textDecoration: 'none' }}>
                    <div><b>{site}</b><p>{t}</p></div>
                  </a>
                ))}
              </div>
            </section>
          )}

          {onglet === 'emplois' && (
            <section className="al-card">
              <h2>Postuler en Suisse</h2>
              <p className="al-sub">
                Joins à chaque candidature le lien de ta page <a href="/structures" target="_blank" rel="noopener noreferrer">educetvous74.fr/structures</a> :
                elle présente ton profil aux employeurs suisses. Pour une veille automatique des offres, utilise aussi ton JobRadar Suisse.
              </p>

              <h3>1. Les offres d'emploi, recherches prêtes</h3>
              <div className="al-grid">
                <label className="al-field"><span>Métier</span>
                  <select value={metier} onChange={e => setMetier(e.target.value)}>
                    {METIERS.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </label>
                <label className="al-field"><span>Où</span>
                  <select value={canton} onChange={e => setCanton(e.target.value)}>
                    {Object.entries(CANTONS).map(([k, c]) => <option key={k} value={k}>{c.label}</option>)}
                  </select>
                </label>
              </div>
              <div className="al-steps">
                {SITES_EMPLOI.map(s => (
                  <a key={s.nom} href={s.url(metier, CANTONS[canton].lieu)} target="_blank" rel="noopener noreferrer" className="al-step" style={{ gridTemplateColumns: '1fr', textDecoration: 'none' }}>
                    <div><b>{s.url.length ? `${s.nom} · « ${metier} » · ${CANTONS[canton].label}` : `${s.nom} · tape « ${metier} » sur le site`}</b><p>{s.aide}</p></div>
                  </a>
                ))}
              </div>

              <h3>2. Les structures à qui écrire</h3>
              <p className="al-sub">Ajoute-les à tes candidatures, puis passe-les en « Contacté » quand tu as envoyé ton CV, en « Rendez-vous » pour un entretien.</p>
              <div className="al-actions">
                {[['tous', 'Toutes'], ['GE', 'Genève'], ['VD', 'Vaud'], ['VS', 'Valais'], ['CH', 'Toute la Suisse']].map(([k, l]) => (
                  <button key={k} className={cantonStructures === k ? 'btn-primary' : 'btn-secondary'} style={{ padding: '.35rem .8rem', fontSize: '.82rem' }} onClick={() => setCantonStructures(k)}>{l}</button>
                ))}
              </div>
              <div className="al-table-wrap">
                <table className="al-table">
                  <thead><tr><th>Structure</th><th>Type</th><th>Pourquoi toi</th><th /></tr></thead>
                  <tbody>
                    {STRUCTURES.filter(s => cantonStructures === 'tous' || s.canton === cantonStructures).map(s => (
                      <tr key={s.nom}>
                        <td><b>{s.nom}</b><br /><small className="al-sub">{s.canton === 'CH' ? 'Toute la Suisse' : CANTONS[s.canton]?.label}</small></td>
                        <td>{s.type}</td>
                        <td>{s.pourquoi}</td>
                        <td className="r" style={{ whiteSpace: 'nowrap' }}>
                          <a href={lienOffres(s)} target="_blank" rel="noopener noreferrer" style={{ color: '#136F5B', fontWeight: 600, fontSize: '.8rem', marginRight: 10 }}>Voir leurs offres</a>
                          {dejaCandidat(s.nom)
                            ? <span className="al-pill al-pill--ok">Dans mes candidatures</span>
                            : <button className="btn-secondary" style={{ padding: '.3rem .7rem', fontSize: '.78rem' }}
                                onClick={() => ajouter({ type: 'etablissement', nom: s.nom, organisme: s.type, categorie: CANDIDATURE, ville: s.canton === 'CH' ? 'Suisse' : CANTONS[s.canton]?.label, source: 'Radar emplois Suisse', notes: s.pourquoi })}>
                                Ajouter à mes candidatures</button>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="al-sub">Avant de signer un contrat en Suisse alors que tu as ta micro-entreprise en France : vérifie ta situation sociale auprès du CLEISS (voir « Mon entreprise & obligations »).</p>
            </section>
          )}

          {onglet === 'suivi' && (
            <section className="al-card">
              <div className="al-stats">
                {Object.entries(STATUTS).map(([k, l]) => (
                  <button key={k} className="al-stat" style={{ border: filtre === k ? '2px solid #136F5B' : '2px solid transparent', cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit' }} onClick={() => setFiltre(filtre === k ? 'actifs' : k)}>
                    <span>{l}</span><b>{compte(k)}</b>
                  </button>
                ))}
              </div>
              <div className="al-actions">
                <select value={filtre} onChange={e => setFiltre(e.target.value)} style={{ padding: '.45rem', borderRadius: 10, border: '1.5px solid #DFE7E3', fontFamily: 'inherit' }}>
                  <option value="actifs">En cours (hors sans suite)</option>
                  <option value="relances">Relances à faire</option>
                  <option value="candidatures">Mes candidatures en Suisse</option>
                  <option value="tous">Tous</option>
                  {Object.entries(STATUTS).map(([k, l]) => <option key={k} value={k}>{l}</option>)}
                </select>
              </div>

              <div className="al-steps">
                {visibles.length === 0 && <p className="al-sub">Personne ici. Ajoute des contacts depuis « Prescripteurs » ou à la main ci-dessous.</p>}
                {visibles.map(p => (
                  <div key={p.id} className="al-step" style={{ gridTemplateColumns: '1fr' }}>
                    <div style={{ display: 'grid', gap: '.5rem' }}>
                      <div className="al-actions" style={{ justifyContent: 'space-between' }}>
                        <div>
                          <b>{p.nom}</b>
                          <p>{TYPES[p.type]}{p.categorie ? ` · ${p.categorie}` : ''}{p.ville ? ` · ${p.ville}` : ''}{p.telephone ? ` · ${p.telephone}` : ''}</p>
                        </div>
                        <div className="al-actions">
                          <select value={p.statut} onChange={e => maj(p, { statut: e.target.value })} style={{ padding: '.35rem', borderRadius: 8, border: '1px solid #DFE7E3', fontFamily: 'inherit' }}>
                            {Object.entries(STATUTS).map(([k, l]) => <option key={k} value={k}>{l}</option>)}
                          </select>
                          <label className="al-sub" style={{ display: 'flex', gap: 6, alignItems: 'center' }}>Relance
                            <input type="date" value={p.relance || ''} onChange={e => maj(p, { relance: e.target.value })} style={{ padding: '.3rem', borderRadius: 8, border: '1px solid #DFE7E3', fontFamily: 'inherit' }} />
                          </label>
                          {p.relance && p.relance <= AUJ && !['client', 'partenaire', 'sans_suite'].includes(p.statut) && <span className="al-pill al-pill--wait">À relancer</span>}
                          <button className="btn-secondary" style={{ padding: '.3rem .7rem', fontSize: '.78rem' }} onClick={() => setOuvert(ouvert === p.id ? null : p.id)}>{ouvert === p.id ? 'Fermer' : 'Détails'}</button>
                        </div>
                      </div>
                      {ouvert === p.id && (
                        <div style={{ display: 'grid', gap: '.6rem' }}>
                          <div className="al-grid">
                            {[['telephone', 'Téléphone'], ['email', 'E-mail'], ['adresse', 'Adresse'], ['ville', 'Ville'], ['site', 'Site'], ['source', 'Source']].map(([k, l]) => (
                              <label className="al-field" key={k}><span>{l}</span>
                                <input defaultValue={p[k] || ''} onBlur={e => e.target.value !== (p[k] || '') && maj(p, { [k]: e.target.value })} />
                              </label>
                            ))}
                          </div>
                          <label className="al-field"><span>Notes (échanges, besoins, prochaine étape)</span>
                            <textarea rows={3} defaultValue={p.notes || ''} onBlur={e => e.target.value !== (p.notes || '') && maj(p, { notes: e.target.value })} />
                          </label>
                          <div className="al-actions">
                            {p.telephone && <a href={`tel:${p.telephone.replace(/\s/g, '')}`}>Appeler</a>}
                            {p.email && <a href={`mailto:${p.email}`}>Écrire</a>}
                            <a href={lien(`${p.nom} ${p.ville || ''}`)} target="_blank" rel="noopener noreferrer">Chercher sur Google</a>
                            <button className="btn-secondary" style={{ padding: '.3rem .7rem', fontSize: '.78rem' }} onClick={() => supprimer(p)}>Supprimer</button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <h3>Ajouter un contact</h3>
              <div className="al-grid">
                <label className="al-field"><span>Nom</span><input value={nouveau.nom} onChange={e => setNouveau(s => ({ ...s, nom: e.target.value }))} /></label>
                <label className="al-field"><span>Type</span>
                  <select value={nouveau.type} onChange={e => setNouveau(s => ({ ...s, type: e.target.value }))}>
                    {Object.entries(TYPES).map(([k, l]) => <option key={k} value={k}>{l}</option>)}
                  </select>
                </label>
                <label className="al-field"><span>Téléphone</span><input value={nouveau.telephone} onChange={e => setNouveau(s => ({ ...s, telephone: e.target.value }))} /></label>
                <label className="al-field"><span>Ville</span><input value={nouveau.ville} onChange={e => setNouveau(s => ({ ...s, ville: e.target.value }))} /></label>
                <label className="al-field"><span>Source</span><input value={nouveau.source} onChange={e => setNouveau(s => ({ ...s, source: e.target.value }))} /></label>
              </div>
              <div className="al-actions">
                <button className="btn-primary" disabled={!nouveau.nom} onClick={async () => { await ajouter(nouveau); setNouveau({ nom: '', type: 'famille', telephone: '', ville: '', source: 'Bouche-à-oreille' }) }}>Ajouter</button>
              </div>
              <p className="al-sub">Conserve un contact « Sans suite » 3 ans au plus, puis supprime-le (RGPD).</p>
            </section>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}
