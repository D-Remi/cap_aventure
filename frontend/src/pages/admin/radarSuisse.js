// Radar : emplois et structures où postuler en Suisse, annonces de familles côté suisse.
// Les sites d'emploi n'autorisent pas la récupération automatique : le radar ouvre les bonnes recherches.

export const CANTONS = {
  GE: { label: 'Genève', lieu: 'Genève' },
  VD: { label: 'Vaud', lieu: 'Lausanne' },
  VS: { label: 'Chablais valaisan', lieu: 'Monthey' },
}

export const METIERS = [
  'éducateur',
  'assistant socio-éducatif',
  'accompagnant socio-éducatif',
  'intervenant relève',
  'moniteur camp',
  'éducateur remplaçant',
  'veilleur de nuit',
  "garde d'enfants",
]

const q = encodeURIComponent

// Chaque site renvoie une recherche prête pour un métier et un lieu
export const SITES_EMPLOI = [
  { nom: 'jobup.ch', aide: 'Le n°1 en Suisse romande', url: (m, l) => `https://www.jobup.ch/fr/emplois/?term=${q(m)}&location=${q(l)}` },
  { nom: 'jobs.ch', aide: 'Le n°1 suisse', url: (m, l) => `https://www.jobs.ch/fr/offres-emplois/?term=${q(m)}&location=${q(l)}` },
  { nom: 'Indeed Suisse', aide: 'Regroupe beaucoup de petites structures', url: (m, l) => `https://ch-fr.indeed.com/jobs?q=${q(m)}&l=${q(l)}` },
  { nom: 'LinkedIn', aide: 'Grandes fondations et institutions', url: (m, l) => `https://www.linkedin.com/jobs/search/?keywords=${q(m)}&location=${q(l)}` },
  { nom: 'job-room.ch', aide: 'Site officiel du SECO (offices régionaux de placement)', url: () => 'https://www.job-room.ch/job-search' },
  { nom: 'educh.ch', aide: 'Le site d\'emploi du social et de l\'éducation en Suisse romande', url: () => 'https://www.educh.ch/emploi/' },
  { nom: 'sozialinfo.ch', aide: 'Portail suisse des métiers du social', url: () => 'https://www.sozialinfo.ch/arbeitsmarkt/stellenportal' },
]

// Structures du secteur où envoyer une candidature (spontanée ou sur offre)
export const STRUCTURES = [
  { nom: 'Pro Infirmis Genève', canton: 'GE', type: 'Service de relève', pourquoi: 'Relève à domicile auprès de familles d\'enfants en situation de handicap : exactement ton métier.' },
  { nom: 'Croix-Rouge genevoise', canton: 'GE', type: 'Garde d\'enfants, relève', pourquoi: 'Garde ponctuelle et d\'urgence à domicile (Chaperon Rouge).', lien: 'https://www.croix-rouge-ge.ch/emploi' },
  { nom: 'Fondation Clair Bois', canton: 'GE', type: 'Institution', pourquoi: 'Polyhandicap, enfants et adultes : ton expérience en centre d\'éducation motrice compte.' },
  { nom: 'Établissements publics pour l\'intégration (EPI)', canton: 'GE', type: 'Institution', pourquoi: 'Foyers et ateliers pour personnes en situation de handicap.' },
  { nom: 'Fondation Ensemble', canton: 'GE', type: 'Écoles et foyers', pourquoi: 'Enfants et adultes avec déficience intellectuelle.' },
  { nom: 'Office médico-pédagogique Genève', canton: 'GE', type: 'Enseignement spécialisé', pourquoi: 'Écoles et centres de jour de l\'État de Genève.' },
  { nom: 'Fondation officielle de la jeunesse', canton: 'GE', type: 'Foyers éducatifs', pourquoi: 'Foyers pour enfants et adolescents : proche de ton expérience en lieu de vie.' },
  { nom: 'Cerebral Genève', canton: 'GE', type: 'Relève, loisirs', pourquoi: 'Familles d\'enfants avec paralysie cérébrale.' },
  { nom: 'Insieme Genève', canton: 'GE', type: 'Loisirs, camps', pourquoi: 'Camps et sorties pour personnes avec déficience intellectuelle.' },
  { nom: 'Pro Infirmis Vaud', canton: 'VD', type: 'Service de relève', pourquoi: 'Service Phare : relève à domicile, en journée ou en soirée.' },
  { nom: 'Croix-Rouge vaudoise', canton: 'VD', type: 'Garde d\'enfants', pourquoi: 'Garde d\'enfants malades et soutien aux familles.' },
  { nom: 'Fondation de Verdeil', canton: 'VD', type: 'Enseignement spécialisé', pourquoi: 'Écoles et internats spécialisés dans tout le canton.' },
  { nom: 'Fondation Eben-Hézer', canton: 'VD', type: 'Institution', pourquoi: 'Accompagnement de personnes en situation de handicap, région lausannoise.' },
  { nom: 'Institution de Lavigny', canton: 'VD', type: 'Institution', pourquoi: 'Polyhandicap et épilepsie, avec un secteur enfants.' },
  { nom: 'Fondation de Vernand', canton: 'VD', type: 'Institution', pourquoi: 'Enfants et adultes avec déficience intellectuelle.' },
  { nom: 'Fondation Perceval', canton: 'VD', type: 'Institution', pourquoi: 'Lieu de vie et école pour personnes en situation de handicap.' },
  { nom: 'Insieme Vaud', canton: 'VD', type: 'Loisirs, camps', pourquoi: 'Camps de vacances : idéal avec ton expérience des séjours adaptés.' },
  { nom: 'Fondation Emera', canton: 'VS', type: 'Institution', pourquoi: 'Accompagnement des personnes en situation de handicap en Valais.' },
  { nom: 'La Castalie Monthey', canton: 'VS', type: 'Institution', pourquoi: 'À 30 minutes de Saint-Gingolph, dans le Chablais valaisan.' },
  { nom: 'Procap', canton: 'CH', type: 'Camps et voyages', pourquoi: 'Camps et voyages adaptés dans toute la Suisse, pendant les vacances.' },
]

export const lienOffres = (s) => s.lien || `https://www.google.com/search?q=${q(`${s.nom} offres d'emploi`)}`

// Annonces de familles qui habitent en Suisse
export const RECHERCHES_FAMILLES_CH = [
  ['Babysits', 'Familles qui cherchent une nounou à Genève', 'https://www.babysits.ch/nanny-jobs/geneve/'],
  ['Rockmybaby', 'Annonces de garde d\'enfants en Suisse', 'https://www.rockmybaby.ch/jobs'],
  ['Yoopies Suisse', 'Garde d\'enfants et baby-sitting', 'https://www.yoopies.ch/'],
  ['Indeed Suisse', 'Annonces « garde d\'enfants » à Genève', `https://ch-fr.indeed.com/jobs?q=${q("garde d'enfants")}&l=${q('Genève')}`],
  ['Indeed Suisse', 'Annonces « garde d\'enfants » à Lausanne', `https://ch-fr.indeed.com/jobs?q=${q("garde d'enfants")}&l=${q('Lausanne')}`],
  ['Facebook', 'Groupes de parents à Genève', `https://www.facebook.com/search/groups/?q=${q('parents Genève')}`],
  ['Facebook', 'Groupes de parents à Lausanne', `https://www.facebook.com/search/groups/?q=${q('parents Lausanne')}`],
]
