# Module Planning des gardes — Installation

Nouveau module ajouté à ton back-office : un planning de tes gardes avec vue
semaine, calcul de revenus (CESU / agence), et suivi des trajets.

## Ce que ça fait

- **Vue semaine** : une grille jours × heures avec tes gardes placées visuellement.
  Les zones vides = créneaux où tu peux caser une autre garde.
- **Calcul auto des revenus** : heures/semaine, heures/mois, revenu estimé, et
  répartition CESU vs agence.
- **Chaque garde** : famille, enfant(s), type de contrat (CESU direct ou agence),
  jour, horaires, lieu, temps de trajet, tarif horaire.
- **Trajets** : affichés sur chaque garde pour repérer les enchaînements possibles.

## Installation sur le serveur

### 1. Créer la table en base

Sur le VPS, importe la migration :

```
mysql -u [user] -p [nom_base] < database/migrate_gardes.sql
```

(ou via phpMyAdmin : ouvre migrate_gardes.sql et exécute-le)

### 2. Déployer le nouveau code

Remplace backend/src et frontend/src par les nouvelles versions, puis :

```
cd backend && npm install && npm run build
cd ../frontend && npm install && npm run build
pm2 restart capaventure-api --update-env
```

### 3. Accéder au planning

Connecte-toi en admin, le menu de gauche a maintenant **« Planning gardes »**.

## Comment t'en servir

1. Clique **+ Ajouter une garde**
2. Remplis : famille, jour, horaires, CESU ou agence, lieu, trajet, tarif net/h
3. La garde apparaît dans la grille et les stats se recalculent
4. Clique sur une garde dans la grille pour la modifier

Astuce : marque en « Pressentie » les gardes pas encore sûres — elles
apparaissent en pointillé, sans fausser tes revenus confirmés (elles comptent
quand même dans le total, à toi de voir).

## Note sur les revenus

Le calcul = heures récurrentes × tarif horaire net que tu saisis. C'est une
**estimation** basée sur tes gardes récurrentes (chaque semaine). Les gardes
ponctuelles ne sont pas comptées dans le total hebdomadaire (elles ne se
répètent pas). Le "par mois" applique un coefficient de 4,33 semaines.

Ça te donne une vision claire pour piloter ton objectif (par ex. tes 27 h /
semaine pour 1600 € net).
