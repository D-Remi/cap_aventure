// Photos du site public.
// Banque Unsplash (licence gratuite, usage commercial autorisé) + portrait de Rémi dans /public/images.
// Pour changer une photo : remplacer l'identifiant (la partie après "photo-" dans l'URL Unsplash).

export const img = (id, w = 1200) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=75`

export const P = {
  // Éducateur et enfant
  foret:      '1768509197111-1deec3dd559a', // adulte et enfant explorant la mousse en forêt
  foret2:     '1768509197138-c09f59db7448', // homme et garçon en forêt
  balade:     '1752650144007-fbe5ca331b06', // balade en sous-bois
  blocs:      '1764616676739-57db6e5c00ee', // construction en blocs de bois
  lecture:    '1758687126981-417a59c589a9', // lecture sur le canapé
  dessin:     '1770096679916-2cd9c720d400', // dessin à table
  // Enfant
  saut:       '1502086223501-7ea6ecd79368', // enfants qui sautent en forêt
  coloriage:  '1620398722262-969d8f2bc875', // coloriage d'un papillon
  cubes:      '1484820540004-14229fe36ca4', // empilement de cubes
  automne:    '1781735974900-15a440c75f31', // balade en forêt d'automne
  mains:      '1578645096265-51bee68d32c1', // main d'enfant qui tient un doigt
  // Léman, Chablais, Suisse
  lavaux:     '1571296224867-b67f50725c17', // vignes et Léman, montagnes du Chablais en face
  lavaux2:    '1571296176377-22f2debfaa3b', // ferme au bord du Léman
  banc:       '1730289075770-ecb53b82499e', // banc face au lac
  coucher:    '1540298781507-44aaf44ff5d0', // coucher de soleil sur le lac
  vapeur:     '1597131133917-a4f964b59f4c', // bateau CGN devant le jet d'eau de Genève
  geneve:     '1584200463394-bba4b2117e4d', // Genève vue du ciel
  chillon:    '1765496888350-2a41bb618049', // tulipes et Léman
  chalet:     '1610803523148-a0052fa341bb', // chalet sous la neige
}

export const REMI = '/images/remi.jpg'
