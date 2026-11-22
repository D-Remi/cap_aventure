// Ouvre la fenêtre « Réserver un appel » depuis n'importe quelle page ou composant.
// La fenêtre est montée une seule fois dans App (RendezVousModal) et écoute cet événement.
export const EVENEMENT_RDV = 'ev:rendez-vous'

export function ouvrirRendezVous() {
  window.dispatchEvent(new CustomEvent(EVENEMENT_RDV))
}
