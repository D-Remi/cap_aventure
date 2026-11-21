import { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import AdminLayout from '../../components/layout/AdminLayout'
import { chargerEntreprise } from '../../utils/pdfGenerator'
import './AdminLegal.css'

// Démarches et obligations, avec la source officielle quand elle existe.
export const DEMARCHES = [
  { groupe: 'Créer l\'activité', items: [
    { k: 'creation', t: 'Créer la micro-entreprise (activité : services à la personne)', d: 'Déclaration sur le guichet unique. Tu reçois ton SIRET, à reporter ci-dessous.', lien: 'https://formalites.entreprises.gouv.fr', o: true },
    { k: 'cumul', t: 'Demander l\'autorisation de cumul d\'activités à ton employeur', d: 'Tu es assistant d\'éducation (agent public contractuel) : le cumul avec une entreprise doit être déclaré et autorisé avant de démarrer.', o: true },
    { k: 'sap', t: 'Déclarer l\'activité de services à la personne sur NOVA', d: 'Gratuit. Ouvre le droit au crédit d\'impôt de 50 % pour tes clients. Numéro et date à reporter ci-dessous (ils figurent sur chaque facture).', lien: 'https://nova.entreprises.gouv.fr', o: true },
    { k: 'agrement', t: 'Obtenir l\'agrément (enfants handicapés de moins de 18 ans, enfants de moins de 3 ans)', d: 'Obligatoire pour garder ces enfants à domicile. Demande sur NOVA auprès de la DREETS, valable 5 ans. Avant l\'agrément : liste d\'attente, pas de garde.', lien: 'https://entreprendre.service-public.gouv.fr/vosdroits/F31964', o: true },
    { k: 'avance', t: 'Proposer l\'avance immédiate du crédit d\'impôt', d: 'Le client ne paie que 50 %. Inscription auprès de l\'URSSAF (API Tiers de prestation), directement ou via un logiciel de facturation partenaire.', lien: 'https://www.urssaf.fr', o: false },
    { k: 'rcpro', t: 'Souscrire une assurance responsabilité civile professionnelle', d: 'Elle doit couvrir la garde d\'enfants à domicile, y compris en situation de handicap.', o: true },
    { k: 'mediateur', t: 'Adhérer à un médiateur de la consommation', d: 'Obligatoire pour tout professionnel qui vend à des particuliers (Code de la consommation, art. L612-1). Ses coordonnées doivent figurer sur le site et dans les CGV.', lien: 'https://www.economie.gouv.fr/mediation-conso', o: true },
    { k: 'banque', t: 'Ouvrir un compte bancaire dédié à l\'activité', d: 'Obligatoire si le chiffre d\'affaires dépasse 10 000 € deux années civiles de suite. Conseillé dès le départ pour séparer les comptes.', o: false },
    { k: 'honorabilite', t: 'Garder l\'attestation d\'honorabilité à jour', d: 'À présenter aux familles et à renouveler selon sa durée de validité.', o: false },
    { k: 'psc1', t: 'Se former aux premiers secours (PSC1)', d: 'Fortement recommandé pour garder seul des enfants, et rassurant pour les familles.', o: false },
  ]},
  { groupe: 'À chaque nouvelle famille', items: [
    { k: 'devis', t: 'Remettre un devis gratuit', d: 'Obligatoire dès 100 € TTC de prestations par mois, ou si la famille le demande (arrêté du 17 mars 2015). Conserver une copie au moins un an. Menu « Devis ».', o: true },
    { k: 'contrat', t: 'Faire signer le contrat et les conditions générales', d: 'Signé au domicile de la famille : droit de rétractation de 14 jours. Une garde pendant ce délai seulement si la famille le demande par écrit.', o: true },
    { k: 'consentement', t: 'Recueillir l\'accord écrit des parents pour les données de santé de l\'enfant', d: 'Données sensibles (RGPD, art. 9) : ne collecter que le nécessaire et les garder confidentielles.', o: true },
    { k: 'adresse', t: 'Renseigner l\'adresse de la famille', d: 'Obligatoire sur les factures et les attestations fiscales. Menu « Familles ».', o: true },
  ]},
  { groupe: 'Chaque mois ou trimestre', items: [
    { k: 'factures', t: 'Facturer avant le paiement, avec une numérotation continue', d: 'Les factures sont numérotées automatiquement (FAC-année-0001). Marque-les payées : elles s\'inscrivent au livre des recettes.', o: true },
    { k: 'urssaf', t: 'Déclarer le chiffre d\'affaires encaissé à l\'URSSAF', d: 'Chaque mois ou trimestre, même à 0 €. Les montants sont calculés dans « Déclarations & URSSAF ».', lien: 'https://autoentrepreneur.urssaf.fr', o: true },
    { k: 'nova', t: 'Transmettre l\'état d\'activité trimestriel sur NOVA', d: 'Obligation des organismes déclarés (Code du travail, art. R7232-19), plus un bilan annuel. Chiffres prêts dans « Déclarations & URSSAF ».', lien: 'https://nova.entreprises.gouv.fr', o: true },
  ]},
  { groupe: 'Chaque année', items: [
    { k: 'attestations', t: 'Envoyer les attestations fiscales aux clients avant le 31 mars', d: 'Obligation des organismes déclarés (Code du travail, art. D7233-4). Générées en un clic dans « Déclarations & URSSAF ».', o: true },
    { k: 'impots', t: 'Reporter le chiffre d\'affaires sur la déclaration de revenus (2042-C-PRO)', d: 'Au printemps, même avec le versement libératoire.', lien: 'https://www.impots.gouv.fr', o: true },
    { k: 'cfe', t: 'Payer la cotisation foncière des entreprises (CFE)', d: 'En décembre, sur ton espace professionnel impots.gouv. Exonérée l\'année de création.', o: true },
    { k: 'ereporting', t: 'Préparer la facturation électronique', d: 'Calendrier annoncé : réception des factures électroniques dès le 1er septembre 2026, transmission des données de ventes aux particuliers (e-reporting) à partir du 1er septembre 2027 pour les micro-entreprises. À vérifier sur impots.gouv.fr.', lien: 'https://www.impots.gouv.fr', o: true },
  ]},
]

const CHAMPS = {
  'Identité': [
    ['prenom', 'Prénom'], ['nom', 'Nom'], ['nom_commercial', 'Nom commercial'],
    ['adresse', 'Adresse professionnelle', 'Publiée dans les mentions légales (une domiciliation est possible)'],
    ['code_postal', 'Code postal'], ['ville', 'Ville'], ['email', 'E-mail'], ['telephone', 'Téléphone'],
  ],
  'Immatriculation': [
    ['siret', 'SIRET'], ['code_ape', 'Code APE'],
    ['immatriculation', 'Immatriculation', 'Ex. « Immatriculé au RNE » ou « RCS Thonon-les-Bains »'],
    ['date_creation', 'Date de création', null, 'date'],
  ],
  'Services à la personne': [
    ['sap_numero', 'N° de déclaration SAP'], ['sap_date', 'Date de déclaration', null, 'date'],
    ['agrement_numero', 'N° d\'agrément', 'Si tu gardes des enfants handicapés ou de moins de 3 ans'], ['agrement_date', 'Date d\'agrément', null, 'date'],
    ['intervenant_identifiant', 'Identifiant de l\'intervenant', 'Figure sur les factures et attestations (par défaut : ton SIRET)'],
  ],
  'Assurance, médiation, hébergement': [
    ['assureur', 'Assureur RC professionnelle'], ['police_rc', 'N° de contrat'],
    ['mediateur_nom', 'Médiateur de la consommation'], ['mediateur_adresse', 'Adresse du médiateur'], ['mediateur_site', 'Site du médiateur'],
    ['hebergeur', 'Hébergeur du site', 'Nom, adresse et téléphone de l\'hébergeur du VPS'],
  ],
  'Paiement (affiché sur les factures)': [
    ['iban', 'IBAN'], ['bic', 'BIC'],
  ],
}

export default function AdminEntreprise() {
  const [p, setP] = useState(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    axios.get('/api/entreprise').then(r => setP(r.data)).catch(() => toast.error('Impossible de charger les paramètres'))
  }, [])

  const coches = useMemo(() => {
    try { return JSON.parse(p?.checklist || '{}') } catch { return {} }
  }, [p?.checklist])

  const total = DEMARCHES.reduce((s, g) => s + g.items.length, 0)
  const faites = Object.values(coches).filter(Boolean).length

  const set = (k, v) => setP(s => ({ ...s, [k]: v }))

  const save = async (data = p, msg = 'Paramètres enregistrés') => {
    setSaving(true)
    try {
      const { data: d } = await axios.put('/api/entreprise', data)
      setP(d); chargerEntreprise(true); toast.success(msg)
    } catch { toast.error("Échec de l'enregistrement") }
    finally { setSaving(false) }
  }

  const cocher = (k) => {
    const c = { ...coches, [k]: !coches[k] }
    const next = { ...p, checklist: JSON.stringify(c) }
    setP(next)
    axios.put('/api/entreprise', { checklist: c }).catch(() => toast.error('Non enregistré'))
  }

  if (!p) return <AdminLayout><div className="admin-page"><p>Chargement…</p></div></AdminLayout>

  return (
    <AdminLayout>
      <div className="admin-page">
        <div className="admin-page__header">
          <div>
            <h1>Mon entreprise & obligations</h1>
            <p className="admin-page__subtitle">Ces informations alimentent les mentions légales, les CGV, les factures, les devis et les attestations fiscales.</p>
          </div>
        </div>

        <div className="al">
          {/* Check-list */}
          <section className="al-card">
            <div className="al-actions" style={{ justifyContent: 'space-between' }}>
              <h2>Démarches et obligations</h2>
              <b style={{ color: '#136F5B' }}>{faites} / {total}</b>
            </div>
            <div className="al-progress"><i style={{ width: `${(faites / total) * 100}%` }} /></div>
            {DEMARCHES.map(g => (
              <div key={g.groupe} style={{ display: 'grid', gap: '.6rem' }}>
                <h3>{g.groupe}</h3>
                <div className="al-steps">
                  {g.items.map(it => (
                    <label key={it.k} className={`al-step ${coches[it.k] ? 'is-done' : ''}`}>
                      <input type="checkbox" checked={!!coches[it.k]} onChange={() => cocher(it.k)} />
                      <div>
                        <b>{it.t}<span className={`al-tag ${it.o ? 'al-tag--oblig' : 'al-tag--conseil'}`}>{it.o ? 'Obligatoire' : 'Conseillé'}</span></b>
                        <p>{it.d}</p>
                        {it.lien && <a href={it.lien} target="_blank" rel="noopener noreferrer">{it.lien.replace('https://', '')}</a>}
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </section>

          {/* Paramètres */}
          <section className="al-card">
            <h2>Informations légales</h2>
            <p className="al-sub">Tant que le SIRET et le numéro de déclaration SAP sont vides, les documents affichent « à compléter ».</p>
            {Object.entries(CHAMPS).map(([titre, champs]) => (
              <div key={titre} style={{ display: 'grid', gap: '.6rem' }}>
                <h3>{titre}</h3>
                <div className="al-grid">
                  {champs.map(([k, label, aide, type]) => (
                    <label className="al-field" key={k}>
                      <span>{label}</span>
                      <input type={type || 'text'} value={p[k] ? String(p[k]).slice(0, type === 'date' ? 10 : undefined) : ''} onChange={e => set(k, e.target.value)} />
                      {aide && <small>{aide}</small>}
                    </label>
                  ))}
                </div>
              </div>
            ))}

            <h3>Fiscalité et cotisations</h3>
            <div className="al-grid">
              <label className="al-field">
                <span>TVA</span>
                <select value={p.tva_regime} onChange={e => set('tva_regime', e.target.value)}>
                  <option value="franchise">Franchise en base (TVA non applicable, art. 293 B du CGI)</option>
                  <option value="assujetti">Assujetti à la TVA</option>
                </select>
              </label>
              {p.tva_regime === 'assujetti' && (
                <label className="al-field"><span>Taux de TVA (%)</span>
                  <input type="number" step="0.1" value={p.tva_taux} onChange={e => set('tva_taux', e.target.value)} />
                  <small>Taux réduit des services à la personne, à confirmer avec ton service des impôts</small>
                </label>
              )}
              <label className="al-field"><span>Cotisations sociales (%)</span>
                <input type="number" step="0.1" value={p.taux_cotisations} onChange={e => set('taux_cotisations', e.target.value)} />
                <small>21,2 % en 2026 (prestations de services BIC)</small>
              </label>
              <label className="al-field"><span>Formation professionnelle (%)</span>
                <input type="number" step="0.01" value={p.taux_cfp} onChange={e => set('taux_cfp', e.target.value)} />
              </label>
              <label className="al-field"><span>Déclaration URSSAF</span>
                <select value={p.periodicite_urssaf} onChange={e => set('periodicite_urssaf', e.target.value)}>
                  <option value="trimestrielle">Trimestrielle</option>
                  <option value="mensuelle">Mensuelle</option>
                </select>
              </label>
              <label className="al-field"><span>Taux du versement libératoire (%)</span>
                <input type="number" step="0.1" value={p.taux_vl} onChange={e => set('taux_vl', e.target.value)} />
              </label>
            </div>
            <div className="al-actions">
              <label className="al-check"><input type="checkbox" checked={!!p.versement_liberatoire} onChange={e => set('versement_liberatoire', e.target.checked)} /> J'ai opté pour le versement libératoire de l'impôt</label>
              <label className="al-check"><input type="checkbox" checked={!!p.acre} onChange={e => set('acre', e.target.checked)} /> Je bénéficie de l'ACRE (taux réduit la première année)</label>
            </div>
            <div className="al-actions">
              <button className="btn-primary" onClick={() => save()} disabled={saving}>{saving ? 'Enregistrement…' : 'Enregistrer'}</button>
              <a href="/mentions-legales" target="_blank" rel="noopener noreferrer" style={{ color: '#136F5B', fontWeight: 600 }}>Voir les mentions légales</a>
              <a href="/cgv" target="_blank" rel="noopener noreferrer" style={{ color: '#136F5B', fontWeight: 600 }}>Voir les CGV</a>
            </div>
          </section>
        </div>
      </div>
    </AdminLayout>
  )
}
