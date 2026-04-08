# 🚀 Déploiement CapAventure sur Railway (~5€/mois)

## Pourquoi Railway ?
- ~5€/mois (Hobby plan) pour héberger backend + frontend + base MySQL
- Déploiement automatique depuis GitHub
- SSL gratuit, domaine custom possible
- MySQL inclus dans le plan

---

## 1. Préparer GitHub (5 min)

1. Créer un compte sur **github.com** si tu n'en as pas
2. Créer un nouveau dépôt privé : `capaventure`
3. Dans ton dossier projet, ouvrir un terminal et taper :

```bash
git init
git add .
git commit -m "initial commit"
git remote add origin https://github.com/TON_USERNAME/capaventure.git
git push -u origin main
```

---

## 2. Créer le projet Railway (10 min)

1. Aller sur **railway.app** → Sign up avec GitHub
2. **New Project** → **Deploy from GitHub repo** → choisir `capaventure`
3. Railway détecte automatiquement 2 services (backend et frontend)

---

## 3. Ajouter MySQL (2 min)

Dans Railway :
1. **New Service** → **Database** → **MySQL**
2. Une fois créé, copier la variable `DATABASE_URL` (onglet Variables)

---

## 4. Configurer le Backend (5 min)

Dans le service **backend**, onglet **Variables**, ajouter :

```
NODE_ENV=production
JWT_SECRET=GENERE_UNE_CLE_ALEATOIRE_64_CHARS_ICI
DATABASE_URL=<collé depuis MySQL service>
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=ton.email@gmail.com
MAIL_PASS=mot_de_passe_app_gmail
MAIL_FROM=CapAventure <ton.email@gmail.com>
ADMIN_EMAIL=ton.email@gmail.com
FRONTEND_URL=https://TON_FRONTEND.up.railway.app
ALLOWED_ORIGINS=https://TON_FRONTEND.up.railway.app
```

**Générer JWT_SECRET ici :**
https://www.allkeysgenerator.com/Random/Security-Encryption-Key-Generator.aspx
(choisir 512-bit)

**Mot de passe Gmail :**
https://myaccount.google.com/apppasswords
→ Créer un mot de passe pour "Mail" → "Autre (CapAventure)"

Dans le service backend, onglet **Settings** :
- Root Directory : `backend`
- Build Command : `npm install && npm run build`
- Start Command : `node dist/main.js`

---

## 5. Configurer le Frontend (5 min)

Dans le service **frontend**, onglet **Variables**, ajouter :

```
VITE_API_URL=https://TON_BACKEND.up.railway.app
```

Dans le service frontend, onglet **Settings** :
- Root Directory : `frontend`
- Build Command : `npm install && npm run build`
- Start Command : `npx serve dist -l $PORT --single`

---

## 6. Importer la base de données (10 min)

Une fois MySQL créé, Railway affiche les credentials.
Utiliser **TablePlus** ou **DBeaver** (gratuit) pour se connecter :
- Host / Port / User / Password / Database → dans les variables Railway MySQL

Puis importer dans l'ordre :
1. `database/migration_subscription.sql`
2. `database/migration_v2.sql`
3. `database/planning_2025_2027.sql`

---

## 7. Créer le compte admin (2 min)

Dans TablePlus, exécuter :

```sql
INSERT INTO users (prenom, nom, email, password, role)
VALUES (
  'Ton prénom', 'Ton nom', 'ton@email.com',
  '$2b$10$HASH_GENERE_PAR_BCRYPT',
  'admin'
);
```

⚠️ Le mot de passe doit être hashé en bcrypt.
Utiliser : https://bcrypt-generator.com/ (rounds: 10)

Ou plus simple : s'inscrire normalement sur le site, puis passer le rôle en admin via SQL :
```sql
UPDATE users SET role='admin' WHERE email='ton@email.com';
```

---

## 8. Domaine custom (optionnel, gratuit)

Dans Railway, onglet **Settings** → **Custom Domain** → ajouter ton domaine.
Modifier les DNS chez ton registrar pour pointer vers Railway.

---

## 9. Volumes pour les uploads (optionnel)

Si tu veux que les photos uploadées persistent entre les redémarrages :
1. Railway → ton service backend → **Add Volume**
2. Mount path : `/app/uploads`
3. Ajouter la variable : `UPLOADS_PATH=/app/uploads`

---

## Récapitulatif des coûts

| Service | Coût |
|---------|------|
| Railway Hobby Plan | ~5$/mois |
| MySQL (inclus) | 0$ |
| Frontend (inclus) | 0$ |
| SSL (inclus) | 0$ |
| **Total** | **~5$/mois** |

---

## En cas de problème

- Voir les logs : Railway → ton service → onglet **Logs**
- Redémarrer un service : **Settings** → **Restart**
- Support : docs.railway.app
