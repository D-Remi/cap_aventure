// Clients types : à qui parle chaque publication, ce qui les inquiète, ce qui les convainc, des accroches prêtes.
export const CIBLES = {
  parent: {
    label: 'Parent épuisé, côté France',
    qui: "Parent d'un enfant autiste, TDAH ou en situation de handicap, dans le Chablais. Souvent seul face aux crises, il culpabilise de vouloir souffler.",
    craintes: "Confier son enfant à quelqu'un qui ne saura pas gérer une crise ; le prix ; être jugé.",
    convainc: "Ton expérience concrète (séjours adaptés, centre d'éducation motrice), la préparation avec la fiche de l'enfant, le prix réel après crédit d'impôt.",
    ou: 'Groupes Facebook de parents du Chablais, groupes autisme et TDAH, Instagram le soir.',
    quand: 'Le soir, une fois les enfants couchés (20 h 30 à 22 h), et le dimanche matin.',
    tags: ['repit', 'local'],
    accroches: [
      "Vous n'êtes pas un mauvais parent. Vous êtes fatigué.",
      "Et si quelqu'un savait vraiment s'occuper de votre enfant, même pendant une crise ?",
      'Quand avez-vous dormi une nuit complète pour la dernière fois ?',
      "Un éducateur à 20 € de l'heure : oui, c'est possible.",
      'Les 3 choses que je fais avant chaque première garde.',
    ],
  },
  frontalier: {
    label: 'Frontalier pressé',
    qui: "Parent qui habite le Chablais et travaille à Genève ou Lausanne. Départ très tôt, retour tard, bouchons à la douane : il lui faut quelqu'un de fiable sur des horaires larges.",
    craintes: 'Les retards, les imprévus, une garde qui annule au dernier moment.',
    convainc: "Les horaires de 6 h 30 à 20 h 30, la fiabilité, le crédit d'impôt même avec un salaire suisse (sous conditions).",
    ou: 'Groupes Facebook de frontaliers, pages du Groupement transfrontalier européen, LinkedIn.',
    quand: 'Tôt le matin dans les transports (6 h 30 à 8 h) ou le soir (19 h à 21 h).',
    tags: ['frontalier', 'local'],
    accroches: [
      'Frontaliers : la douane est bouchée, mais vos enfants sont gardés.',
      'Payé en Suisse, vous avez quand même droit au crédit d\'impôt (sous conditions).',
      "6 h 30 – 20 h 30 : vos horaires, pas ceux d'une crèche.",
      'Bateau CGN en retard ? Je reste jusqu\'à votre retour.',
    ],
  },
  suisse: {
    label: 'Famille à Genève ou Vaud (dont expatriés)',
    qui: "Famille qui habite à Genève, Nyon, Lausanne ou Montreux, souvent internationale. Elle cherche une personne formée pour les soirées, les relâches ou les vacances.",
    craintes: 'Trouver quelqu\'un de qualifié, qui parle anglais, disponible pendant les vacances.',
    convainc: "Les gardes ponctuelles chez elle, ton expérience avec les enfants autistes, la possibilité de garder au chalet. Réserver 8 jours avant.",
    ou: "Groupes Facebook de parents et d'expatriés à Genève et Lausanne, Instagram.",
    quand: 'Le soir en semaine et le samedi matin.',
    tags: ['suisse', 'garde'],
    accroches: [
      'Genève, Nyon, Lausanne : je viens chez vous pour les soirées et les relâches.',
      'Special needs childcare in Geneva and Vaud: evenings, weekends, school holidays.',
      'Relâches de février : réservez votre journée de répit 8 jours avant.',
      'Votre enfant est autiste ? Je le garde chez vous, à son rythme.',
    ],
  },
  pro: {
    label: 'Professionnel qui oriente les familles',
    qui: 'Orthophoniste, psychomotricien, psychologue, pédiatre, équipe de SESSAD ou de CAMSP, enseignant référent. Il voit des familles épuisées sans solution de relais.',
    craintes: "Recommander quelqu'un de peu sérieux ; perdre du temps.",
    convainc: 'Ton parcours, ta méthode (fiche, préparation, retour aux parents), un moyen simple d\'orienter : le lien de réservation.',
    ou: 'LinkedIn, pages Facebook des associations, et surtout le contact direct (radar, plaquette).',
    quand: 'En semaine, entre midi et deux ou en fin de journée.',
    tags: ['repit'],
    accroches: [
      'Orthophonistes, psychomotriciens : vos familles ont besoin de souffler.',
      'Une famille épuisée en face de vous ? Voici à qui la confier.',
      'Ce que je fais pendant une garde, et ce que je vous transmets.',
    ],
  },
  chalet: {
    label: 'Famille en vacances au chalet',
    qui: 'Famille (française, suisse ou étrangère) en séjour à Châtel, Morzine, Les Gets ou Abondance, qui veut skier pendant que l\'enfant est gardé.',
    craintes: 'Laisser son enfant à un inconnu en vacances ; trouver quelqu\'un à la dernière minute.',
    convainc: "La garde au chalet, l'expérience des enfants à besoins particuliers, la disponibilité pendant les vacances.",
    ou: 'Groupes Facebook de locations et bons plans des stations, offices de tourisme.',
    quand: 'Deux à trois semaines avant les vacances scolaires françaises et suisses.',
    tags: ['local', 'garde'],
    accroches: [
      'Vous skiez, je garde votre enfant au chalet.',
      'Vacances à Châtel ou Morzine : une journée de répit sur les pistes.',
      'Votre enfant a des besoins particuliers ? Les vacances aussi peuvent être reposantes.',
    ],
  },
}

// Note d'une légende : critères simples qui font la différence sur Instagram et Facebook
export function noterPost(texte) {
  const t = String(texte || '')
  const lignes = t.split('\n').map(l => l.trim()).filter(Boolean)
  const premiere = lignes[0] || ''
  const corps = t.replace(/#[\p{L}\p{N}_]+/gu, '').trim()
  const hashtags = (t.match(/#[\p{L}\p{N}_]+/gu) || []).length
  const points = [
    {
      ok: premiere.length > 0 && premiere.length <= 110,
      poids: 20,
      texte: 'Accroche courte en première ligne',
      conseil: "La première ligne est la seule visible avant « voir plus » : une phrase courte, une question ou un chiffre.",
    },
    {
      ok: /\?|!|\d/.test(premiere) || /\p{Extended_Pictographic}/u.test(premiere),
      poids: 10,
      texte: 'Accroche qui interpelle (question, chiffre ou émotion)',
      conseil: 'Pose une question à laquelle le parent répond « oui » dans sa tête.',
    },
    {
      ok: /\+33|0[67][\s.]?\d|rendez-vous|message|écrivez|appel|réserv|\{tel\}/i.test(t),
      poids: 20,
      texte: 'Une action claire à la fin',
      conseil: 'Termine par une seule action : réserver un appel (lien en bio), écrire en message privé ou appeler.',
    },
    {
      ok: /thonon|[ée]vian|chablais|l[ée]man|gen[èe]ve|lausanne|vaud|haute-savoie|nyon|montreux|morzine|ch[âa]tel/i.test(corps),
      poids: 10,
      texte: 'Un lieu cité',
      conseil: 'Cite au moins une ville : les parents se sentent concernés, et la recherche locale te trouve.',
    },
    {
      ok: corps.length >= 250 && corps.length <= 1800,
      poids: 10,
      texte: 'Longueur adaptée (250 à 1 800 caractères)',
      conseil: corps.length < 250 ? 'Un peu court : ajoute un exemple concret ou une astuce.' : 'Un peu long : coupe ce qui n\'aide pas le parent.',
    },
    {
      ok: /\n\s*\n/.test(t),
      poids: 10,
      texte: 'Texte aéré en petits paragraphes',
      conseil: 'Saute une ligne entre les idées : sur téléphone, un bloc compact n\'est pas lu.',
    },
    {
      ok: hashtags >= 3 && hashtags <= 5,
      poids: 10,
      texte: `3 à 5 hashtags précis (${hashtags})`,
      conseil: hashtags > 5 ? 'Instagram recommande 3 à 5 hashtags précis : clique sur « Mettre les 5 hashtags de cette cible ».' : 'Ajoute quelques hashtags locaux (#Thonon #Chablais #Geneve).',
    },
    {
      ok: !/cr[ée]dit d.imp[ôo]t/i.test(t) || /sous conditions/i.test(t),
      poids: 10,
      texte: "« Sous conditions » si tu parles du crédit d'impôt",
      conseil: "Obligatoire : le crédit d'impôt dépend de la situation de chaque foyer.",
    },
  ]
  const note = points.reduce((n, p) => n + (p.ok ? p.poids : 0), 0)
  const lien = /educetvous74\.fr\/\S+/.test(t)
  return { note, points, lien }
}
