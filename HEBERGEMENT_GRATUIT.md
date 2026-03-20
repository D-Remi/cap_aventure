# 🚀 Hébergement gratuit — Alternatives à Railway

Railway n'est plus gratuit ? Voici 3 solutions entièrement gratuites.

---

## ✅ Option recommandée : Render + Vercel + Clever Cloud

La combinaison la plus stable et la plus généreuse en gratuit.

| Composant | Service | Coût |
|-----------|---------|------|
| Frontend React | **Vercel** | Gratuit illimité |
| Backend NestJS | **Render** | Gratuit (750h/mois) |
| Base MySQL | **Clever Cloud** | Gratuit (256Mo) |

---

## 1. Base de données MySQL — Clever Cloud

1. Va sur https://console.clever-cloud.com
2. Crée un compte gratuit
3. **"Create"** → **"an add-on"** → **"MySQL"**
4. Choisis le plan **DEV** (gratuit, 256Mo)
5. Dans le dashboard de l'add-on, note :
   - `HOST`, `PORT`, `USER`, `PASSWORD`, `DATABASE`

---

## 2. Backend NestJS — Render

### 2a. Préparer le backend

Ajoute un fichier `backend/Procfile` :
```
web: node dist/main.js
```

Assure-toi que `backend/package.json` a le bon script :
```json
"scripts": {
  "build": "nest build",
  "start": "node dist/main.js",
  "start:dev": "nest start --watch"
}
```

### 2b. Déployer sur Render

1. Va sur https://render.com → connexion avec GitHub
2. **"New +"** → **"Web Service"**
3. Connecte ton repo GitHub → sélectionne le dossier `backend`
4. Configure :
   - **Root Directory** : `backend`
   - **Build Command** : `npm install && npm run build`
   - **Start Command** : `node dist/main.js`
   - **Plan** : Free
5. Dans **"Environment"**, ajoute toutes les variables :

```
NODE_ENV=production
PORT=10000
DB_HOST=<clever cloud host>
DB_PORT=<clever cloud port>
DB_USER=<clever cloud user>
DB_PASS=<clever cloud password>
DB_NAME=<clever cloud database>
JWT_SECRET=une-cle-aleatoire-longue
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_SECURE=false
MAIL_USER=ton@gmail.com
MAIL_PASS=ton-mot-de-passe-app-gmail
MAIL_FROM=CapAventure <ton@gmail.com>
ADMIN_EMAIL=ton@gmail.com
FRONTEND_URL=https://capaventure.vercel.app
```

6. Cliquer **"Create Web Service"**
7. Render te donne une URL : `https://capaventure-api.onrender.com`

> ⚠️ **Plan gratuit Render** : le service s'endort après 15 min d'inactivité.
> Premier accès = ~30 secondes de démarrage. Parfait pour tester.

---

## 3. Frontend React — Vercel

### 3a. Préparer le frontend

Crée `frontend/.env.production` :
```
VITE_API_URL=https://capaventure-api.onrender.com
```

### 3b. Déployer sur Vercel

1. Va sur https://vercel.com → connexion avec GitHub
2. **"Add New Project"** → sélectionne ton repo
3. Configure :
   - **Framework Preset** : Vite
   - **Root Directory** : `frontend`
   - **Build Command** : `npm run build`
   - **Output Directory** : `dist`
4. Dans **"Environment Variables"** ajoute :
   ```
   VITE_API_URL=https://capaventure-api.onrender.com
   ```
5. Clique **"Deploy"**
6. Vercel te donne une URL : `https://capaventure.vercel.app`

### 3c. Mettre à jour le backend

Dans les variables Render, mets à jour :
```
FRONTEND_URL=https://capaventure.vercel.app
```

---

## 4. Créer le compte admin

```bash
curl -X POST https://capaventure-api.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "prenom": "Ton Prénom",
    "nom": "Nom",
    "email": "admin@capaventure.fr",
    "password": "MotDePasseFort123!"
  }'
```

Puis passe-toi en admin via Clever Cloud :
→ Dashboard Clever Cloud → ton add-on MySQL → **"PhpMyAdmin"**
```sql
UPDATE users SET role = 'admin' WHERE email = 'admin@capaventure.fr';
```

---

## 5. Résumé des URLs finales

| Service | URL |
|---------|-----|
| Site web | https://capaventure.vercel.app |
| API | https://capaventure-api.onrender.com |
| Back-office | https://capaventure.vercel.app/admin |

---

## ⚡ Alternative encore plus simple : Koyeb

Koyeb propose 2 services gratuits permanents (pas de sleep comme Render) :

1. https://app.koyeb.com → connexion GitHub
2. **"Deploy"** → **"GitHub"** → ton repo
3. **Root directory** : `backend`
4. **Run command** : `node dist/main.js`
5. **Build command** : `npm install && npm run build`
6. Ajouter les variables d'env

Pour le frontend : Vercel reste le meilleur choix.

---

## 🔧 Dépannage

**CORS error sur Vercel**
→ Vérifie `FRONTEND_URL` dans les variables Render = URL exacte Vercel

**Le backend dort (Render)**
→ Normal en plan gratuit. Pour éviter ça, utilise un service de "ping" :
→ https://uptimerobot.com — gratuit, ping ton API toutes les 5 min pour le garder éveillé

**Erreur de connexion MySQL**
→ Clever Cloud utilise souvent un port non-standard (ex: 3306 ou 21852).
→ Vérifie bien DB_PORT dans les variables d'env.

**Les tables ne se créent pas**
→ Vérifie que `NODE_ENV=production` est bien mis — sinon `synchronize` est false.
→ Solution : passe temporairement `synchronize: true` dans `database.config.ts` pour le premier démarrage.
