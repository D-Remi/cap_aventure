# Mise à jour de novembre 2026 : nouveau site, pages légales, compta

## Ce qui change

**Site public**
- Nouveau design (photos, formules, prix), page `/tarifs` et page `/frontaliers-suisse`.
- Pages légales : `/mentions-legales`, `/cgv` (avec formulaire de rétractation), `/confidentialite` réécrite (données de santé, durées, droits).
- Mentions obligatoires à côté des prix : HT/TTC, mode prestataire, devis gratuit dès 100 € TTC par mois, avantage fiscal en plus petit (arrêté du 17 mars 2015).
- Polices hébergées sur le serveur (plus d'appel à Google Fonts).

**Back-office (menu de gauche)**
- **Mon entreprise & obligations** : SIRET, n° SAP, agrément, assurance, médiateur, hébergeur, IBAN, taux de cotisations. Liste des démarches à cocher, avec les liens officiels.
- **Déclarations & URSSAF** : montants à déclarer par mois ou trimestre, cotisations, échéances, seuils (TVA, plafond micro, compte dédié), alertes, chiffres NOVA trimestriels, export du livre des recettes (Excel), suivi des factures, attestations fiscales en PDF.
- **Devis** : devis gratuit conforme en PDF.
- **Factures** : numérotation continue `FAC-2027-0001`, toutes les mentions de l'article D7233-1 du Code du travail. « Marquer payée » demande le mode de règlement et inscrit la recette au livre des recettes.
- **Familles** : adresse de facturation (obligatoire sur factures et attestations).
- **Radar clients** :
  - **Prescripteurs** : orthophonistes, psychologues, pédiatres, IME, SESSAD, crèches et associations du Chablais, tirés de l'annuaire officiel des entreprises (gratuit, sans compte).
  - **Annonces de familles** : via l'API France Travail, plus des recherches rapides sur France Travail, Indeed, Leboncoin et Facebook.
  - **Mon suivi** : statut de chaque contact, date de relance et notes.
- **Réseaux sociaux** :
  - visuels Instagram et Facebook aux couleurs du site (portrait, carré, story) ;
  - légendes prêtes à publier avec les hashtags du Chablais ;
  - planning des publications, avec un bouton qui propose 4 semaines d'idées.

**Sécurité (correction)** : l'API renvoyait le mot de passe chiffré des comptes (`/api/users/me`, liste des familles). Corrigé dans `backend/src/main.ts`.

## Mettre à jour le VPS

Le serveur se met à jour depuis GitHub avec `deploy.sh` (dossier `/var/www/cap_aventure`).

### 1. Sauvegarder la base (obligatoire)

```bash
cd /var/www/cap_aventure
mysqldump -u UTILISATEUR -p NOM_DE_LA_BASE > ~/sauvegarde_avant_maj_2026-11.sql
```

Les valeurs `UTILISATEUR` et `NOM_DE_LA_BASE` sont dans `backend/.env` (`DB_USER`, `DB_NAME`, ou dans `DATABASE_URL`).

### 2. Récupérer le nouveau code

**Option A, recommandée (GitHub)** : une fois la branche `refonte-design` fusionnée dans `main` et poussée sur GitHub, sur le serveur :

```bash
cd /var/www/cap_aventure
git pull origin main
```

**Option B (archive zip)** : envoyer l'archive depuis le PC, puis la décompresser par-dessus le dossier. Le fichier `backend/.env` et le dossier `backend/uploads` ne sont pas dans l'archive : ils ne sont pas écrasés.

```powershell
scp C:\Users\mentis\Documents\educetvous74-maj-2026-11.zip root@IP_DU_VPS:/tmp/
```

```bash
cd /var/www/cap_aventure
unzip -o /tmp/educetvous74-maj-2026-11.zip -d /var/www/cap_aventure
```

Avec l'option B, le dépôt Git du serveur n'est plus à jour : la prochaine fois, repasse par l'option A (`git stash` puis `git pull`).

### 3. Mettre à jour la base de données (une seule fois)

```bash
mysql -u UTILISATEUR -p NOM_DE_LA_BASE < database/migrate_legal_compta_2026.sql
mysql -u UTILISATEUR -p NOM_DE_LA_BASE < database/migrate_marketing_2026.sql
```

Les messages `Migration légal + compta OK` puis `Migration réseaux sociaux + radar OK` doivent s'afficher (les deux scripts ont été testés sur une copie du schéma v50).

**Optionnel, annonces France Travail dans le Radar** : crée un compte gratuit sur francetravail.io, déclare une application abonnée à l'API « Offres d'emploi », puis ajoute dans `backend/.env` du serveur :

```bash
FT_CLIENT_ID=ton_identifiant
FT_CLIENT_SECRET=ton_secret
# FT_SCOPE=api_offresdemploiv2 o2dsoffre   (à ajuster selon ce qu'affiche francetravail.io)
``` En production, l'API ne crée pas les tables toute seule (`synchronize` est désactivé) : sans cette étape, les nouvelles pages du back-office affichent une erreur.

### 4. Construire et redémarrer

```bash
cd /var/www/cap_aventure
cd backend && npm install && npm run build && cd ..
cd frontend && npm install && npm run build && cd ..
pm2 reload capaventure-api
sudo systemctl reload nginx
```

(C'est ce que fait `./deploy.sh`, sans le `git pull` si tu as utilisé l'archive.)

### 5. Vérifier

- https://educetvous74.fr, `/tarifs`, `/frontaliers-suisse`, `/mentions-legales`, `/cgv`, `/confidentialite`.
- Back-office : **Mon entreprise & obligations** → remplir et enregistrer. Les mentions légales et les CGV se mettent à jour toutes seules.
- **Familles** : compléter l'adresse de chaque famille.
- **Déclarations & URSSAF** : la page doit charger sans erreur.

### En cas de problème

```bash
pm2 logs capaventure-api --lines 50
```

Retour arrière : `git checkout` du commit précédent, `mysql ... < ~/sauvegarde_avant_maj_2026-11.sql`, puis `./deploy.sh`.

## Avant d'annoncer les prix en ligne

- Ne garde « 50 % » et « 20 €/h » que si ta déclaration SAP est faite (n° renseigné dans Mon entreprise).
- Pas de garde d'enfant handicapé de moins de 18 ans avant l'agrément.
- Adhère à un médiateur de la consommation : ses coordonnées doivent apparaître sur le site.
- Demande l'autorisation de cumul d'activités à ton employeur (assistant d'éducation).
