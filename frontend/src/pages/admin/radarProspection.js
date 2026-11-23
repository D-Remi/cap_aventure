// Prospection : priorités, messages prêts à envoyer, pistes pour trouver des clients vite.
import { TEL_AFFICHE } from '../../data/contact'

export const SITE = 'educetvous74.fr'
export const CANDIDATURE = 'Candidature Suisse'
export const OBJECTIF_DEFAUT = 10

const CHABLAIS_COEUR = /thonon|[ée]vian|publier|amphion|sciez|douvaine|anthy|margencel|allinges|neuvecelle|lugrin|maxilly|excenevex|armoy|lyaud|marin|perrignier|bons/i

// Plus le score est haut, plus le contact a de chances de t'envoyer des familles vite
const POIDS = [
  [/Orthophonistes|psychomotriciens|ergoth/i, 5],
  [/Établissements|IME|SESSAD|CAMSP/i, 5],
  [/Associations/i, 4],
  [/Psychologues/i, 4],
  [/spécialistes|pédiatres/i, 4],
  [/généralistes/i, 3],
  [/Crèches/i, 2],
]

export function score(p) {
  if (p.statut !== 'a_contacter' || p.categorie === CANDIDATURE) return -1
  let s = p.type === 'famille' ? 6 : (POIDS.find(([re]) => re.test(p.categorie || ''))?.[1] ?? 2)
  if (p.telephone || p.email) s += 1
  if (CHABLAIS_COEUR.test(p.ville || '')) s += 1
  return s
}

export const ajouterJours = (n) => {
  const d = new Date()
  d.setDate(d.getDate() + n)
  return d.toLocaleDateString('en-CA')
}

// Lundi de la semaine en cours (AAAA-MM-JJ)
export const debutSemaine = () => {
  const d = new Date()
  d.setDate(d.getDate() - ((d.getDay() + 6) % 7))
  return d.toLocaleDateString('en-CA')
}

// ── Messages prêts ──────────────────────────────────────────────
const SIGNATURE = `Rémi\nÉduc & Vous · accompagnant éducatif\n${TEL_AFFICHE} · ${SITE}`

const MODELES = {
  sante: {
    label: 'Professionnel de santé',
    objet: "Un relais à domicile pour les familles d'enfants que vous suivez",
    email: `Bonjour,

Je suis Rémi, accompagnant éducatif installé dans le Chablais. Je garde à domicile les enfants à besoins particuliers (TSA, TDAH, handicap, troubles du comportement) pour permettre à leurs parents de souffler : quelques heures, une journée, chaque semaine ou une nuit.

Vous suivez sans doute des familles épuisées qui n'ont personne pour prendre le relais. Si cela peut leur être utile, je serais heureux de vous présenter mon travail en quelques minutes, ou de vous déposer quelques plaquettes pour votre salle d'attente.

En bref :
- expérience en séjours adaptés avec des enfants autistes, en centre d'éducation motrice, en collège et en internat ;
- chaque garde préparée avec les parents, et un retour détaillé après chaque garde ;
- 50 % de crédit d'impôt pour les familles, sous conditions ;
- Chablais, et gardes ponctuelles à Genève et dans le canton de Vaud.

Vous trouverez ma présentation ici : ${SITE}

Bien cordialement,
${SIGNATURE}`,
    appel: `Bonjour, je m'appelle Rémi, je suis accompagnant éducatif à {ville}. Je garde à domicile des enfants à besoins particuliers pour soulager leurs parents.
Je voulais savoir si je pouvais vous déposer quelques plaquettes pour les familles que vous suivez, ou envoyer ma présentation par email. À quelle adresse puis-je l'envoyer ?

Si on te pose la question : 40 € de l'heure, soit 20 € après crédit d'impôt (sous conditions). Chablais, et Genève ou Vaud en ponctuel.`,
    court: `Bonjour, je suis Rémi, accompagnant éducatif dans le Chablais : je garde à domicile les enfants TSA, TDAH ou en situation de handicap pour que leurs parents puissent souffler. Puis-je vous envoyer ma présentation, ou vous déposer quelques plaquettes pour les familles que vous suivez ? ${SITE}`,
  },
  etablissement: {
    label: 'IME, SESSAD, CAMSP',
    objet: 'Un relais à domicile pour les familles de votre structure',
    email: `Bonjour,

Je suis Rémi, accompagnant éducatif dans le Chablais. Je garde à domicile les enfants à besoins particuliers, notamment le soir, le week-end et pendant les vacances, quand les structures sont fermées et que les familles se retrouvent seules.

Je serais heureux de présenter ce relais à votre équipe, ou de vous transmettre une plaquette à remettre aux familles qui en auraient besoin.

Mon parcours : séjours adaptés avec des enfants autistes, aide médico-psychologique en centre d'éducation motrice, assistant d'éducation en collège, accompagnant en lieu de vie. Je suis également disponible pour des missions ponctuelles si vous recherchez des renforts.

Ma présentation : ${SITE}

Bien cordialement,
${SIGNATURE}`,
    appel: `Bonjour, je m'appelle Rémi, accompagnant éducatif dans le Chablais. Je propose du répit à domicile aux familles d'enfants en situation de handicap, surtout le soir, le week-end et pendant les vacances.
Pourriez-vous me dire à qui je peux présenter ce service, par exemple l'assistante sociale ou le chef de service ?`,
    court: `Bonjour, je suis Rémi, accompagnant éducatif dans le Chablais. Je propose du répit à domicile aux familles d'enfants en situation de handicap, le soir, le week-end et pendant les vacances. Pourrais-je présenter ce relais à votre équipe ? ${SITE}`,
  },
  association: {
    label: 'Association de parents',
    objet: "Du répit à domicile pour les familles de l'association",
    email: `Bonjour,

Je suis Rémi, accompagnant éducatif dans le Chablais. Je garde à domicile les enfants autistes, TDAH ou en situation de handicap, pour que leurs parents puissent souffler.

Je serais ravi de venir présenter le répit à domicile lors d'une rencontre de parents, ou de vous transmettre un court texte pour votre lettre d'information ou vos réseaux. Je peux aussi partager gratuitement des conseils pratiques (transitions, planning visuel, coin calme) : ${SITE}/conseils

Au plaisir d'échanger avec vous,
${SIGNATURE}`,
    appel: `Bonjour, je m'appelle Rémi, accompagnant éducatif dans le Chablais. Je propose du répit à domicile pour les familles d'enfants à besoins particuliers.
Est-ce que je pourrais venir le présenter lors d'une rencontre de parents, ou vous envoyer un petit texte pour vos adhérents ?`,
    court: `Bonjour, je suis Rémi, accompagnant éducatif dans le Chablais : je garde à domicile les enfants autistes, TDAH ou en situation de handicap. Pourrais-je présenter ce répit lors d'une rencontre de parents, ou vous envoyer un texte pour vos adhérents ? ${SITE}`,
  },
  creche: {
    label: 'Crèche, micro-crèche',
    objet: 'Garde à domicile en dehors de vos horaires',
    email: `Bonjour,

Je suis Rémi, accompagnant éducatif dans le Chablais. Je garde les enfants à domicile tôt le matin, le soir, la nuit et le week-end, y compris les enfants qui ont des besoins particuliers.

Certains parents de votre structure cherchent peut-être une solution en dehors de vos horaires : puis-je vous déposer une affiche ou quelques plaquettes pour votre panneau d'information ?

Bien cordialement,
${SIGNATURE}`,
    appel: `Bonjour, je m'appelle Rémi, accompagnant éducatif dans le Chablais. Je garde les enfants à domicile en dehors des horaires de crèche.
Pourrais-je vous déposer une affiche pour le panneau des parents ?`,
    court: `Bonjour, je suis Rémi, accompagnant éducatif dans le Chablais : je garde les enfants à domicile tôt le matin, le soir et le week-end, y compris quand ils ont des besoins particuliers. Puis-je vous déposer une affiche pour vos parents ? ${SITE}`,
  },
  famille: {
    label: 'Famille (réponse à une annonce)',
    objet: 'Votre recherche de garde',
    email: `Bonjour,

J'ai vu votre annonce. Je suis Rémi, accompagnant éducatif dans le Chablais : séjours adaptés avec des enfants autistes, centre d'éducation motrice, collège et internat. Je garde les enfants chez eux, y compris quand ils ont des besoins particuliers.

Je prépare chaque garde avec les parents et je vous raconte tout après. Vous bénéficiez de 50 % de crédit d'impôt, sous conditions.

Seriez-vous d'accord pour qu'on s'appelle ? Vous pouvez aussi choisir un moment ici : ${SITE}/rendez-vous

Bien cordialement,
${SIGNATURE}`,
    appel: `Bonjour, je vous appelle au sujet de votre annonce de garde. Je m'appelle Rémi, je suis accompagnant éducatif dans le Chablais et j'ai l'habitude des enfants à besoins particuliers.
Pouvez-vous me parler de votre enfant et de ce dont vous avez besoin ?`,
    court: `Bonjour, j'ai vu votre annonce. Je suis Rémi, accompagnant éducatif dans le Chablais, habitué aux enfants à besoins particuliers (séjours adaptés, centre d'éducation motrice). 50 % de crédit d'impôt pour vous, sous conditions. On peut s'appeler ? Choisissez un moment ici : ${SITE}/rendez-vous`,
  },
  candidature: {
    label: 'Candidature en Suisse',
    objet: 'Candidature spontanée : accompagnant éducatif',
    email: `Madame, Monsieur,

Accompagnant éducatif basé dans le Chablais, je vous adresse ma candidature pour un poste d'accompagnant socio-éducatif, d'intervenant de relève ou de remplaçant au sein de {nom}.

Mon parcours :
- animateur de séjours adaptés (APAJH) avec des enfants autistes et des enfants avec troubles du comportement ;
- aide médico-psychologique auprès d'enfants atteints de paralysie cérébrale, en centre d'éducation motrice ;
- assistant d'éducation en collège, accompagnant éducatif en lieu de vie ;
- BAFA, attestation d'honorabilité, permis B.

Je peux me rendre à Genève et dans le canton de Vaud. Ma présentation pour les structures : ${SITE}/structures

Je serais heureux d'échanger avec vous et vous prie d'agréer mes salutations distinguées.

Rémi
${TEL_AFFICHE}`,
    appel: `Bonjour, je m'appelle Rémi, je suis accompagnant éducatif basé dans le Chablais. Je souhaiterais savoir si vous recrutez des accompagnants ou des remplaçants, et à qui je peux adresser ma candidature.`,
    court: `Bonjour, je suis Rémi, accompagnant éducatif (séjours adaptés TSA, polyhandicap, internat). Recrutez-vous des accompagnants ou des remplaçants ? Ma présentation : ${SITE}/structures`,
  },
  autre: {
    label: 'Autre contact',
    objet: 'Présentation : garde et répit à domicile',
    email: `Bonjour,

Je suis Rémi, accompagnant éducatif dans le Chablais. Je garde à domicile les enfants à besoins particuliers pour permettre à leurs parents de souffler, et je cherche à faire connaître ce relais aux familles qui en ont besoin.

Pourrions-nous en parler quelques minutes ? Ma présentation : ${SITE}

Bien cordialement,
${SIGNATURE}`,
    appel: `Bonjour, je m'appelle Rémi, accompagnant éducatif dans le Chablais. Je garde à domicile les enfants à besoins particuliers. Je souhaitais vous présenter ce service en deux minutes.`,
    court: `Bonjour, je suis Rémi, accompagnant éducatif dans le Chablais : je garde à domicile les enfants à besoins particuliers pour que leurs parents puissent souffler. ${SITE}`,
  },
}

export function cleModele(p) {
  const c = p.categorie || ''
  if (c === CANDIDATURE) return 'candidature'
  if (p.type === 'famille') return 'famille'
  if (/Crèches/i.test(c)) return 'creche'
  if (p.type === 'association' || /Associations/i.test(c)) return 'association'
  if (p.type === 'etablissement' || /Établissements/i.test(c)) return 'etablissement'
  if (/Orthophonistes|Psychologues|Médecins|pédiatres|généralistes/i.test(c) || p.type === 'prescripteur') return 'sante'
  return 'autre'
}

export function messages(p, cle = cleModele(p)) {
  const m = MODELES[cle]
  const remplir = (t) => t.replaceAll('{nom}', p.nom || 'votre structure').replaceAll('{ville}', p.ville || 'Thonon')
  return { cle, label: m.label, objet: remplir(m.objet), email: remplir(m.email), appel: remplir(m.appel), court: remplir(m.court) }
}

export const LIBELLES_MODELES = Object.fromEntries(Object.entries(MODELES).map(([k, m]) => [k, m.label]))

// ── Sources des demandes (« Comment m'avez-vous connu ? ») ─────────
export { SOURCES } from '../../data/sources'

// ── Pistes pour avoir des clients vite ─────────────────────────────
export const CLIENTS_RAPIDES = [
  { t: 'Fiche Google Business Profile', d: "La première chose que voient les parents qui cherchent « garde enfant autiste Thonon ». Gratuit : photos, horaires, lien vers /rendez-vous, et demande un avis à chaque famille satisfaite.", lien: 'https://www.google.com/business/' },
  { t: 'Annonces de parents', d: "Réponds dans l'heure aux annonces de garde (onglet « Annonces de familles ») avec le message prêt « Famille ». Les premiers qui répondent décrochent la garde." },
  { t: 'Plateformes de garde', d: "Crée un profil complet sur Yoopies, Babysits et Bsit en mettant en avant les besoins particuliers : beaucoup de parents y cherchent d'abord.", lien: 'https://www.google.com/search?q=yoopies+babysits+bsit+profil+garde+enfant' },
  { t: 'Plaquettes chez les professionnels', d: "Dépose la plaquette chez les orthophonistes, psychomotriciens, pédiatres et pharmacies du Chablais. Cinq dépôts par semaine, puis une relance par téléphone dix jours plus tard." },
  { t: 'Annuaire officiel des services à la personne', d: "Vérifie que ta fiche apparaît sur servicesalapersonne.gouv.fr (elle vient de ta déclaration) et qu'elle est complète.", lien: 'https://www.servicesalapersonne.gouv.fr/' },
  { t: 'Répit des aidants', d: "Les services de répit à domicile et plateformes de répit de Haute-Savoie orientent des familles et recrutent parfois des intervenants : présente-toi.", lien: 'https://www.google.com/search?q=plateforme+de+r%C3%A9pit+aidants+Haute-Savoie+enfant+handicap' },
  { t: 'Mairies, CCAS et écoles', d: "Les CCAS, les enseignants référents et les coordonnateurs ULIS connaissent les familles en difficulté. Un email court avec la plaquette suffit pour commencer." },
  { t: 'Groupes Facebook locaux', d: "Rejoins les groupes de parents et de frontaliers (Réseaux sociaux > Où être présent) et réponds aux demandes de garde avec le message court." },
]
