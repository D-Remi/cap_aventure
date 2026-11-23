// Plaquettes A4 à imprimer ou à joindre aux emails : version « professionnels » et version « familles ».
import jsPDF from 'jspdf'
import { TEL_AFFICHE, EMAIL } from '../data/contact'

const C = { foret: [11, 42, 34], vert: [19, 111, 91], citron: [200, 241, 105], brume: [238, 244, 241], encre: [15, 26, 23], doux: [85, 102, 95] }
const SITE = 'educetvous74.fr'

function bandeau(doc, titre, sousTitre) {
  doc.setFillColor(...C.foret); doc.rect(0, 0, 210, 74, 'F')
  doc.setFillColor(...C.citron); doc.circle(196, 8, 30, 'F')
  doc.setFont('helvetica', 'bold'); doc.setFontSize(15); doc.setTextColor(255, 255, 255)
  doc.text('Éduc', 18, 18)
  doc.setTextColor(...C.citron); doc.text(' & Vous', 18 + doc.getTextWidth('Éduc'), 18)
  doc.setFontSize(23); doc.setTextColor(255, 255, 255)
  doc.text(doc.splitTextToSize(titre, 165), 18, 36)
  doc.setFont('helvetica', 'normal'); doc.setFontSize(11); doc.setTextColor(198, 216, 208)
  doc.text(doc.splitTextToSize(sousTitre, 170), 18, 62)
}

function bloc(doc, x, y, largeur, titre, lignes) {
  doc.setFont('helvetica', 'bold'); doc.setFontSize(12.5); doc.setTextColor(...C.vert)
  doc.text(titre, x, y)
  let yy = y + 6.5
  doc.setFont('helvetica', 'normal'); doc.setFontSize(10.2); doc.setTextColor(...C.encre)
  lignes.forEach(l => {
    const t = doc.splitTextToSize(l, largeur - 5)
    doc.setFillColor(...C.vert); doc.circle(x + 1.2, yy - 1.2, 0.9, 'F')
    doc.text(t, x + 4.5, yy)
    yy += t.length * 4.6 + 1.8
  })
  return yy
}

function encadreContact(doc, y, titre, texte) {
  doc.setFillColor(...C.brume); doc.roundedRect(15, y, 180, 46, 4, 4, 'F')
  doc.setFont('helvetica', 'bold'); doc.setFontSize(14); doc.setTextColor(...C.foret)
  doc.text(titre, 22, y + 11)
  doc.setFont('helvetica', 'normal'); doc.setFontSize(10.2); doc.setTextColor(...C.doux)
  doc.text(doc.splitTextToSize(texte, 166), 22, y + 18)
  doc.setFont('helvetica', 'bold'); doc.setFontSize(15); doc.setTextColor(...C.vert)
  doc.text(`${SITE}/rendez-vous`, 22, y + 34)
  doc.setFontSize(12); doc.setTextColor(...C.foret)
  doc.text(`${TEL_AFFICHE}  ·  ${EMAIL}`, 22, y + 41)
}

function pied(doc, ent) {
  const ident = [
    [ent.prenom, ent.nom].filter(Boolean).join(' ') ? `${[ent.prenom, ent.nom].filter(Boolean).join(' ')} EI` : null,
    ent.siret ? `SIRET ${ent.siret}` : null,
    ent.sap_numero ? `Déclaration SAP n° ${ent.sap_numero}` : null,
  ].filter(Boolean).join(' · ')
  doc.setFont('helvetica', 'normal'); doc.setFontSize(7.6); doc.setTextColor(...C.doux)
  const mentions = "Crédit d'impôt de 50 % des sommes versées pour les services à la personne, sous conditions (article 199 sexdecies du CGI), pour les foyers résidents fiscaux en France, dans la limite des plafonds annuels. Prix TTC, TVA non applicable (article 293 B du CGI)."
  doc.text(doc.splitTextToSize(mentions, 180), 15, 280)
  if (ident) doc.text(ident, 15, 290)
}

export function plaquetteProfessionnels(ent = {}) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' })
  bandeau(doc, 'Un relais à domicile pour les familles que vous accompagnez',
    "Garde et répit pour les enfants autistes, TDAH, en situation de handicap ou avec troubles du comportement. Chablais, Genève et canton de Vaud.")

  let g = bloc(doc, 15, 88, 88, 'Pour qui', [
    "Enfants et adolescents avec TSA, TDAH, troubles DYS, troubles du comportement, handicap moteur ou polyhandicap.",
    'Leurs frères et sœurs, gardés en même temps.',
    "Des parents épuisés qui n'ont personne pour prendre le relais.",
  ])
  g = bloc(doc, 15, g + 5, 88, 'Ce que je propose', [
    'Garde chez la famille : quelques heures, une journée, chaque semaine.',
    'Soirée avec la nuit, week-end de répit, vacances scolaires.',
    'Gardes tôt le matin et tard le soir pour les frontaliers.',
    "Rencontre de préparation offerte, fiche de l'enfant, retour détaillé après chaque garde.",
  ])
  let d = bloc(doc, 110, 88, 85, 'Mon parcours', [
    'Animateur de séjours adaptés (APAJH) avec des enfants autistes.',
    "Aide médico-psychologique en centre d'éducation motrice (paralysie cérébrale).",
    "Assistant d'éducation en collège, accompagnant en lieu de vie.",
    "BAFA, attestation d'honorabilité, permis B.",
  ])
  d = bloc(doc, 110, d + 5, 85, 'Pour les familles', [
    "40 € de l'heure en abonnement, soit 20 € après le crédit d'impôt de 50 % (sous conditions).",
    'Paiement possible en CESU préfinancé.',
    'Zone : Thonon, Évian et tout le Chablais ; Genève et Vaud en gardes ponctuelles.',
  ])
  encadreContact(doc, Math.max(g, d) + 8, 'Orienter une famille',
    "Donnez-lui simplement ce lien : elle choisit un créneau et je la rappelle, gratuitement et sans engagement. Je peux aussi passer vous présenter mon travail.")
  pied(doc, ent)
  doc.save('educetvous-plaquette-professionnels.pdf')
}

export function plaquetteFamilles(ent = {}) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' })
  bandeau(doc, 'Votre enfant a des besoins particuliers. Vous avez le droit de souffler.',
    "Je garde votre enfant chez vous, dans ses repères : autisme, TDAH, handicap, troubles du comportement, ou fratrie nombreuse.")

  let g = bloc(doc, 15, 88, 88, 'Comment ça se passe', [
    'Un premier appel gratuit de 30 minutes.',
    'Une rencontre de préparation offerte, chez vous, avec votre enfant.',
    'Des premières gardes courtes, à son rythme.',
    'Après chaque garde, je vous raconte tout.',
  ])
  g = bloc(doc, 15, g + 5, 88, 'Qui je suis', [
    "Rémi, accompagnant éducatif : séjours adaptés avec des enfants autistes, centre d'éducation motrice, collège, internat.",
    "BAFA, attestation d'honorabilité.",
  ])
  let d = bloc(doc, 110, 88, 85, 'Les formules', [
    "Chaque semaine : 40 € de l'heure, soit 20 € après crédit d'impôt.",
    "Ponctuel : 45 € de l'heure, minimum 3 heures.",
    'Journée répit de 8 heures : 340 €, soit 170 € après crédit d\'impôt.',
    'Soirée et nuit : 260 €. Week-end : 790 €.',
  ])
  d = bloc(doc, 110, d + 5, 85, 'Où', [
    'Thonon, Évian et tout le Chablais, stations comprises.',
    'Genève et canton de Vaud : gardes ponctuelles, réservées 8 jours avant.',
  ])
  encadreContact(doc, Math.max(g, d) + 8, 'Premier appel gratuit',
    "Choisissez un moment en ligne, je vous rappelle. Ou appelez-moi, écrivez-moi sur WhatsApp au même numéro.")
  pied(doc, ent)
  doc.save('educetvous-plaquette-familles.pdf')
}
