// 39 publications prêtes : 3 par semaine (mardi, jeudi, dimanche), du 24 novembre 2026 au 21 février 2027.
// {tel} et {site} sont remplacés automatiquement. Les hashtags sont ajoutés selon la liste « tags ».
// Règles respectées : aucune photo d'enfant accompagné, aucun faux témoignage,
// « sous conditions » dès que le crédit d'impôt est cité, gardes en Suisse = ponctuelles et réservées 8 jours avant.

export const PACK = [
  // ── Semaine 1 ──
  { date: '2026-11-24', heure: '19:30', theme: 'Je me présente', tags: ['local', 'garde', 'repit'], modele: 'photo', photo: 'foret',
    titre: 'Un éducateur pour garder votre enfant, pas juste un baby-sitter', texte: '',
    legende: "Bonjour, moi c'est Rémi 👋\n\nAccompagnant éducatif, je garde chez eux les enfants à besoins particuliers : autisme, TDAH, handicap, troubles du comportement, ou simplement une fratrie nombreuse.\n\nSéjours adaptés, centre d'éducation motrice, collège, internat : j'ai l'habitude des enfants que les baby-sitters refusent.\n\nMon métier, c'est de vous permettre de souffler, en sachant votre enfant entre de bonnes mains. Des deux côtés du Léman : Chablais, Genève, Vaud.\n\nPremier échange gratuit : {tel}\n{site}" },
  { date: '2026-11-26', heure: '19:30', theme: 'Conseil éducatif', tags: ['repit', 'local'], modele: 'conseil',
    titre: 'Préparer une première garde', texte: "1. Une fiche simple : ce qui l'apaise, ce qui le déclenche.\n2. Une première rencontre courte, en votre présence.\n3. Ses objets rassurants, toujours au même endroit.",
    legende: "Confier son enfant pour la première fois, ça se prépare. Voici les 3 choses que je fais avant chaque première garde :\n\n1️⃣ Une fiche simple avec vous : ce qui l'apaise, ce qui le déclenche, ses mots ou ses signes.\n2️⃣ Une rencontre courte, en votre présence, pour qu'il m'identifie sans stress.\n3️⃣ Ses objets rassurants repérés et laissés à leur place.\n\nRésultat : votre enfant retrouve ses repères, et vous partez l'esprit tranquille.\n\nVous avez une question sur une première garde ? Écrivez-moi en message privé." },
  { date: '2026-11-29', heure: '10:00', theme: 'Le répit', tags: ['repit', 'local'], modele: 'citation',
    titre: "Vous n'êtes pas un mauvais parent. Vous êtes fatigué, et vous cherchez des réponses.", texte: 'Rémi, accompagnant éducatif',
    legende: "Je l'entends souvent, et je le redis à chaque famille.\n\nQuand votre enfant demande une attention de chaque instant, la fatigue s'installe. Ce n'est ni un échec ni un manque d'amour. C'est humain.\n\nPrendre quelques heures pour vous, c'est aussi prendre soin de lui : un parent reposé est un parent plus disponible.\n\nPremier échange gratuit et sans engagement : {tel}" },

  // ── Semaine 2 ──
  { date: '2026-12-01', heure: '19:30', theme: 'Le prix réel', tags: ['local', 'garde'], modele: 'prix',
    titre: 'Un éducateur chez vous', texte: '',
    legende: "Combien coûte une garde avec un éducateur ?\n\n40 € de l'heure en abonnement… mais avec le crédit d'impôt de 50 % déduit tout de suite grâce à l'avance immédiate de l'URSSAF, vous payez réellement 20 € de l'heure.*\n\nÀ peine plus qu'une baby-sitter déclarée, avec quelqu'un de formé aux besoins particuliers.\n\nTous les tarifs : {site}/tarifs\n\n*Crédit d'impôt sous conditions, pour les foyers résidents fiscaux en France, dans la limite des plafonds annuels." },
  { date: '2026-12-03', heure: '19:30', theme: 'Journée internationale des personnes handicapées', tags: ['repit', 'local'], modele: 'photo', photo: 'mains',
    titre: '3 décembre : journée internationale des personnes handicapées', texte: 'Et une pensée pour les parents qui accompagnent, chaque jour.',
    legende: "Aujourd'hui, c'est la journée internationale des personnes handicapées.\n\nJ'ai une pensée pour les enfants que j'accompagne, et pour leurs parents : ceux qui coordonnent les rendez-vous, remplissent les dossiers MDPH, gèrent les crises et les nuits courtes, tout en continuant à travailler.\n\nVous faites un travail immense. Vous avez le droit d'être relayés.\n\nSi vous connaissez une famille qui a besoin de souffler, partagez-lui ce post 💚" },
  { date: '2026-12-06', heure: '10:00', theme: 'Conseil éducatif', tags: ['repit', 'local'], modele: 'conseil',
    titre: 'Les transitions : prévenir plutôt que gérer', texte: "Annoncer le changement à l'avance.\nUn minuteur visuel.\nUne image de l'activité suivante.",
    legende: "Arrêter un jeu, sortir du bain, partir à l'école… Les transitions sont souvent le moment où tout explose, surtout chez les enfants TSA ou TDAH.\n\nCe qui aide vraiment :\n• Prévenir à l'avance : « Dans 5 minutes, on range. »\n• Un minuteur visuel qu'il peut regarder.\n• Montrer une image de ce qui vient ensuite.\n• Garder les mêmes étapes, dans le même ordre.\n\nPas de recette magique, mais beaucoup moins de crises.\n\nEt chez vous, quelle transition est la plus difficile ? 👇" },

  // ── Semaine 3 ──
  { date: '2026-12-08', heure: '19:30', theme: 'Frontaliers', tags: ['frontalier', 'local', 'garde'], modele: 'photo', photo: 'vapeur',
    titre: 'Frontaliers : vos soirées vous appartiennent', texte: '',
    legende: "Frontaliers du Chablais, ce post est pour vous 🇨🇭🇫🇷\n\nDépart à 6 h 30, douane bouchée, bateau CGN en retard le soir… Je garde votre enfant chez vous de 6 h 30 à 20 h 30, et je reste jusqu'à votre retour.\n\nVous habitez en France ? Vous avez droit au crédit d'impôt de 50 %, même avec un salaire suisse.*\n\nTout est expliqué ici : {site}/frontaliers-suisse\n\n*Sous conditions, pour les résidents fiscaux en France." },
  { date: '2026-12-10', heure: '19:30', theme: 'Disponibilités', tags: ['local', 'garde'], modele: 'dispo',
    titre: 'Encore des créneaux en décembre', texte: "Mercredi après-midi\nSamedi\nSoirées avant les fêtes",
    legende: "Des créneaux sont encore libres en décembre 📅\n\n• Mercredi après-midi\n• Samedi\n• Soirées avant les fêtes, pour vos achats de Noël ou une soirée à deux\n\nGarde à domicile dans le Chablais, y compris pour les enfants à besoins particuliers.\n\nPremier échange gratuit : {tel}" },
  { date: '2026-12-13', heure: '10:00', theme: 'Coulisses', tags: ['garde', 'local'], modele: 'conseil',
    titre: 'Ce qu\'il y a dans mon sac de garde', texte: "La fiche de votre enfant.\nUn minuteur visuel.\nDe la pâte à modeler, un livre, des cartes.\nUne trousse de premiers soins.",
    legende: "Petit tour dans mon sac de garde 🎒\n\n📋 La fiche de votre enfant : habitudes, déclencheurs, ce qui l'apaise, numéros utiles.\n⏳ Un minuteur visuel, pour annoncer les transitions.\n🎨 De la pâte à modeler, un livre, un jeu de cartes : de quoi occuper les mains sans écran.\n🩹 Une petite trousse de premiers soins.\n\nLe reste, c'est votre enfant qui me le montre : ses jeux, ses livres, son coin préféré.\n\nVous voulez savoir comment se passe une garde ? Écrivez-moi." },

  // ── Semaine 4 ──
  { date: '2026-12-15', heure: '19:30', theme: 'Conseil éducatif', tags: ['repit', 'local'], modele: 'conseil',
    titre: 'Les fêtes avec un enfant hypersensible', texte: "Prévenir du programme.\nPrévoir un coin calme.\nUn repas familier dans l'assiette.\nPartir avant la fatigue.",
    legende: "Bruit, lumières, cousins, horaires chamboulés : les fêtes peuvent être épuisantes pour un enfant hypersensible.\n\nQuelques idées qui aident :\n🗓️ Lui raconter le programme à l'avance, avec des images si besoin.\n🛋️ Prévoir un coin calme où il peut se retirer, avec son casque ou son doudou.\n🍽️ Un aliment familier dans l'assiette, même au réveillon.\n🚗 Partir avant que la fatigue ne déborde, sans culpabiliser.\n\nVos proches comprendront. Et votre enfant aussi passera de meilleures fêtes." },
  { date: '2026-12-17', heure: '19:30', theme: 'Vacances de Noël', tags: ['local', 'garde', 'repit'], modele: 'photo', photo: 'saut',
    titre: 'Vacances de Noël : besoin d\'un relais ?', texte: 'Journées répit, sorties nature, temps calmes à la maison.',
    legende: "Les vacances de Noël arrivent 🎄\n\nVous travaillez encore, ou vous avez simplement besoin d'une journée pour vous ? Je propose des journées répit chez vous : sorties nature à son rythme, jeux, temps calmes.\n\nJournée de 8 h : 340 €, soit 170 € après crédit d'impôt (sous conditions).\n\nRéservez dès maintenant, les places partent vite : {tel}" },
  { date: '2026-12-20', heure: '10:00', theme: 'Le répit', tags: ['repit', 'local'], modele: 'photo', photo: 'banc',
    titre: 'Et vous, qui prend soin de vous ?', texte: '',
    legende: "On vous demande souvent comment va votre enfant. Plus rarement comment vous allez, vous.\n\nPrendre une heure pour marcher au bord du lac, dormir, voir une amie, ce n'est pas abandonner votre enfant. C'est vous donner les moyens de tenir sur la durée.\n\nCette semaine, offrez-vous un moment. Même court.\n\nEt si vous avez besoin que quelqu'un prenne le relais, je suis là : {tel}" },

  // ── Semaine 5 ──
  { date: '2026-12-22', heure: '19:30', theme: 'Familles suisses', tags: ['suisse', 'garde', 'repit'], modele: 'photo', photo: 'chillon',
    titre: 'Genève, Vaud : je viens aussi chez vous', texte: 'Gardes ponctuelles, réservées au moins 8 jours avant.',
    legende: "Vous habitez à Genève ou dans le canton de Vaud ?\n\nJe viens aussi chez vous pour des gardes ponctuelles : soirées, week-ends, relâches, vacances. Y compris pour un enfant autiste, TDAH ou en situation de handicap.\n\nChaque intervention est déclarée aux autorités suisses : pensez à réserver au moins 8 jours avant.\n\nPour un créneau chaque semaine, on peut aussi passer par Chèque service ou Chèques-emploi.\n\nInfos : {site}/frontaliers-suisse" },
  { date: '2026-12-24', heure: '10:00', theme: 'Noël', tags: ['local'], modele: 'citation',
    titre: 'Joyeux Noël à toutes les familles, et à celles qui le vivent autrement.', texte: 'Rémi, Éduc & Vous',
    legende: "Joyeux Noël 🎄\n\nÀ toutes les familles, et en particulier à celles pour qui les fêtes riment avec adaptation, vigilance et compromis.\n\nQue votre Noël soit à votre image : simple ou grandiose, calme ou animé, l'important c'est qu'il vous ressemble.\n\nPrenez soin de vous. 💚" },
  { date: '2026-12-27', heure: '10:00', theme: 'Conseil éducatif', tags: ['repit', 'local'], modele: 'conseil',
    titre: 'Après les fêtes : retrouver le rythme', texte: "Reprendre les horaires 3 jours avant l'école.\nRemettre le planning en images.\nMoins d'activités, plus de calme.",
    legende: "Les fêtes chamboulent tout : couchers tardifs, repas différents, beaucoup de monde. Pour un enfant qui a besoin de repères, la reprise peut être rude.\n\nPour l'aider :\n🛏️ Reprendre les horaires de coucher 3 jours avant l'école.\n🖼️ Remettre en place le planning visuel de la semaine.\n🌿 Alléger le programme : moins d'activités, plus de moments calmes.\n\nEt pour vous, une journée de relais avant la rentrée ? {tel}" },

  // ── Semaine 6 ──
  { date: '2026-12-29', heure: '19:30', theme: 'Soirée et nuit', tags: ['local', 'repit'], modele: 'photo', photo: 'coucher',
    titre: 'Une soirée rien qu\'à deux', texte: 'Soirée et nuit : 18 h à 9 h le lendemain.',
    legende: "Quand avez-vous passé une soirée rien qu'à deux pour la dernière fois ?\n\nJe garde votre enfant de 18 h à 9 h le lendemain, chez vous. Il dort dans son lit, avec ses repères, et vous profitez d'une vraie soirée, voire d'une vraie nuit.\n\nSoirée + nuit : 260 €, soit 130 € après crédit d'impôt (sous conditions).\n\nPour le 31 ou pour plus tard, écrivez-moi : {tel}" },
  { date: '2026-12-31', heure: '10:00', theme: 'Vœux', tags: ['local'], modele: 'citation',
    titre: 'Pour 2027, je vous souhaite du souffle.', texte: 'Rémi, Éduc & Vous',
    legende: "Pour 2027, je vous souhaite du souffle 🌬️\n\nDes nuits un peu plus longues, des moments rien qu'à vous, et des personnes de confiance autour de votre enfant.\n\nMerci à toutes les familles qui m'ont fait confiance cette année. Et à celles qui me découvrent : on se parle quand vous voulez.\n\nBonne année ! 🥂" },
  { date: '2027-01-03', heure: '10:00', theme: 'Rentrée / vacances', tags: ['local', 'garde', 'repit'], modele: 'photo', photo: 'blocs',
    titre: 'Nouvelle année, nouveau rythme', texte: 'Un créneau fixe chaque semaine, la même personne.',
    legende: "Janvier, c'est le bon moment pour caler l'année.\n\nAvec la formule Souffle, vous avez un créneau fixe chaque semaine : le mercredi après-midi, le samedi ou en fin de journée. Votre enfant retrouve la même personne, ses repères s'installent, et vous avez un temps pour vous qui revient sans avoir à vous organiser.\n\n40 € de l'heure, soit 20 € après crédit d'impôt (sous conditions).\n\nIl reste des places pour 2027 : {tel}" },

  // ── Semaine 7 ──
  { date: '2027-01-05', heure: '19:30', theme: 'Les aides', tags: ['repit', 'local'], modele: 'conseil',
    titre: 'Les aides qui financent le répit', texte: "Le crédit d'impôt de 50 %.\nL'avance immédiate URSSAF.\nL'AEEH et son complément.",
    legende: "Le répit coûte cher ? Pas forcément. Plusieurs aides existent :\n\n💶 Le crédit d'impôt de 50 % pour la garde à domicile, sous conditions, même si vous ne payez pas d'impôt.\n⚡ L'avance immédiate de l'URSSAF : la réduction est déduite tout de suite, vous n'avancez rien.\n🧾 L'AEEH et son complément, versés aux parents d'enfants en situation de handicap : vous les utilisez comme vous le souhaitez, y compris pour souffler.\n\nVous voulez savoir ce que ça vous coûterait vraiment ? Écrivez-moi, on fait le calcul ensemble." },
  { date: '2027-01-07', heure: '19:30', theme: 'Je me présente', tags: ['local', 'garde'], modele: 'photo', photo: 'foret2',
    titre: 'Pourquoi j\'ai quitté l\'informatique', texte: '',
    legende: "En 2022, j'ai quitté mon métier dans l'informatique.\n\nPas parce que je n'aimais pas ça, mais parce que ce qui compte pour moi, c'est l'humain. Depuis, j'ai travaillé en collège, en séjours adaptés avec des enfants autistes, en centre d'éducation motrice avec des enfants polyhandicapés, en internat.\n\nAujourd'hui, j'ai créé Éduc & Vous pour aider les familles là où elles en ont le plus besoin : à la maison.\n\nMerci de me suivre ! Et si vous avez des questions, ma messagerie est ouverte." },
  { date: '2027-01-10', heure: '10:00', theme: 'Conseil éducatif', tags: ['repit', 'local'], modele: 'conseil',
    titre: 'TDAH : 3 astuces pour les devoirs', texte: "Des petites étapes, cochées une à une.\nBouger entre deux exercices.\nUn minuteur, pas une montre.",
    legende: "Les devoirs avec un enfant TDAH, c'est souvent un combat. Trois astuces simples :\n\n✅ Découper en petites étapes, et les cocher une à une. Voir sa progression motive.\n🤸 Bouger entre deux exercices : sauter, aller boire un verre d'eau, 1 minute suffit.\n⏳ Un minuteur visuel plutôt que « encore 10 minutes » : le temps devient concret.\n\nEt surtout : finir sur une réussite, même petite.\n\nVous avez d'autres astuces ? Partagez-les en commentaire 👇" },

  // ── Semaine 8 ──
  { date: '2027-01-12', heure: '19:30', theme: 'Questions fréquentes', tags: ['local', 'garde'], modele: 'conseil',
    titre: 'Vous gardez aussi les frères et sœurs ?', texte: "Oui, la fratrie est la bienvenue.\n+ 8 € de l'heure par enfant en plus.",
    legende: "Question fréquente : « Vous gardez aussi les frères et sœurs ? »\n\nOui ! Et c'est souvent important : quand un enfant demande beaucoup d'attention, ses frères et sœurs en manquent parfois. Pendant la garde, chacun a sa place et son moment.\n\nTarif : + 8 € de l'heure par enfant en plus, soit 4 € après crédit d'impôt (sous conditions).\n\nUne autre question ? Posez-la en commentaire ou en message." },
  { date: '2027-01-14', heure: '19:30', theme: 'Disponibilités', tags: ['local', 'garde'], modele: 'dispo',
    titre: 'Créneaux 2027', texte: "Mercredi après-midi\nSamedi matin\nFin de journée en semaine",
    legende: "Les plannings de 2027 se remplissent 📅\n\nIl me reste quelques créneaux réguliers :\n• Mercredi après-midi\n• Samedi matin\n• Fin de journée en semaine\n\nChablais, Genève et Vaud (en Suisse, gardes ponctuelles). Premier échange gratuit : {tel}" },
  { date: '2027-01-17', heure: '10:00', theme: 'Coulisses', tags: ['garde', 'local'], modele: 'photo', photo: 'automne',
    titre: 'Pourquoi je sors (presque) toujours dehors', texte: '',
    legende: "Pendant une garde, dès que la météo le permet, on sort 🌲\n\nPourquoi ?\n• Le mouvement aide à réguler l'agitation.\n• La nature apaise : moins de bruit, plus d'espace.\n• Les sorties créent des souvenirs et de la confiance.\n\nUne balade au bord du lac, une cabane en forêt, une flaque à sauter : pas besoin de plus. Toujours à son rythme, et en sécurité.\n\nEt votre enfant, plutôt forêt ou plage du Léman ?" },

  // ── Semaine 9 ──
  { date: '2027-01-19', heure: '19:30', theme: 'Frontaliers', tags: ['frontalier', 'local'], modele: 'photo', photo: 'lavaux',
    titre: 'Salaire suisse et crédit d\'impôt : c\'est possible', texte: '',
    legende: "« Je suis frontalier, imposé en Suisse : j'ai droit au crédit d'impôt ? »\n\nSi vous habitez en France, vous êtes en principe résident fiscal français et vous déclarez vos revenus en France. Le crédit d'impôt pour la garde à domicile vous est alors accessible, sous conditions. Et comme c'est un crédit, la part qui dépasse votre impôt français vous est remboursée.\n\nChaque situation est particulière : vérifiez la vôtre sur impots.gouv.fr.\n\nPlus d'infos : {site}/frontaliers-suisse" },
  { date: '2027-01-21', heure: '19:30', theme: 'Conseil éducatif', tags: ['repit', 'local'], modele: 'conseil',
    titre: 'Les pictogrammes, mode d\'emploi', texte: "Une image par étape.\nDans l'ordre de la journée.\nOn retire l'image quand c'est fait.",
    legende: "Les pictogrammes aident beaucoup d'enfants autistes, et pas seulement eux. Mode d'emploi simple :\n\n🖼️ Une image par étape : se lever, s'habiller, déjeuner…\n➡️ Dans l'ordre, de gauche à droite ou de haut en bas.\n✋ On retire ou on retourne l'image quand l'étape est faite.\n\nLa journée devient prévisible, et un enfant qui sait ce qui l'attend est un enfant plus serein.\n\nPendant mes gardes, j'utilise ceux que vous utilisez déjà : la cohérence, c'est la clé." },
  { date: '2027-01-24', heure: '10:00', theme: 'Le répit', tags: ['repit', 'local'], modele: 'citation',
    titre: 'Demander de l\'aide, c\'est aussi prendre soin de son enfant.', texte: 'Rémi, accompagnant éducatif',
    legende: "Beaucoup de parents attendent d'être à bout pour demander de l'aide. Comme si c'était un aveu d'échec.\n\nC'est l'inverse. Organiser du répit avant l'épuisement, c'est protéger toute la famille : votre enfant, ses frères et sœurs, votre couple, et vous.\n\nPremier échange gratuit, sans engagement : {tel}" },

  // ── Semaine 10 ──
  { date: '2027-01-26', heure: '19:30', theme: 'Comment ça se passe', tags: ['local', 'garde'], modele: 'conseil',
    titre: 'Comment se passe une première garde', texte: "1. On s'appelle (30 min offertes).\n2. Je viens vous rencontrer.\n3. On commence doucement.\n4. Je vous raconte tout.",
    legende: "Comment ça se passe concrètement ?\n\n1️⃣ On s'appelle : 30 minutes gratuites pour comprendre votre situation.\n2️⃣ Je viens vous rencontrer chez vous, avec votre enfant. On remplit sa fiche ensemble.\n3️⃣ Les premières gardes sont plus courtes, le temps qu'il me connaisse.\n4️⃣ Après chaque garde, je vous raconte : repas, humeur, activités, moments difficiles.\n\nRien n'est improvisé. Premier pas : {tel}" },
  { date: '2027-01-28', heure: '19:30', theme: 'Professionnels', tags: ['repit', 'local'], modele: 'photo', photo: 'dessin',
    titre: 'Orthophonistes, psychomotriciens : travaillons ensemble', texte: '',
    legende: "Ce post s'adresse aux professionnels du Chablais et du Léman : orthophonistes, psychomotriciens, ergothérapeutes, psychologues, pédiatres, enseignants référents.\n\nVous suivez des familles épuisées qui n'ont personne pour prendre le relais ? Je garde leur enfant à domicile, y compris en cas d'autisme, de TDAH ou de handicap.\n\nJe peux vous déposer une plaquette, ou en discuter par téléphone : {tel}\n\nMerci de partager à vos collègues 🙏" },
  { date: '2027-01-31', heure: '10:00', theme: 'Conseil éducatif', tags: ['repit', 'local'], modele: 'conseil',
    titre: 'Aménager un coin calme', texte: "Un endroit à lui, un peu à l'écart.\nPeu de lumière, peu de bruit.\nUn coussin, une couverture, un objet doux.",
    legende: "Un coin calme, c'est un refuge où votre enfant peut redescendre quand tout devient trop.\n\nPour l'aménager :\n🏠 Un endroit à lui, un peu à l'écart : un coin de chambre, une tente, sous le bureau.\n💡 Peu de lumière, peu de bruit.\n🧸 Un coussin, une couverture lestée si elle lui convient, un objet doux.\n\nRègle d'or : ce n'est jamais une punition. C'est un endroit où il a le droit d'aller, quand il veut." },

  // ── Semaine 11 ──
  { date: '2027-02-02', heure: '19:30', theme: 'Vacances d\'hiver', tags: ['suisse', 'local', 'garde'], modele: 'photo', photo: 'chalet',
    titre: 'Relâches et vacances d\'hiver : réservez', texte: 'Au chalet, en station, à Genève ou dans le canton de Vaud.',
    legende: "Les relâches et les vacances d'hiver approchent ⛷️\n\nVous partez au chalet à Châtel, Morzine ou Abondance ? Je peux garder votre enfant sur place pendant que vous profitez des pistes, y compris s'il a des besoins particuliers.\n\nVous habitez à Genève ou dans le canton de Vaud ? Je viens aussi chez vous, en gardes ponctuelles réservées au moins 8 jours avant.\n\nLes semaines de vacances partent vite : {tel}" },
  { date: '2027-02-04', heure: '19:30', theme: 'Week-end répit', tags: ['repit', 'local'], modele: 'photo', photo: 'lavaux2',
    titre: 'Un week-end pour souffler', texte: 'Du samedi 9 h au dimanche 18 h.',
    legende: "Et si vous partiez un week-end ?\n\nDu samedi 9 h au dimanche 18 h, je m'occupe de votre enfant chez vous, dans ses repères. Vous, vous dormez, vous partez, vous respirez.\n\nWeek-end répit : 790 €, soit 395 € après crédit d'impôt (sous conditions).\n\nDeux week-ends par mois au maximum : réservez tôt, {tel}" },
  { date: '2027-02-07', heure: '10:00', theme: 'Conseil éducatif', tags: ['repit', 'local'], modele: 'conseil',
    titre: 'Neige et hypersensibilité', texte: "Tester les vêtements avant le jour J.\nDes sorties courtes.\nUne boisson chaude en récompense.",
    legende: "La neige, c'est magique… sauf quand les gants grattent, que le bonnet serre et que le froid pique.\n\nPour un enfant hypersensible :\n🧤 Tester les vêtements à la maison avant le jour J.\n⏱️ Des sorties courtes, quitte à recommencer.\n☕ Une boisson chaude au retour, comme petit rituel.\n\nEt s'il préfère regarder la neige par la fenêtre, c'est très bien aussi." },

  // ── Semaine 12 ──
  { date: '2027-02-09', heure: '19:30', theme: 'Saint-Valentin', tags: ['local', 'repit'], modele: 'photo', photo: 'coucher',
    titre: 'Saint-Valentin : et si vous sortiez ?', texte: 'Je garde, vous profitez.',
    legende: "Samedi, c'est la Saint-Valentin 💛\n\nRestaurant, cinéma, ou simplement une soirée tranquille sans interruption : je garde votre enfant chez vous, vous profitez.\n\nSoirée et nuit possibles. À réserver dès maintenant : {tel}" },
  { date: '2027-02-11', heure: '19:30', theme: 'Questions fréquentes', tags: ['repit', 'local'], modele: 'conseil',
    titre: 'Et s\'il fait une crise pendant la garde ?', texte: "On prépare le protocole ensemble.\nJe baisse la stimulation, je reste calme.\nJe vous préviens si besoin.",
    legende: "« Et s'il fait une crise pendant que vous le gardez ? »\n\nC'est la question que tous les parents se posent, et c'est normal.\n\nAvant la première garde, on prépare ensemble ce qui marche chez vous : les signes qui annoncent la crise, ce qui l'apaise, ce qu'il faut éviter. Pendant la garde, je baisse la stimulation, je reste calme, je sécurise. Et je vous préviens si besoin.\n\nJ'ai l'habitude : séjours adaptés, internat, collège. Vous pouvez partir tranquilles." },
  { date: '2027-02-14', heure: '10:00', theme: 'Saint-Valentin', tags: ['local'], modele: 'citation',
    titre: 'Prendre du temps pour son couple, c\'est aussi prendre soin de sa famille.', texte: 'Rémi, Éduc & Vous',
    legende: "Bonne Saint-Valentin 💛\n\nQuand un enfant demande beaucoup, le couple passe souvent après. Pourtant, il est le socle de toute la famille.\n\nUne soirée, un déjeuner, une balade à deux : ça compte. Et si vous avez besoin de quelqu'un pour le rendre possible, vous savez où me trouver." },

  // ── Semaine 13 ──
  { date: '2027-02-16', heure: '19:30', theme: 'Vacances d\'hiver', tags: ['local', 'garde', 'repit'], modele: 'photo', photo: 'saut',
    titre: 'Vacances d\'hiver : journées répit', texte: 'Sorties, jeux, temps calmes, à son rythme.',
    legende: "C'est les vacances d'hiver ❄️\n\nBesoin d'une journée pour travailler, faire vos courses ou simplement souffler ? Je propose des journées répit chez vous : sortie dans la neige ou au bord du lac, jeux, temps calmes.\n\nJournée de 8 h : 340 €, soit 170 € après crédit d'impôt (sous conditions).\n\nÉcrivez-moi : {tel}" },
  { date: '2027-02-18', heure: '19:30', theme: 'Échange', tags: ['repit', 'local'], modele: 'citation',
    titre: 'Quelle est votre plus grande difficulté au quotidien ?', texte: 'Dites-le-moi en commentaire.',
    legende: "J'aimerais vous lire 💬\n\nParents d'un enfant à besoins particuliers : quelle est votre plus grande difficulté au quotidien ? Le sommeil, les repas, les sorties, trouver quelqu'un de confiance, les démarches ?\n\nDites-le-moi en commentaire ou en message privé. Vos réponses m'aident à vous proposer des conseils vraiment utiles ici." },
  { date: '2027-02-21', heure: '10:00', theme: 'Je me présente', tags: ['local', 'garde', 'repit'], modele: 'photo', photo: 'balade',
    titre: 'Éduc & Vous en 3 mots : relais, confiance, souffle', texte: '',
    legende: "Si vous découvrez cette page, bienvenue ! Éduc & Vous en 3 mots :\n\n🤝 Relais : je prends le relais chez vous, quelques heures, une journée ou chaque semaine.\n💚 Confiance : chaque garde est préparée avec vous, et je vous raconte tout.\n🌬️ Souffle : pour que vous puissiez enfin respirer.\n\nDes deux côtés du Léman : Chablais, Genève, Vaud.\nPremier échange gratuit : {tel}\n{site}" },
]
