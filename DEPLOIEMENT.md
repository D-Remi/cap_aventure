# 🚀 Déploiement CapAventure sur Railway — Guide complet

Railway = hébergement cloud simple et pas cher.
**Gratuit jusqu'à ~5$/mois** — largement suffisant pour tester avec des proches.

---

## Prérequis

- Un compte **GitHub** (gratuit) → https://github.com
- Un compte **Railway** (gratuit) → https://railway.app (connexion avec GitHub)
- Ton projet CapAventure sur GitHub (on explique comment ci-dessous)

---

## ÉTAPE 1 — Mettre le projet sur GitHub

### 1a. Installer Git si pas déjà fait
→ https://git-scm.com/download/win

### 1b. Créer un repo GitHub
1. Va sur https://github.com/new
2. Nom : `capaventure`
3. **Private** (privé) ✅
4. Cliquer "Create repository"

### 1c. Pusher ton code

Ouvre un terminal dans le dossier `capaventure/` :

```bash
git init
git add .
git commit -m "Initial commit CapAventure"
git branch -M main
git remote add origin https://github.com/TON_USERNAME/capaventure.git
git push -u origin main
```

### 1d. Créer le .gitignore AVANT de pusher

Crée un fichier `.gitignore` à la racine du projet :

```
# Variables d'environnement — NE JAMAIS VERSIONNER
backend/.env
backend/uploads/

# Node modules
node_modules/
*/node_modules/

# Build
backend/dist/
frontend/dist/

# Logs
*.log
```

---

## ÉTAPE 2 — Déployer la base de données MySQL sur Railway

1. Va sur https://railway.app → **New Project**
2. Clique **"Add a service"** → **"Database"** → **"MySQL"**
3. Railway crée automatiquement une base MySQL ✅
4. Clique sur le service MySQL → onglet **"Variables"**
5. Note les valeurs (tu en auras besoin) :
   - `MYSQLHOST`
   - `MYSQLPORT`
   - `MYSQLUSER`
   - `MYSQLPASSWORD`
   - `MYSQLDATABASE`

---

## ÉTAPE 3 — Déployer le Backend NestJS

### 3a. Créer le service backend

Dans ton projet Railway :
1. **"Add a service"** → **"GitHub Repo"**
2. Sélectionne ton repo `capaventure`
3. Railway détecte automatiquement le code

### 3b. Configurer le dossier racine

Dans les settings du service :
- **Root Directory** : `backend`
- **Build Command** : `npm install && npm run build`
- **Start Command** : `node dist/main.js`

### 3c. Ajouter les variables d'environnement

Dans le service backend → onglet **"Variables"**, ajoute :

```
NODE_ENV=production
PORT=3001

# Base de données (copie les valeurs de l'étape 2)
DB_HOST=${{MySQL.MYSQLHOST}}
DB_PORT=${{MySQL.MYSQLPORT}}
DB_USER=${{MySQL.MYSQLUSER}}
DB_PASS=${{MySQL.MYSQLPASSWORD}}
DB_NAME=${{MySQL.MYSQLDATABASE}}

# JWT — génère une clé aléatoire forte ici :
# https://www.allkeysgenerator.com/Random/Security-Encryption-Key-Generator.aspx
JWT_SECRET=colle-une-cle-aleatoire-longue-ici

# Email Gmail
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_SECURE=false
MAIL_USER=ton.email@gmail.com
MAIL_PASS=ton-mot-de-passe-application-gmail
MAIL_FROM=CapAventure <ton.email@gmail.com>
ADMIN_EMAIL=ton.email@gmail.com

# URL frontend (à remplir après déploiement du frontend)
FRONTEND_URL=https://ton-frontend.up.railway.app
```

> 💡 Pour `DB_HOST` etc., Railway permet de référencer les variables d'un autre service avec `${{NomService.VARIABLE}}`

### 3d. Générer un domaine public

Dans Settings → **"Networking"** → **"Generate Domain"**
→ Tu obtiens une URL comme `capaventure-backend.up.railway.app`

**Note cette URL** — tu en auras besoin pour le frontend.

---

## ÉTAPE 4 — Déployer le Frontend React

### 4a. Créer le service frontend

Dans ton projet Railway :
1. **"Add a service"** → **"GitHub Repo"** → même repo `capaventure`
2. Cette fois Root Directory = `frontend`

### 4b. Configurer

- **Root Directory** : `frontend`
- **Build Command** : `npm install && npm run build`
- **Start Command** : `npx serve dist -l 3000`

### 4c. Variables d'environnement frontend

```
VITE_API_URL=https://capaventure-backend.up.railway.app
```

### 4d. Mettre à jour vite.config.js pour la prod

Dans `frontend/vite.config.js`, le proxy ne fonctionne qu'en dev.
En production, axios doit pointer vers le vrai backend.

Crée `frontend/src/services/api.js` :

```javascript
import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
})

// Injecter le token automatiquement
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('cap_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export default api
```

Puis remplace tous les `axios.get('/api/...')` par `api.get('/api/...')` dans le code.

### 4e. Générer le domaine frontend

Settings → Networking → Generate Domain
→ `capaventure-frontend.up.railway.app`

**Mets à jour** la variable `FRONTEND_URL` du backend avec cette URL.

---

## ÉTAPE 5 — Créer le compte admin

Une fois tout déployé, crée ton compte admin via l'API :

```bash
curl -X POST https://capaventure-backend.up.railway.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "prenom": "Ton Prénom",
    "nom": "Ton Nom",
    "email": "admin@capaventure.fr",
    "password": "MotDePasseSecurise123!"
  }'
```

Puis passe-toi en admin directement dans Railway :

Dans le service MySQL → onglet **"Data"** (ou utilise un client MySQL comme TablePlus) :
```sql
UPDATE users SET role = 'admin' WHERE email = 'admin@capaventure.fr';
```

---

## ÉTAPE 6 — Vérifications finales

Checklist avant de partager le lien :

- [ ] Le backend répond : `https://ton-backend.up.railway.app/api/activities`
- [ ] Le frontend charge : `https://ton-frontend.up.railway.app`
- [ ] La connexion fonctionne
- [ ] Les emails arrivent (teste le mot de passe oublié)
- [ ] Une activité peut être créée depuis le back-office

---

## Coût estimé

| Service | Coût |
|---------|------|
| Railway Starter | 5$/mois (inclus dans le plan gratuit au début) |
| MySQL 1Go | ~1$/mois |
| Backend NestJS | ~2$/mois |
| Frontend | ~0.5$/mois |
| **Total** | **~3-4$/mois** (~3-4€) |

Railway offre **500h gratuites/mois** au démarrage — largement suffisant pour faire tester.

---

## Commandes utiles

### Voir les logs en temps réel
Dans Railway → clic sur le service → onglet "Logs"

### Redéployer après une modif
```bash
git add .
git commit -m "Ma modification"
git push
# Railway redéploie automatiquement !
```

### Accéder à la DB depuis ton PC
Dans Railway → MySQL → "Connect" → copie la connection string
Utilise TablePlus (gratuit) ou DBeaver pour te connecter.

---

## Alternative encore plus simple : Render.com

Si Railway pose problème :
- Frontend → **Vercel** (https://vercel.com) — gratuit, ultra simple pour React
- Backend → **Render** (https://render.com) — gratuit (mais lent au démarrage)
- DB → **PlanetScale** (https://planetscale.com) — MySQL gratuit

---

## En cas de problème

**Le backend ne démarre pas**
→ Vérifie les logs Railway, souvent c'est une variable d'env manquante

**Erreur CORS**
→ Vérifie que `FRONTEND_URL` dans le backend = l'URL exacte du frontend Railway

**Les emails n'arrivent pas**
→ Vérifie que le mot de passe d'application Gmail est correct
→ Active "Accès moins sécurisé" ou utilise un vrai mot de passe d'app

**La DB ne se connecte pas**
→ Vérifie que tu as bien utilisé les variables Railway `${{MySQL.MYSQLHOST}}` etc.
