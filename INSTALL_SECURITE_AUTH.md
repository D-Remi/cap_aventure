# Sécurité renforcée de la connexion — Installation

Ton système de connexion passe des tokens en localStorage (vulnérables au vol
XSS) à des **cookies httpOnly + refresh token révocable**. C'est le niveau de
sécurité maximum contre le vol de session.

## Ce qui change

- Le token de connexion part maintenant dans un **cookie httpOnly** :
  aucun JavaScript ne peut le lire, donc même une faille XSS ne peut pas le
  voler. C'était le point faible principal (avant, le token était dans
  localStorage, lisible par n'importe quel script).
- Deux tokens : un **access token court (15 min)** pour les requêtes, et un
  **refresh token long (7 jours)** stocké côté serveur.
- Le refresh token est **révocable** : tu peux couper une session à distance.
  Il tourne (rotation) à chaque rafraîchissement.
- Bouton "déconnexion de tous les appareils" possible (logout-all) : si tu
  penses qu'un appareil est compromis, tu coupes toutes les sessions d'un coup.
- Le rafraîchissement est **automatique** : quand l'access token expire au bout
  de 15 min, le front le renouvelle tout seul sans te déconnecter.

## Installation sur le serveur

### 1. Créer la table des sessions

```
mysql -u [user] -p [nom_base] < database/migrate_refresh_tokens.sql
```

(ou via phpMyAdmin : exécute le contenu de migrate_refresh_tokens.sql)

### 2. Installer la dépendance backend

Le backend a besoin du paquet cookie-parser (déjà ajouté au package.json) :

```
cd backend
npm install
```

### 3. Déployer et rebuild

```
cd backend && npm run build
cd ../frontend && npm install && npm run build
pm2 restart capaventure-api --update-env
```

### 4. Vérifier le .env

Assure-toi que le backend tourne bien avec NODE_ENV=production (sinon les
cookies ne seront pas marqués "secure"). Dans ton .env ou ta config PM2 :

```
NODE_ENV=production
JWT_SECRET=[une longue chaîne aléatoire, garde-la secrète]
```

Si JWT_SECRET n'est pas défini, change-le maintenant : c'est la clé qui signe
les tokens. Génère-en une avec :
```
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

## Important : HTTPS obligatoire

Les cookies "secure" ne fonctionnent qu'en HTTPS. Ton site est déjà en HTTPS
(certbot), donc c'est bon. En local (dev), les cookies passent en clair,
c'est normal.

## Pour couper toutes tes sessions

Si un jour tu veux forcer la déconnexion partout (appareil perdu, doute de
sécurité), la fonction logoutAll est disponible dans le code. On pourra
ajouter un bouton "Déconnecter tous mes appareils" dans ton profil si tu veux.

## Note

Après déploiement, tous les utilisateurs devront se reconnecter une fois
(les anciens tokens localStorage ne sont plus valides). C'est normal et
attendu — ça n'arrive qu'une seule fois.
