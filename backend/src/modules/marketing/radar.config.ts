// Radar clients : catégories de prescripteurs cherchées dans l'annuaire officiel des entreprises
// (API Recherche d'entreprises, recherche-entreprises.api.gouv.fr, gratuite et sans inscription).

// Codes postaux du Chablais et des stations voisines
export const CODES_POSTAUX_CHABLAIS = [
  '74200', // Thonon, Allinges, Anthy, Armoy, Margencel, Marin, Le Lyaud…
  '74500', // Évian, Publier, Amphion, Neuvecelle, Lugrin, Maxilly, Thollon, Bernex…
  '74140', // Douvaine, Sciez, Excenevex, Veigy…
  '74550', // Perrignier, Orcier, Draillant…
  '74890', // Bons-en-Chablais, Lully…
  '74470', // Bellevaux, Lullin…
  '74430', // Le Biot, Saint-Jean-d'Aulps…
  '74360', // Abondance, La Chapelle-d'Abondance
  '74390', // Châtel
  '74110', // Morzine, Avoriaz
  '74260', // Les Gets
]

export interface CategorieRadar {
  label: string
  aide: string
  naf?: string        // codes NAF séparés par des virgules
  motsCles?: string[] // recherche par nom (une requête par mot)
  zone: 'chablais' | 'departement'
}

export const CATEGORIES_RADAR: Record<string, CategorieRadar> = {
  reeducation: {
    label: 'Orthophonistes, psychomotriciens, ergothérapeutes',
    aide: 'Professionnels de la rééducation (code 86.90E, inclut aussi les kinés). Ils suivent les enfants TSA, TDAH, DYS chaque semaine.',
    naf: '86.90E', zone: 'chablais',
  },
  psychologues: {
    label: 'Psychologues et neuropsychologues',
    aide: 'Code 86.90F (autres professions de santé). Bilans et suivis d\'enfants à besoins spécifiques.',
    naf: '86.90F', zone: 'chablais',
  },
  pediatres: {
    label: 'Médecins spécialistes (pédiatres, pédopsychiatres…)',
    aide: 'Code 86.22C. Repère les pédiatres et pédopsychiatres dans la liste.',
    naf: '86.22C', zone: 'chablais',
  },
  generalistes: {
    label: 'Médecins généralistes',
    aide: 'Code 86.21Z. Souvent le premier contact des familles épuisées.',
    naf: '86.21Z', zone: 'chablais',
  },
  etablissements: {
    label: 'Établissements pour enfants handicapés (IME, SESSAD, CAMSP…)',
    aide: 'Codes 88.91B et 87.10B, dans toute la Haute-Savoie (les sièges sont souvent à Annecy).',
    naf: '88.91B,87.10B', zone: 'departement',
  },
  creches: {
    label: 'Crèches et micro-crèches',
    aide: 'Code 88.91A. Partenariat possible pour les gardes hors horaires ou les enfants qui ne trouvent pas de place.',
    naf: '88.91A', zone: 'chablais',
  },
  associations: {
    label: 'Associations autisme, handicap, TDAH, DYS',
    aide: 'Recherche par nom dans toute la Haute-Savoie : associations de parents et d\'entraide.',
    motsCles: ['autisme', 'handicap', 'tdah', 'dys', 'trisomie', 'polyhandicap', 'aidants'], zone: 'departement',
  },
}
