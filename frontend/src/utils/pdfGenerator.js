import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import axios from 'axios'

// Couleurs de la marque
const FORET  = [11, 42, 34]
const VERT   = [19, 111, 91]
const MUTED  = [110, 120, 116]
const TEXTE  = [40, 48, 45]
const FOND   = [238, 244, 241]

// ── Données légales de l'entreprise (Admin > Mon entreprise) ─────────────
let cacheEntreprise = null
export async function chargerEntreprise(force = false) {
  if (cacheEntreprise && !force) return cacheEntreprise
  try { cacheEntreprise = (await axios.get('/api/entreprise')).data || {} }
  catch { cacheEntreprise = {} }
  return cacheEntreprise
}

const eur = (n) => `${(parseFloat(n) || 0).toFixed(2).replace('.', ',')} €`
const franchise = (ent) => (ent?.tva_regime || 'franchise') === 'franchise'

function identite(ent) {
  const nom = [ent?.prenom, ent?.nom].filter(Boolean).join(' ') || '[Nom à compléter]'
  return `${nom} EI`
}
function lignesEmetteur(ent) {
  const l = [identite(ent)]
  if (ent?.nom_commercial) l.push(ent.nom_commercial)
  l.push(ent?.adresse || '[Adresse à compléter]')
  l.push([ent?.code_postal, ent?.ville].filter(Boolean).join(' ') || '')
  l.push(`SIRET : ${ent?.siret || '[à compléter]'}`)
  if (ent?.immatriculation) l.push(ent.immatriculation)
  l.push(`Déclaration SAP n° ${ent?.sap_numero || '[à compléter]'}${ent?.sap_date ? ` du ${fmtDate(ent.sap_date)}` : ''}`)
  if (ent?.agrement_numero) l.push(`Agrément n° ${ent.agrement_numero}${ent?.agrement_date ? ` du ${fmtDate(ent.agrement_date)}` : ''}`)
  if (ent?.email) l.push(ent.email)
  if (ent?.telephone) l.push(ent.telephone)
  return l.filter(Boolean)
}
function lignesClient(user) {
  const l = [`${user?.prenom || ''} ${user?.nom || ''}`.trim() || '[Client]']
  l.push(user?.adresse || '[Adresse du client à compléter]')
  l.push([user?.code_postal, user?.ville].filter(Boolean).join(' '))
  if (user?.email) l.push(user.email)
  return l.filter(Boolean)
}

// En-tête commun
function header(doc, sousTitre, ent) {
  doc.setFillColor(...FORET)
  doc.rect(0, 0, 210, 30, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(19)
  doc.text(ent?.nom_commercial || 'Éduc & Vous', 14, 15)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8.5)
  doc.text('Garde et répit à domicile · Chablais, Haute-Savoie', 14, 22)
  if (sousTitre) {
    doc.setTextColor(200, 241, 105)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(13)
    doc.text(sousTitre, 196, 16, { align: 'right' })
  }
}

function footer(doc, ent = cacheEntreprise || {}) {
  const pages = doc.internal.getNumberOfPages()
  for (let i = 1; i <= pages; i++) {
    doc.setPage(i)
    const h = doc.internal.pageSize.height
    doc.setDrawColor(220, 226, 223)
    doc.line(14, h - 16, 196, h - 16)
    doc.setTextColor(...MUTED)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(7)
    doc.text(
      `${identite(ent)} · SIRET ${ent?.siret || '[à compléter]'} · Déclaration SAP n° ${ent?.sap_numero || '[à compléter]'}`,
      105, h - 11, { align: 'center' }
    )
    doc.text(`Page ${i} / ${pages}`, 196, h - 6, { align: 'right' })
  }
}

function blocDeux(doc, y, titreG, lignesG, titreD, lignesD) {
  doc.setTextColor(...VERT)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8.5)
  doc.text(titreG, 14, y)
  doc.text(titreD, 110, y)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8.5)
  doc.setTextColor(...TEXTE)
  doc.text(lignesG, 14, y + 5)
  doc.text(lignesD, 110, y + 5)
  return y + 5 + Math.max(lignesG.length, lignesD.length) * 3.9
}

function mentionFiscale(doc, y, texte) {
  // Avantage fiscal : mention détachée du prix, en caractères plus petits (arrêté du 17 mars 2015, art. 5)
  doc.setTextColor(...MUTED)
  doc.setFont('helvetica', 'italic')
  doc.setFontSize(7.2)
  const l = doc.splitTextToSize(texte, 182)
  doc.text(l, 14, y)
  return y + l.length * 3.3
}

// ══════════ FACTURE (Code du travail, art. D7233-1) ══════════
export async function genererFacturePDF(facture, contrat, user, seances = [], entParam) {
  const ent = entParam || await chargerEntreprise()
  const doc = new jsPDF()
  header(doc, 'FACTURE', ent)

  doc.setTextColor(255, 255, 255)
  doc.setFontSize(8.5)
  doc.text(`N° ${facture.numero}`, 196, 22, { align: 'right' })

  let y = 40
  doc.setTextColor(...TEXTE)
  doc.setFontSize(8.5)
  doc.text(`Date d'émission : ${fmtDate(String(facture.created_at || '').slice(0, 10))}`, 14, y)
  doc.text(`Période : du ${fmtDate(facture.periode_debut)} au ${fmtDate(facture.periode_fin)}`, 110, y)

  y = blocDeux(doc, y + 8, 'PRESTATAIRE', lignesEmetteur(ent), 'CLIENT (BÉNÉFICIAIRE)', lignesClient(user)) + 4

  // Nature exacte des services et intervenant
  doc.setFillColor(...FOND)
  doc.rect(14, y, 182, 15, 'F')
  doc.setTextColor(...FORET)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8.5)
  const enfant = contrat?.child ? ` (${contrat.child.prenom})` : ''
  doc.text(`Nature des services : garde d'enfant${enfant} à domicile, mode prestataire`, 16, y + 5.5)
  doc.setFont('helvetica', 'normal')
  doc.text(
    `Intervenant : ${[ent?.prenom, ent?.nom].filter(Boolean).join(' ') || '[à compléter]'} · identifiant ${ent?.intervenant_identifiant || ent?.siret || '[à compléter]'}`,
    16, y + 11
  )
  y += 21

  // Décompte du temps passé
  const taux = parseFloat(contrat?.tarif_horaire || 0)
  const rows = seances.length > 0
    ? seances.map(s => [
        fmtDate(s.date),
        `${(s.heure_debut || '').slice(0, 5)} - ${(s.heure_fin || '').slice(0, 5)}`,
        `${heuresEntre(s.heure_debut, s.heure_fin)} h`,
        eur(taux),
        `${(parseFloat(s.km_aller || 0) + parseFloat(s.km_retour || 0)).toFixed(0)} km`,
        eur(s.montant_total),
      ])
    : [['Voir période', '-', `${facture.total_heures} h`, eur(taux), `${facture.total_km} km`, eur(facture.montant_total)]]

  autoTable(doc, {
    startY: y,
    head: [['Date', 'Horaire', 'Durée', 'Taux horaire', 'Déplacement', 'Montant']],
    body: rows,
    theme: 'striped',
    headStyles: { fillColor: VERT, textColor: 255, fontSize: 8.5, fontStyle: 'bold' },
    bodyStyles: { fontSize: 8.2, textColor: TEXTE },
    columnStyles: { 5: { halign: 'right', fontStyle: 'bold' } },
    margin: { left: 14, right: 14 },
  })

  // Totaux
  let yt = doc.lastAutoTable.finalY + 7
  const lignes = [
    ['Garde', `${facture.total_heures} h x ${eur(taux)}`, eur(facture.montant_heures)],
    ['Frais de déplacement', `${facture.total_km} km x ${eur(contrat?.tarif_km || 0)}`, eur(facture.montant_km)],
  ]
  if (!franchise(ent)) {
    const tva = (parseFloat(ent?.tva_taux) || 10) / 100
    const ttc = parseFloat(facture.montant_total) || 0
    lignes.push(['Total HT', '', eur(ttc / (1 + tva))])
    lignes.push([`TVA ${(tva * 100).toFixed(1).replace('.', ',')} %`, '', eur(ttc - ttc / (1 + tva))])
  }
  lignes.forEach(([label, detail, montant]) => {
    doc.setTextColor(...MUTED); doc.setFont('helvetica', 'normal'); doc.setFontSize(8.5)
    doc.text(label, 118, yt)
    if (detail) { doc.setFontSize(7.2); doc.text(detail, 118, yt + 3.4) }
    doc.setFontSize(8.5); doc.setTextColor(...TEXTE)
    doc.text(montant, 196, yt, { align: 'right' })
    yt += 8.5
  })
  doc.setFillColor(...FORET)
  doc.rect(116, yt, 80, 11, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(10.5)
  doc.text(franchise(ent) ? 'TOTAL' : 'TOTAL TTC', 119, yt + 7.2)
  doc.text(eur(facture.montant_total), 193, yt + 7.2, { align: 'right' })
  yt += 19

  // Règlement (montant effectivement acquitté)
  doc.setTextColor(...TEXTE)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8.5)
  if (facture.statut === 'payee') {
    const modes = { avance_immediate: 'avance immédiate URSSAF', virement: 'virement', cesu: 'CESU préfinancé', cheque: 'chèque', cb: 'carte bancaire', especes: 'espèces' }
    doc.text(`Facture acquittée le ${fmtDate(facture.date_paiement)}${facture.mode_paiement ? ` par ${modes[facture.mode_paiement] || facture.mode_paiement}` : ''} : ${eur(facture.montant_total)}`, 14, yt)
  } else {
    doc.text(`Montant à régler à réception : ${eur(facture.montant_total)}`, 14, yt)
  }
  yt += 5
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  const paiement = ['Règlement par avance immédiate URSSAF, virement ou CESU préfinancé.']
  if (ent?.iban) paiement.push(`IBAN : ${ent.iban}${ent?.bic ? ` · BIC : ${ent.bic}` : ''}`)
  if (franchise(ent)) paiement.push('TVA non applicable, article 293 B du CGI.')
  doc.text(paiement, 14, yt)
  yt += paiement.length * 4 + 4

  mentionFiscale(doc, yt,
    "Ces prestations de services à la personne ouvrent droit au crédit d'impôt prévu à l'article 199 sexdecies du code général des impôts, " +
    "dans les conditions et limites fixées par la loi. Les sommes réglées en espèces et la part financée par des CESU préfinancés par un tiers n'ouvrent pas droit à cet avantage."
  )

  footer(doc, ent)
  doc.save(`Facture_${facture.numero}.pdf`)
}

// ══════════ ATTESTATION FISCALE ANNUELLE (Code du travail, art. D7233-4) ══════════
export function genererAttestationPDF(client, annee, ent) {
  const doc = new jsPDF()
  header(doc, 'ATTESTATION FISCALE', ent)
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(8.5)
  doc.text(`Année ${annee}`, 196, 22, { align: 'right' })

  let y = blocDeux(doc, 42, 'ORGANISME', lignesEmetteur(ent), 'BÉNÉFICIAIRE', lignesClient(client.user)) + 6

  doc.setTextColor(...TEXTE)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  const intro = doc.splitTextToSize(
    `Je soussigné ${[ent?.prenom, ent?.nom].filter(Boolean).join(' ') || '[nom]'}, entrepreneur individuel, certifie que ` +
    `${client.user.prenom} ${client.user.nom} a bénéficié de prestations de garde d'enfant à domicile (services à la personne, mode prestataire) en ${annee}, ` +
    `et a effectivement acquitté la somme indiquée ci-dessous au titre de ces prestations.`, 182)
  doc.text(intro, 14, y)
  y += intro.length * 4.4 + 4

  doc.setFillColor(...FOND)
  doc.rect(14, y, 182, 16, 'F')
  doc.setTextColor(...FORET)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(11)
  doc.text(`Montant effectivement acquitté en ${annee} : ${eur(client.montant_acquitte)}`, 18, y + 7)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  const details = []
  if (client.dont_cesu > 0) details.push(`dont ${eur(client.dont_cesu)} réglés en CESU préfinancés : la part financée par un tiers est à déduire de la base du crédit d'impôt.`)
  if (client.especes_exclues > 0) details.push(`${eur(client.especes_exclues)} réglés en espèces ne sont pas inclus (pas d'avantage fiscal).`)
  if (details.length) doc.text(doc.splitTextToSize(details.join(' '), 174), 18, y + 12)
  y += 22

  doc.setTextColor(...VERT)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8.5)
  doc.text(`Récapitulatif des interventions · intervenant : ${[ent?.prenom, ent?.nom].filter(Boolean).join(' ') || '[nom]'} (identifiant ${ent?.intervenant_identifiant || ent?.siret || '[à compléter]'})`, 14, y)

  autoTable(doc, {
    startY: y + 3,
    head: [['Date', 'Horaire', 'Durée']],
    body: client.interventions.length
      ? client.interventions.map(i => [fmtDate(i.date), `${i.debut} - ${i.fin}`, `${String(i.duree).replace('.', ',')} h`])
      : [['Aucune séance enregistrée', '', '']],
    foot: [['Total', '', `${String(client.heures_total).replace('.', ',')} h`]],
    theme: 'striped',
    headStyles: { fillColor: VERT, textColor: 255, fontSize: 8.5 },
    footStyles: { fillColor: FOND, textColor: FORET, fontStyle: 'bold' },
    bodyStyles: { fontSize: 8.2, textColor: TEXTE },
    margin: { left: 14, right: 14 },
  })

  let yt = doc.lastAutoTable.finalY + 8
  if (yt > 250) { doc.addPage(); yt = 20 }
  doc.setTextColor(...TEXTE)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8.5)
  doc.text(`Fait à ${ent?.ville || '[ville]'}, le ${new Date().toLocaleDateString('fr-FR')}`, 14, yt)
  doc.text('Signature', 150, yt)
  yt += 16
  mentionFiscale(doc, yt,
    "Attestation délivrée pour permettre au bénéficiaire de faire valoir ses droits au crédit d'impôt prévu à l'article 199 sexdecies du code général des impôts. " +
    "À conserver avec vos justificatifs. Si vous avez utilisé l'avance immédiate, le montant de l'aide déjà perçue est pris en compte par l'administration fiscale."
  )

  footer(doc, ent)
  doc.save(`Attestation_fiscale_${annee}_${client.user.nom}_${client.user.prenom}.pdf`)
}

// ══════════ DEVIS (arrêté du 17 mars 2015, art. 7) ══════════
export function genererDevisPDF(devis, ent) {
  const doc = new jsPDF()
  header(doc, 'DEVIS GRATUIT', ent)
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(8.5)
  doc.text(`N° ${devis.numero}`, 196, 22, { align: 'right' })

  let y = 40
  doc.setTextColor(...TEXTE)
  doc.setFontSize(8.5)
  doc.text(`Date : ${fmtDate(devis.date)}`, 14, y)
  doc.text(`Valable jusqu'au : ${fmtDate(devis.validite)}`, 110, y)

  y = blocDeux(doc, y + 8, 'PRESTATAIRE', lignesEmetteur(ent), 'CLIENT', [
    devis.client_nom || '[Nom du client]',
    devis.client_adresse || '[Adresse du client]',
  ]) + 4

  doc.setFillColor(...FOND)
  doc.rect(14, y, 182, 15, 'F')
  doc.setTextColor(...FORET)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8.5)
  doc.text(`Lieu d'intervention : ${devis.lieu || '[adresse ou zone indiquée par le client]'}`, 16, y + 5.5)
  doc.setFont('helvetica', 'normal')
  doc.text('Mode d\'intervention : prestataire (Éduc & Vous intervient directement, le client n\'est pas employeur).', 16, y + 11)
  y += 21

  const tva = franchise(ent) ? 0 : (parseFloat(ent?.tva_taux) || 10) / 100
  const lignes = devis.lignes.filter(l => l.description)
  const totalTTC = lignes.reduce((s, l) => s + (parseFloat(l.heures) || 0) * (parseFloat(l.prix) || 0), 0) + (parseFloat(devis.frais_deplacement) || 0)
  autoTable(doc, {
    startY: y,
    head: [['Prestation', `Heures ${devis.periodicite}`, 'Prix horaire HT', 'Prix horaire TTC', `Montant TTC ${devis.periodicite}`]],
    body: [
      ...lignes.map(l => {
        const p = parseFloat(l.prix) || 0, h = parseFloat(l.heures) || 0
        return [l.description, String(h).replace('.', ','), eur(p / (1 + tva)), eur(p), eur(p * h)]
      }),
      ...(parseFloat(devis.frais_deplacement) > 0
        ? [['Frais de déplacement', '', '', '', eur(devis.frais_deplacement)]] : []),
    ],
    foot: [['Total', '', '', franchise(ent) ? 'HT = TTC' : `dont TVA ${eur(totalTTC - totalTTC / (1 + tva))}`, eur(totalTTC)]],
    theme: 'striped',
    headStyles: { fillColor: VERT, textColor: 255, fontSize: 8 },
    footStyles: { fillColor: FOND, textColor: FORET, fontStyle: 'bold' },
    bodyStyles: { fontSize: 8.2, textColor: TEXTE },
    columnStyles: { 4: { halign: 'right' } },
    margin: { left: 14, right: 14 },
  })

  let yt = doc.lastAutoTable.finalY + 7
  doc.setTextColor(...TEXTE)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8.2)
  const infos = [
    franchise(ent) ? 'TVA non applicable, article 293 B du CGI : les prix HT et TTC sont identiques.' : `Taux de TVA applicable : ${parseFloat(ent?.tva_taux) || 10} %.`,
    `Montant total ${devis.periodicite} : ${eur(totalTTC)} TTC${devis.periodicite === 'par mois' ? '' : ''}.`,
    "Annulation gratuite jusqu'à 48 h avant une garde. Droit de rétractation de 14 jours (contrat conclu hors établissement), voir conditions générales.",
  ]
  if (devis.notes) infos.push(devis.notes)
  const lines = doc.splitTextToSize(infos.join('\n'), 182)
  doc.text(lines, 14, yt)
  yt += lines.length * 3.9 + 5

  yt = mentionFiscale(doc, yt,
    "Avantage fiscal : ces prestations ouvrent droit, sous conditions, au crédit d'impôt de 50 % prévu à l'article 199 sexdecies du code général des impôts. " +
    "Avec l'avance immédiate de l'URSSAF, ce crédit est déduit au moment du paiement."
  ) + 6

  if (yt > 245) { doc.addPage(); yt = 24 }
  doc.setTextColor(...TEXTE)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8.5)
  doc.text('Devis gratuit. Bon pour accord (date, mention « lu et approuvé », signature) :', 14, yt)
  doc.setDrawColor(200, 210, 205)
  doc.rect(14, yt + 3, 90, 24)
  doc.text('Le prestataire :', 120, yt)
  doc.rect(120, yt + 3, 76, 24)

  footer(doc, ent)
  doc.save(`Devis_${devis.numero}.pdf`)
}

// ══════════ DOSSIER ENFANT ══════════
export function genererDossierEnfantPDF(child) {
  const doc = new jsPDF()
  header(doc, 'DOSSIER', cacheEntreprise)

  let y = 44
  doc.setTextColor(...FORET)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(15)
  doc.text(`${child.prenom} ${child.nom}`, 14, y)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(...MUTED)
  if (child.date_naissance) {
    doc.text(`Né(e) le ${fmtDate(child.date_naissance)} (${age(child.date_naissance)} ans)`, 14, y + 6)
  }

  y += 14

  const section = (titre, lignes) => {
    const items = lignes.filter(([, v]) => v)
    if (items.length === 0) return
    if (y > 250) { doc.addPage(); y = 20 }
    doc.setFillColor(...FOND)
    doc.rect(14, y, 182, 7, 'F')
    doc.setTextColor(...VERT)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(9.5)
    doc.text(titre, 16, y + 5)
    y += 11
    items.forEach(([label, val]) => {
      if (y > 270) { doc.addPage(); y = 20 }
      doc.setTextColor(...FORET)
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(8.5)
      doc.text(label, 16, y)
      doc.setTextColor(60, 60, 60)
      doc.setFont('helvetica', 'normal')
      const lines = doc.splitTextToSize(String(val), 120)
      doc.text(lines, 72, y)
      y += Math.max(lines.length * 4.5, 6)
    })
    y += 4
  }

  section('Identité & contacts', [
    ['Autonomie', { total:'Totale', partiel:'Partielle', accompagne:'Accompagnée' }[child.niveau_autonomie]],
    ['Médecin', child.medecin_nom],
    ['Tél. médecin', child.medecin_telephone],
    ['Urgence', child.contact_urgence_nom && `${child.contact_urgence_nom} (${child.contact_urgence_lien||''}) ${child.contact_urgence_telephone||''}`],
  ])

  section('Santé', [
    ['Allergies', child.allergie],
    ['Traitement', child.traitement_medicamenteux ? (child.details_traitement || 'Oui') : null],
    ['Infos médicales', child.infos_medicales],
    ['Suivi pro.', child.suivi_professionnel],
  ])

  if (child.besoins_specifiques) {
    section('Besoins spécifiques (TSA / TDAH)', [
      ['Centres d\'intérêt', child.centres_interet],
      ['Activités aimées', child.activites_aimees],
      ['À éviter', child.activites_a_eviter],
      ['Déclencheurs', child.declencheurs_crise],
      ['Signes avant-crise', child.signes_avant_crise],
      ['Hypersensibilités', child.hypersensibilites],
      ['Hyposensibilités', child.hyposensibilites],
      ['Apaisement', child.methodes_apaisement],
      ['Protocole urgence', child.protocole_urgence],
      ['Communication', { verbal:'Verbal', pictogrammes:'Pictogrammes', mixte:'Mixte', lsf:'LSF', autre:'Autre' }[child.mode_communication]],
      ['Consignes com.', child.consignes_communication],
    ])
  }

  section('Autorisations', [
    ['Sortie', child.autorisation_sortie ? 'Oui' : 'Non'],
    ['Photo', child.autorisation_photo ? 'Oui' : 'Non'],
  ])

  doc.setTextColor(...MUTED)
  doc.setFont('helvetica', 'italic')
  doc.setFontSize(7.5)
  doc.text(`Document confidentiel (données de santé) · généré le ${new Date().toLocaleDateString('fr-FR')}`, 14, y + 4)

  footer(doc)
  doc.save(`Dossier_${child.prenom}_${child.nom}.pdf`)
}

// Helpers
function fmtDate(d) {
  if (!d) return '-'
  const s = String(d)
  return new Date(s + (s.includes('T') ? '' : 'T00:00:00')).toLocaleDateString('fr-FR')
}
function age(dob) {
  const diff = Date.now() - new Date(dob).getTime()
  return Math.floor(diff / 31557600000)
}
function heuresEntre(hd, hf) {
  if (!hd || !hf) return '0'
  const [h1, m1] = hd.split(':').map(Number)
  const [h2, m2] = hf.split(':').map(Number)
  let d = (h2 * 60 + m2) - (h1 * 60 + m1)
  if (d < 0) d += 24 * 60
  return (d / 60).toFixed(1).replace('.', ',')
}
