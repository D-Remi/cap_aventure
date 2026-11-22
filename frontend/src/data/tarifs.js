// Tarifs 2026 (TTC, TVA non applicable, art. 293 B du CGI). Source unique pour le simulateur.
// La grille affichée sur /tarifs (ServicesPage) doit rester cohérente avec ces valeurs.
export const TARIFS = {
  abonnement: 40,      // € / h, même créneau chaque semaine, engagement 3 mois
  ponctuel: 45,        // € / h, minimum 3 h, réservé 48 h avant
  journee: 340,        // 8 h
  soiree: 260,         // 18 h → 9 h
  weekend: 790,        // samedi 9 h → dimanche 18 h
  enfantSup: 8,        // € / h par enfant en plus
  forfaitSuisse: 40,   // € par venue à Genève ou dans le canton de Vaud
  minSuisseHeures: 4,
}

// Crédit d'impôt services à la personne (art. 199 sexdecies du CGI) : 50 % des dépenses retenues.
// Plafond : 12 000 € + 1 500 € par enfant à charge, dans la limite de 15 000 €,
// ou 20 000 € si un membre du foyer est invalide ou si un enfant ouvre droit au complément d'AEEH.
export function plafondCredit({ enfants = 1, aeeh = false }) {
  if (aeeh) return 20000
  return Math.min(12000 + 1500 * enfants, 15000)
}

export const euros = (n, dec = 0) =>
  `${Number(n).toLocaleString('fr-FR', { minimumFractionDigits: dec, maximumFractionDigits: dec })} €`
