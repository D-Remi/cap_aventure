// Textes prêts à publier sur Instagram et Facebook.
// {tel} et {site} sont remplacés automatiquement.

export const HASHTAGS = {
  local: '#Thonon #Evian #Chablais #HauteSavoie #Leman #Publier #Sciez #Douvaine',
  repit: '#repit #aidantfamilial #parentsepuises #handicap #autisme #TSA #TDAH #parentalite',
  garde: '#gardedenfants #babysitting #educateur #relaisparental',
  frontalier: '#frontalier #frontaliers #Geneve #Lausanne #Valais #travailleurfrontalier',
  suisse: '#Geneve #Lausanne #Nyon #Vevey #Montreux #Monthey #SuisseRomande #VaudGeneve',
}

export const THEMES = {
  presentation: {
    label: 'Je me présente',
    titre: 'Un éducateur pour garder votre enfant',
    hashtags: ['local', 'garde', 'repit'],
    versions: [
      "Bonjour, moi c'est Rémi 👋\n\nAccompagnant éducatif dans le Chablais, je garde les enfants à besoins particuliers chez eux : autisme, TDAH, handicap, troubles du comportement, ou simplement une fratrie nombreuse.\n\nMon métier, c'est de permettre aux parents de souffler, en sachant leur enfant entre de bonnes mains.\n\nPremier échange gratuit : {tel}\n{site}",
      "Pourquoi « Éduc & Vous » ?\n\nParce que beaucoup de familles me disent la même chose : « Personne ne peut garder mon enfant. »\n\nSéjours adaptés, centre d'éducation motrice, collège : j'ai l'habitude des enfants que les baby-sitters refusent. Je viens chez vous, je prépare chaque garde avec vous, et je vous raconte tout à votre retour.\n\nÉcrivez-moi : {tel}",
    ],
  },
  repit: {
    label: 'Le répit',
    titre: 'Vous avez le droit de souffler',
    hashtags: ['local', 'repit'],
    versions: [
      "Quand avez-vous eu une soirée rien qu'à vous pour la dernière fois ?\n\nSi vous ne vous en souvenez pas, ce message est pour vous. Le répit n'est pas un luxe : c'est ce qui permet de tenir sur la durée.\n\nUn créneau chaque semaine, une journée, ou un week-end : je prends le relais chez vous, à Thonon, Évian et dans tout le Chablais.\n\n{site}",
      "« Vous n'êtes pas un mauvais parent. Vous êtes fatigué, et vous cherchez des réponses. »\n\nJe l'entends souvent, et je le redis à chaque famille. Demander de l'aide, c'est prendre soin de votre enfant aussi.\n\nPremier échange gratuit et sans engagement : {tel}",
    ],
  },
  prix: {
    label: 'Le prix réel',
    titre: '20 € de l\'heure, vraiment',
    hashtags: ['local', 'garde'],
    versions: [
      "Combien coûte une garde avec un éducateur ?\n\n40 € de l'heure en abonnement… mais avec le crédit d'impôt de 50 % déduit tout de suite (avance immédiate URSSAF), vous payez réellement 20 € de l'heure.*\n\nCe n'est pas plus cher qu'une baby-sitter déclarée, et votre enfant est gardé par quelqu'un de formé.\n\nTous les tarifs : {site}/tarifs\n\n*Crédit d'impôt sous conditions, dans la limite des plafonds annuels.",
    ],
  },
  frontaliers: {
    label: 'Frontaliers',
    titre: 'Vous travaillez en Suisse ?',
    hashtags: ['local', 'frontalier', 'garde'],
    versions: [
      "Frontaliers du Chablais, ce post est pour vous 🇨🇭🇫🇷\n\nDépart à 6 h 30, douane bouchée, bateau CGN en retard le soir… Je garde votre enfant chez vous de 6 h 30 à 20 h 30 et je reste jusqu'à votre retour.\n\nVous habitez en France ? Vous avez droit au crédit d'impôt de 50 %, même avec un salaire suisse.*\n\n{site}/frontaliers-suisse\n\n*Sous conditions, pour les résidents fiscaux en France.",
      "Vous avez un chalet à Châtel, Morzine ou Abondance ?\n\nPendant vos relâches, je peux garder votre enfant au chalet, y compris s'il a des besoins particuliers. Vos vacances, enfin reposantes.\n\nRéservez tôt : {tel}",
    ],
  },
  conseil: {
    label: 'Conseil éducatif',
    titre: 'Préparer une première garde',
    hashtags: ['repit', 'local'],
    versions: [
      "3 choses à préparer avant de confier un enfant autiste à quelqu'un de nouveau :\n\n1. Une fiche simple : ce qui l'apaise, ce qui le déclenche, ses mots ou ses signes.\n2. Une première rencontre courte, en votre présence.\n3. Ses objets rassurants, toujours au même endroit.\n\nC'est exactement ce que je fais avant chaque première garde.\n\nD'autres questions ? Écrivez-moi en message privé.",
      "Une crise n'est pas un caprice.\n\nChez un enfant TSA ou TDAH, c'est souvent un trop-plein : bruit, fatigue, changement imprévu. Ce qui aide : baisser la stimulation, peu de mots, un endroit calme, et attendre que ça redescende avant d'en parler.\n\nVous avez une astuce qui marche chez vous ? Partagez-la en commentaire 👇",
    ],
  },
  disponibilites: {
    label: 'Disponibilités',
    titre: 'Créneaux disponibles',
    hashtags: ['local', 'garde'],
    versions: [
      "Il me reste quelques créneaux 📅\n\n• Mercredi après-midi\n• Samedi matin\n• Fin de journée en semaine\n\nGarde à domicile à Thonon, Évian et dans le Chablais, y compris pour les enfants à besoins particuliers.\n\nPremier échange gratuit : {tel}",
    ],
  },
  rentree: {
    label: 'Rentrée / vacances',
    titre: 'Préparez la rentrée sereinement',
    hashtags: ['local', 'garde', 'repit'],
    versions: [
      "La rentrée, c'est le moment de caler l'année.\n\nUn créneau fixe chaque semaine, c'est la même personne pour votre enfant, des repères qui s'installent, et pour vous un temps qui revient chaque semaine sans avoir à vous organiser.\n\nIl reste quelques places pour l'année : {tel}",
      "Vacances scolaires : besoin d'un relais ?\n\nJournées répit, sorties nature à leur rythme, temps calmes à la maison. Je viens chez vous, dans le Chablais et en station.\n\nRéservations : {tel}",
    ],
  },
}

export const COULEURS = { foret: '#0B2A22', vert: '#136F5B', citron: '#C8F169', brume: '#EEF4F1', blanc: '#FFFFFF' }

export const FORMATS = {
  portrait: { label: 'Instagram portrait (1080 × 1350)', w: 1080, h: 1350 },
  carre: { label: 'Carré (1080 × 1080)', w: 1080, h: 1080 },
  story: { label: 'Story / Reel (1080 × 1920)', w: 1080, h: 1920 },
}

export const MODELES = {
  photo: 'Photo + titre',
  citation: 'Citation',
  prix: 'Prix réel',
  dispo: 'Disponibilités',
  conseil: 'Conseil',
}
