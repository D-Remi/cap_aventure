// Seuils et règles de la micro-entreprise utilisés par le back-office.
// À vérifier chaque année sur autoentrepreneur.urssaf.fr et impots.gouv.fr.

// Plafond de chiffre d'affaires micro-entreprise, prestations de services (2026-2028)
export const PLAFOND_MICRO_SERVICES = 83600

// Franchise en base de TVA, prestations de services (seuil et seuil majoré)
export const SEUIL_TVA = 37500
export const SEUIL_TVA_MAJORE = 41250

// Compte bancaire dédié obligatoire si le CA dépasse ce montant deux années civiles de suite
export const SEUIL_COMPTE_DEDIE = 10000

// Date limite d'envoi des attestations fiscales annuelles aux clients (modèle service-public.fr)
export const ATTESTATION_AVANT = '31 mars'

// Modes de paiement qui n'ouvrent pas droit au crédit d'impôt pour le client
export const MODES_SANS_AVANTAGE_FISCAL = ['especes']
