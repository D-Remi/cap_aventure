# CapAventure v50 — Installation

Répit handicap et accompagnement éducatif — Gironde (33)

## 1. Base de données

**Nouvelle installation** (base vierge, efface tout) :
```bash
mysql -u capaventure -p capaventure < database/capaventure_v50_schema.sql
```

**Base existante** déjà migrée en v50 :
```bash
mysql -u capaventure -p capaventure < database/migrate_contact_v50.sql
```

Faites une sauvegarde avant dans tous les cas :
```bash
mysqldump -u capaventure -p capaventure > backup.sql
```

## 2. Compte administrateur

Générez le hash du mot de passe :
```bash
cd backend
node -e "console.log(require('bcrypt').hashSync('VotreMotDePasse', 10))"
```

Puis créez le compte (remplacez email et hash) :
```sql
INSERT INTO users (email, password, role, prenom, nom, actif)
VALUES ('vous@email.fr', '$2b$10$LE_HASH_GENERE', 'admin', 'Prenom', 'Nom', 1);
```

## 3. Backend

```bash
cd backend
npm install
rm -rf dist
npm run build
npm run start:prod        # ou : pm2 restart capaventure-api --update-env
```

Variables d'environnement requises dans `.env` :
```
DB_HOST=localhost
DB_USER=capaventure
DB_PASS=votre_mot_de_passe
DB_NAME=capaventure
JWT_SECRET=une_chaine_longue_et_aleatoire
FRONTEND_URL=https://capaventure33.fun
ALLOWED_ORIGINS=https://capaventure33.fun
NODE_ENV=production
```

Optionnel (emails) : `MAIL_USER`, `MAIL_PASS`, `ADMIN_EMAIL`.
Sans ces variables, les emails sont désactivés sans bloquer l'application.

## 4. Frontend

```bash
cd frontend
npm install
npm run build
```

Le dossier `dist/` est à servir par Nginx.

## Structure

**Backend** — 14 modules : auth, users, children, seances, documents,
messages, contact, photos, contrats, compta, temoignages, notifications,
email, upload.

**Frontend** — page publique (hero, 2 services, méthode, présentation,
contact), espace famille (suivi, enfants, documents, photos, contrats,
messages), espace admin (12 sections).

## Points d'attention

- Le module `seances` est le cœur du suivi : notes privées filtrées côté
  serveur, comptes-rendus partagés uniquement si `cr_partage` est activé.
- `synchronize` TypeORM est actif hors production. En production, les
  migrations SQL sont à appliquer manuellement.
- Numéro WhatsApp configuré dans `frontend/src/components/sections/Contact.jsx`
  et `frontend/src/components/layout/Footer.jsx`.
