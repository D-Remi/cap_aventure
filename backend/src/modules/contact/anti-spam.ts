// Filtre anti-robots du formulaire de contact.
// - « bloquer » : robot certain (champ piège rempli, formulaire rempli trop vite).
//   La demande n'est pas enregistrée, mais le robot reçoit une réponse normale.
// - « raison » : demande suspecte. Elle est gardée dans « Indésirables », sans email de notification,
//   et peut être remise dans les demandes normales depuis le back-office.

export const DUREE_MIN_MS = 3000

// Extensions de domaine très utilisées pour les adresses jetables et le spam
const EXTENSIONS_SUSPECTES = [
  '.my.id', '.biz.id', '.web.id', '.online', '.xyz', '.top', '.click', '.site', '.icu', '.buzz',
  '.monster', '.cfd', '.sbs', '.lol', '.rest', '.bond', '.ru', '.cn', '.tk', '.ml', '.ga', '.cf', '.gq',
]

// Services d'adresses jetables les plus courants
const DOMAINES_JETABLES = [
  'yopmail.com', 'yopmail.fr', 'yopmail.net', 'mailinator.com', 'guerrillamail.com', 'guerrillamail.info',
  'sharklasers.com', 'grr.la', '10minutemail.com', '10minutemail.net', 'temp-mail.org', 'tempmail.com',
  'tempmail.net', 'trashmail.com', 'trashmail.de', 'getnada.com', 'dispostable.com', 'maildrop.cc',
  'throwawaymail.com', 'mohmal.com', 'emailondeck.com', 'fakeinbox.com', 'spamgourmet.com', 'tempr.email',
  'discard.email', 'mailnesia.com', 'mintemail.com', 'jetable.org', 'mail-temp.com', 'minuteinbox.com',
]

const LIEN = /https?:\/\/|www\./i
const ECRITURE_ETRANGERE = /[Ѐ-ӿ؀-ۿ฀-๿぀-ヿ一-鿿가-힯]/
const MOTS_SPAM = /\b(seo|backlinks?|r[ée]f[ée]rencement|crypto|bitcoin|casino|forex|viagra|guest ?post)\b/i

export interface FormulaireContact {
  prenom?: string
  nom?: string
  email?: string
  message?: string
  site_web?: string
  duree?: number
}

export function analyserContact(f: FormulaireContact): { bloquer: boolean; raison?: string } {
  if (f.site_web && f.site_web.trim()) return { bloquer: true }
  if (typeof f.duree === 'number' && f.duree < DUREE_MIN_MS) return { bloquer: true }

  const email = String(f.email || '').toLowerCase().trim()
  const domaine = email.split('@')[1] || ''
  const texte = [f.prenom, f.nom, f.message].filter(Boolean).join('\n')

  if (typeof f.duree !== 'number') return { bloquer: false, raison: 'Envoyée sans passer par le formulaire du site' }
  if (LIEN.test(texte)) return { bloquer: false, raison: 'Contient un lien vers un autre site' }
  if (DOMAINES_JETABLES.includes(domaine)) return { bloquer: false, raison: `Adresse email jetable (${domaine})` }
  if (EXTENSIONS_SUSPECTES.some(ext => domaine.endsWith(ext))) return { bloquer: false, raison: `Adresse email sur un domaine douteux (${domaine})` }
  if (ECRITURE_ETRANGERE.test(texte)) return { bloquer: false, raison: 'Écrite dans un alphabet étranger' }
  if (MOTS_SPAM.test(texte)) return { bloquer: false, raison: 'Contient des mots typiques du spam' }
  return { bloquer: false }
}
