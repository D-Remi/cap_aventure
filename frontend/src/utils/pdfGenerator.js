import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

const NUIT   = [45, 58, 107]
const SAUGE  = [74, 122, 109]
const MUTED  = [120, 120, 120]

// En-tête commun
function header(doc, sousTitre) {
  doc.setFillColor(...NUIT)
  doc.rect(0, 0, 210, 32, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(20)
  doc.text('Éduc & Vous', 14, 16)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.text('Relais à la journée et accompagnement éducatif • Gironde (33)', 14, 23)
  doc.setFontSize(8)
  doc.text('Éducateur en lieu de vie', 14, 28)
  if (sousTitre) {
    doc.setTextColor(...SAUGE)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(13)
    doc.text(sousTitre, 196, 20, { align: 'right' })
  }
}

function footer(doc) {
  const h = doc.internal.pageSize.height
  doc.setDrawColor(220, 220, 220)
  doc.line(14, h - 18, 196, h - 18)
  doc.setTextColor(...MUTED)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(7.5)
  doc.text('Éduc & Vous • Gironde (33) • Virement et CESU acceptés • SIRET : __________', 105, h - 13, { align: 'center' })
  doc.text('Service à la personne — crédit d\'impôt 50% (art. 199 sexdecies CGI)', 105, h - 9, { align: 'center' })
}

// ══════════ FACTURE ══════════
export function genererFacturePDF(facture, contrat, user, seances = []) {
  const doc = new jsPDF()
  header(doc, 'FACTURE')

  doc.setTextColor(...MUTED)
  doc.setFontSize(9)
  doc.text(`N° ${facture.numero}`, 196, 27, { align: 'right' })

  // Émetteur / Client
  let y = 44
  doc.setTextColor(...NUIT)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(9)
  doc.text('ÉMETTEUR', 14, y)
  doc.text('CLIENT', 110, y)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(60, 60, 60)
  doc.text(['Éduc & Vous', 'Gironde (33)', 'contact@educetvous33.fr'], 14, y + 5)
  doc.text([
    `${user?.prenom || ''} ${user?.nom || ''}`.trim(),
    user?.email || '',
    user?.telephone || '',
  ].filter(Boolean), 110, y + 5)

  // Période
  y += 24
  doc.setFillColor(244, 240, 232)
  doc.rect(14, y, 182, 8, 'F')
  doc.setTextColor(...NUIT)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(9)
  const periode = `Période : ${fmtDate(facture.periode_debut)} au ${fmtDate(facture.periode_fin)}`
  doc.text(periode, 16, y + 5.5)

  // Tableau des séances
  y += 14
  const rows = seances.length > 0
    ? seances.map(s => [
        fmtDate(s.date),
        `${(s.heure_debut||'').slice(0,5)}–${(s.heure_fin||'').slice(0,5)}`,
        heuresEntre(s.heure_debut, s.heure_fin) + ' h',
        (parseFloat(s.km_aller||0) + parseFloat(s.km_retour||0)).toFixed(0) + ' km',
        parseFloat(s.montant_total||0).toFixed(2) + ' €',
      ])
    : [['—', '—', `${facture.total_heures} h`, `${facture.total_km} km`, `${parseFloat(facture.montant_total).toFixed(2)} €`]]

  autoTable(doc, {
    startY: y,
    head: [['Date', 'Horaire', 'Durée', 'Trajet', 'Montant']],
    body: rows,
    theme: 'striped',
    headStyles: { fillColor: SAUGE, textColor: 255, fontSize: 9, fontStyle: 'bold' },
    bodyStyles: { fontSize: 8.5, textColor: [60, 60, 60] },
    columnStyles: { 4: { halign: 'right', fontStyle: 'bold' } },
    margin: { left: 14, right: 14 },
  })

  // Totaux
  let yt = doc.lastAutoTable.finalY + 8
  const totaux = [
    ['Total heures', `${facture.total_heures} h × ${parseFloat(contrat?.tarif_horaire||0).toFixed(2)} €`, `${parseFloat(facture.montant_heures).toFixed(2)} €`],
    ['Indemnités km', `${facture.total_km} km × ${parseFloat(contrat?.tarif_km||0).toFixed(2)} €`, `${parseFloat(facture.montant_km).toFixed(2)} €`],
  ]
  doc.setFontSize(9)
  totaux.forEach(([label, detail, montant]) => {
    doc.setTextColor(...MUTED)
    doc.setFont('helvetica', 'normal')
    doc.text(label, 120, yt)
    doc.setFontSize(7.5)
    doc.text(detail, 120, yt + 3.5)
    doc.setFontSize(9)
    doc.setTextColor(60, 60, 60)
    doc.text(montant, 196, yt, { align: 'right' })
    yt += 9
  })

  // Total TTC
  doc.setFillColor(...NUIT)
  doc.rect(118, yt, 78, 11, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(11)
  doc.text('TOTAL', 121, yt + 7)
  doc.text(`${parseFloat(facture.montant_total).toFixed(2)} €`, 193, yt + 7, { align: 'right' })

  // Mention CESU
  yt += 20
  doc.setTextColor(...SAUGE)
  doc.setFont('helvetica', 'italic')
  doc.setFontSize(8.5)
  doc.text('Règlement par CESU ou virement bancaire. TVA non applicable, art. 293 B du CGI.', 14, yt)

  footer(doc)
  doc.save(`Facture_${facture.numero}.pdf`)
}

// ══════════ DOSSIER ENFANT ══════════
export function genererDossierEnfantPDF(child) {
  const doc = new jsPDF()
  header(doc, 'DOSSIER')

  let y = 44
  doc.setTextColor(...NUIT)
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
    doc.setFillColor(244, 240, 232)
    doc.rect(14, y, 182, 7, 'F')
    doc.setTextColor(...SAUGE)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(9.5)
    doc.text(titre, 16, y + 5)
    y += 11
    items.forEach(([label, val]) => {
      if (y > 270) { doc.addPage(); y = 20 }
      doc.setTextColor(...NUIT)
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
  doc.text(`Document confidentiel — généré le ${new Date().toLocaleDateString('fr-FR')}`, 14, y + 4)

  footer(doc)
  doc.save(`Dossier_${child.prenom}_${child.nom}.pdf`)
}

// Helpers
function fmtDate(d) {
  if (!d) return '—'
  return new Date(d + (d.includes('T') ? '' : 'T00:00:00')).toLocaleDateString('fr-FR')
}
function age(dob) {
  const diff = Date.now() - new Date(dob).getTime()
  return Math.floor(diff / 31557600000)
}
function heuresEntre(hd, hf) {
  if (!hd || !hf) return '0'
  const [h1, m1] = hd.split(':').map(Number)
  const [h2, m2] = hf.split(':').map(Number)
  return (((h2*60+m2) - (h1*60+m1)) / 60).toFixed(1)
}