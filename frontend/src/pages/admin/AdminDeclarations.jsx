import { useEffect, useState, useCallback } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import AdminLayout from '../../components/layout/AdminLayout'
import { genererAttestationPDF, chargerEntreprise } from '../../utils/pdfGenerator'
import './AdminLegal.css'

const eur = (n) => `${(parseFloat(n) || 0).toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €`
const date = (d) => d ? new Date(String(d).slice(0, 10) + 'T00:00:00').toLocaleDateString('fr-FR') : '-'
const ANNEES = (() => { const y = new Date().getFullYear(); return [y - 2, y - 1, y, y + 1] })()
const AUJ = new Date().toISOString().slice(0, 10)

function Jauge({ label, valeur, seuil, aide }) {
  const pct = Math.min(100, (valeur / seuil) * 100)
  const cls = pct >= 100 ? 'danger' : pct >= 80 ? 'warn' : ''
  return (
    <div className="al-gauge">
      <div className="al-gauge__top"><span>{label}</span><b>{eur(valeur)} / {eur(seuil)}</b></div>
      <div className="al-gauge__bar"><i className={cls} style={{ width: `${pct}%` }} /></div>
      {aide && <small className="al-sub">{aide}</small>}
    </div>
  )
}

export default function AdminDeclarations() {
  const [annee, setAnnee] = useState(new Date().getFullYear())
  const [decl, setDecl] = useState(null)
  const [nova, setNova] = useState(null)
  const [att, setAtt] = useState(null)
  const [factures, setFactures] = useState([])

  const charger = useCallback(() => {
    Promise.all([
      axios.get(`/api/compta/declarations?year=${annee}`),
      axios.get(`/api/compta/nova?year=${annee}`),
      axios.get(`/api/compta/attestations?year=${annee}`),
      axios.get('/api/contrats/factures/toutes'),
    ]).then(([d, n, a, f]) => { setDecl(d.data); setNova(n.data); setAtt(a.data); setFactures(f.data || []) })
      .catch(() => toast.error('Impossible de charger les déclarations (migration de la base faite ?)'))
  }, [annee])

  useEffect(() => { charger() }, [charger])

  const exporterLivre = async () => {
    try {
      const { data } = await axios.get(`/api/compta/livre-recettes?year=${annee}`, { responseType: 'blob' })
      const url = URL.createObjectURL(new Blob([data], { type: 'text/csv;charset=utf-8' }))
      const a = document.createElement('a')
      a.href = url; a.download = `Livre_des_recettes_${annee}.csv`; a.click()
      URL.revokeObjectURL(url)
    } catch { toast.error('Export impossible') }
  }

  const attestationPDF = async (client) => {
    const ent = await chargerEntreprise()
    genererAttestationPDF(client, annee, ent)
  }

  const prochaine = decl?.periodes.find(p => p.echeance >= AUJ)
  const impayees = factures.filter(f => f.statut !== 'payee')

  return (
    <AdminLayout>
      <div className="admin-page">
        <div className="admin-page__header">
          <div>
            <h1>Déclarations & URSSAF</h1>
            <p className="admin-page__subtitle">Calculé à partir du livre des recettes (montants encaissés). Montants indicatifs : la déclaration officielle se fait sur autoentrepreneur.urssaf.fr.</p>
          </div>
          <select value={annee} onChange={e => setAnnee(+e.target.value)}
            style={{ padding: '.5rem .85rem', border: '1.5px solid var(--sable-dark)', borderRadius: 8, fontFamily: 'inherit', fontWeight: 700 }}>
            {ANNEES.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>

        {!decl ? <p>Chargement…</p> : (
          <div className="al">
            {decl.alertes.length > 0 && (
              <div style={{ display: 'grid', gap: '.5rem' }}>
                {decl.alertes.map((a, i) => (
                  <div key={i} className={`al-alert al-alert--${a.niveau}`}>
                    <b>{a.niveau === 'urgent' ? 'Urgent' : a.niveau === 'attention' ? 'Attention' : 'Info'}</b><span>{a.texte}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="al-stats">
              <div className="al-stat"><span>CA encaissé {annee}</span><b>{eur(decl.total.ca)}</b><small>Année précédente : {eur(decl.ca_annee_precedente)}</small></div>
              <div className="al-stat"><span>Cotisations + CFP</span><b>{eur(decl.total.cotisations + decl.total.cfp)}</b><small>{String(decl.taux.cotisations).replace('.', ',')} % + {String(decl.taux.cfp).replace('.', ',')} %{decl.acre ? ' · ACRE : montant réel plus bas' : ''}</small></div>
              <div className="al-stat"><span>Total à payer {annee}</span><b>{eur(decl.total.a_payer)}</b><small>{decl.taux.vl ? 'dont impôt (versement libératoire)' : 'sans versement libératoire'}</small></div>
              <div className="al-stat"><span>Prochaine échéance</span><b>{prochaine ? date(prochaine.echeance) : '-'}</b><small>{prochaine ? `${prochaine.periode} · ${eur(prochaine.total_a_payer)}` : 'Aucune'}</small></div>
            </div>

            <section className="al-card">
              <h2>Seuils à surveiller</h2>
              <Jauge label="Franchise de TVA" valeur={decl.total.ca} seuil={decl.seuils.tva}
                aide={`Projection fin d'année : ${eur(decl.projection)}. Au-delà de ${eur(decl.seuils.tva_majore)} dans l'année, la TVA est due immédiatement.`} />
              <Jauge label="Plafond micro-entreprise (services)" valeur={decl.total.ca} seuil={decl.seuils.plafond_micro} />
              <Jauge label="Compte bancaire dédié (si dépassé deux années de suite)" valeur={decl.total.ca} seuil={decl.seuils.compte_dedie} />
            </section>

            <section className="al-card">
              <div className="al-actions" style={{ justifyContent: 'space-between' }}>
                <h2>Déclarations URSSAF ({decl.periodicite})</h2>
                <a href="https://autoentrepreneur.urssaf.fr" target="_blank" rel="noopener noreferrer" style={{ color: '#136F5B', fontWeight: 600, fontSize: '.88rem' }}>Déclarer sur autoentrepreneur.urssaf.fr</a>
              </div>
              <p className="al-sub">Déclare le chiffre d'affaires réellement encaissé sur la période, même s'il est nul. La colonne « À déclarer » est le montant à saisir.</p>
              <div className="al-table-wrap">
                <table className="al-table">
                  <thead><tr><th>Période</th><th className="r">Encaissé</th><th className="r">À déclarer</th><th className="r">Cotisations</th><th className="r">CFP</th><th className="r">Impôt (VL)</th><th className="r">Total</th><th>Échéance</th></tr></thead>
                  <tbody>
                    {decl.periodes.map(p => (
                      <tr key={p.periode} className={p === prochaine ? 'is-next' : p.echeance < AUJ ? 'is-past' : ''}>
                        <td>{p.periode}</td><td className="r">{eur(p.encaisse_ttc)}</td><td className="r"><b>{eur(p.ca_a_declarer)}</b></td>
                        <td className="r">{eur(p.cotisations)}</td><td className="r">{eur(p.cfp)}</td><td className="r">{eur(p.impot_vl)}</td>
                        <td className="r"><b>{eur(p.total_a_payer)}</b></td><td>{date(p.echeance)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot><tr><td>Total {annee}</td><td /><td className="r">{eur(decl.total.ca)}</td><td className="r">{eur(decl.total.cotisations)}</td><td className="r">{eur(decl.total.cfp)}</td><td className="r">{eur(decl.total.impot_vl)}</td><td className="r">{eur(decl.total.a_payer)}</td><td /></tr></tfoot>
                </table>
              </div>
            </section>

            <section className="al-card">
              <div className="al-actions" style={{ justifyContent: 'space-between' }}>
                <h2>Livre des recettes</h2>
                <button className="btn-primary" onClick={exporterLivre}>Télécharger le livre {annee} (Excel)</button>
              </div>
              <p className="al-sub">Obligatoire en micro-entreprise. Chaque facture marquée payée y est inscrite automatiquement ; les autres encaissements se saisissent dans « Comptabilité ». Conserve-le 10 ans avec les factures.</p>
            </section>

            <section className="al-card">
              <div className="al-actions" style={{ justifyContent: 'space-between' }}>
                <h2>Suivi des factures</h2>
                <span className="al-pill al-pill--wait">{impayees.length} non payée{impayees.length > 1 ? 's' : ''} · {eur(impayees.reduce((s, f) => s + (parseFloat(f.montant_total) || 0), 0))}</span>
              </div>
              <div className="al-table-wrap">
                <table className="al-table">
                  <thead><tr><th>N°</th><th>Client</th><th>Période</th><th className="r">Montant</th><th>Statut</th><th>Réglée le</th></tr></thead>
                  <tbody>
                    {factures.length === 0 && <tr><td colSpan={6} className="al-sub">Aucune facture. Elles se créent depuis « Contrats », onglet Factures.</td></tr>}
                    {factures.map(f => (
                      <tr key={f.id}>
                        <td>{f.numero}</td>
                        <td>{f.user ? `${f.user.prenom} ${f.user.nom}` : '-'}</td>
                        <td>{date(f.periode_debut)} au {date(f.periode_fin)}</td>
                        <td className="r">{eur(f.montant_total)}</td>
                        <td><span className={`al-pill ${f.statut === 'payee' ? 'al-pill--ok' : f.statut === 'envoyee' ? 'al-pill--wait' : 'al-pill--todo'}`}>{f.statut === 'payee' ? 'Payée' : f.statut === 'envoyee' ? 'Envoyée' : 'Brouillon'}</span></td>
                        <td>{date(f.date_paiement)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {nova && (
              <section className="al-card">
                <div className="al-actions" style={{ justifyContent: 'space-between' }}>
                  <h2>États d'activité NOVA</h2>
                  <a href="https://nova.entreprises.gouv.fr" target="_blank" rel="noopener noreferrer" style={{ color: '#136F5B', fontWeight: 600, fontSize: '.88rem' }}>Saisir sur NOVA</a>
                </div>
                <p className="al-sub">À transmettre chaque trimestre, plus un bilan annuel (Code du travail, art. R7232-19). Effectif salarié : 0 (tu interviens seul).</p>
                <div className="al-table-wrap">
                  <table className="al-table">
                    <thead><tr><th>Trimestre</th><th className="r">Heures d'intervention</th><th className="r">Chiffre d'affaires</th><th className="r">Clients</th><th className="r">Interventions</th></tr></thead>
                    <tbody>
                      {nova.trimestres.map(t => (
                        <tr key={t.trimestre}><td>T{t.trimestre} {annee}</td><td className="r">{String(t.heures).replace('.', ',')} h</td><td className="r">{eur(t.chiffre_affaires)}</td><td className="r">{t.clients}</td><td className="r">{t.interventions}</td></tr>
                      ))}
                    </tbody>
                    <tfoot><tr><td>Bilan {annee}</td><td className="r">{String(nova.total.heures).replace('.', ',')} h</td><td className="r">{eur(nova.total.chiffre_affaires)}</td><td /><td /></tr></tfoot>
                  </table>
                </div>
              </section>
            )}

            {att && (
              <section className="al-card">
                <h2>Attestations fiscales {annee}</h2>
                <p className="al-sub">À envoyer à chaque client avant le {att.avant} {annee + 1} (Code du travail, art. D7233-4). Les paiements en espèces sont exclus. Les heures viennent des séances saisies dans les contrats.</p>
                <div className="al-table-wrap">
                  <table className="al-table">
                    <thead><tr><th>Client</th><th className="r">Montant acquitté</th><th className="r">Heures</th><th>Adresse</th><th /></tr></thead>
                    <tbody>
                      {att.clients.length === 0 && <tr><td colSpan={5} className="al-sub">Aucun encaissement rattaché à une famille cette année.</td></tr>}
                      {att.clients.map(c => (
                        <tr key={c.user.id}>
                          <td>{c.user.prenom} {c.user.nom}</td>
                          <td className="r">{eur(c.montant_acquitte)}{c.dont_cesu > 0 && <small className="al-sub"> (dont CESU {eur(c.dont_cesu)})</small>}</td>
                          <td className="r">{String(c.heures_total).replace('.', ',')} h</td>
                          <td>{c.adresse_manquante ? <span className="al-pill al-pill--wait">À compléter (Familles)</span> : <span className="al-pill al-pill--ok">OK</span>}</td>
                          <td className="r"><button className="btn-secondary" style={{ padding: '.35rem .8rem', fontSize: '.8rem' }} onClick={() => attestationPDF(c)}>PDF</button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
