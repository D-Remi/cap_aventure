# 🏔️ CapAventure — Guide de démarrage (v4)

Activités outdoor encadrées pour les 6–14 ans en Haute-Savoie.

---

## Stack technique

| Couche     | Technologie                        |
|------------|------------------------------------|
| Frontend   | React + Vite + React Router        |
| Backend    | NestJS (Node.js) + TypeORM         |
| Base de données | MySQL / MariaDB               |
| Auth       | JWT (access token 7 jours)         |
| Emails     | Nodemailer (SMTP Gmail ou autre)   |

---

## Prérequis

- **Node.js** v20+ → https://nodejs.org
- **MySQL** v8+ ou **MariaDB** v10.6+
- Un compte Gmail (pour les emails)

---

## 1. Base de données MySQL

```sql
CREATE DATABASE capaventure CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'capaventure'@'localhost' IDENTIFIED BY 'capaventure';
GRANT ALL PRIVILEGES ON capaventure.* TO 'capaventure'@'localhost';
FLUSH PRIVILEGES;
```

---

## 2. Configurer le fichier .env

Édite `backend/.env` :

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=capaventure
DB_PASS=capaventure
DB_NAME=capaventure
JWT_SECRET=change-moi-en-production

# Email Gmail
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_SECURE=false
MAIL_USER=ton.email@gmail.com
MAIL_PASS=xxxx-xxxx-xxxx-xxxx   ← mot de passe d'application Gmail
MAIL_FROM=CapAventure <ton.email@gmail.com>
ADMIN_EMAIL=ton.email@gmail.com

FRONTEND_URL=http://localhost:3000
PORT=3001
NODE_ENV=development
```

### Configurer Gmail

1. Aller sur https://myaccount.google.com/security
2. Activer la **validation en 2 étapes**
3. Aller dans **Mots de passe des applications**
4. Créer un mot de passe pour "CapAventure"
5. Coller le mot de passe généré dans `MAIL_PASS`

---

## 3. Lancer le backend

```bash
cd backend
npm install
npm run start:dev
```

✅ API sur **http://localhost:3001/api**

---

## 4. Lancer le frontend

```bash
cd frontend
npm install
npm run dev
```

✅ Site sur **http://localhost:3000**

---

## 5. Créer le compte admin

```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"prenom":"Ton Prénom","nom":"Nom","email":"admin@capaventure.fr","password":"motdepasse123"}'
```

```sql
UPDATE users SET role = 'admin' WHERE email = 'admin@capaventure.fr';
```

---

## Pages & routes

| URL                     | Description                        | Accès     |
|-------------------------|------------------------------------|-----------|
| `/`                     | Site vitrine                       | Public    |
| `/calendrier`           | Calendrier des activités           | Public    |
| `/login`                | Connexion                          | Public    |
| `/register`             | Inscription                        | Public    |
| `/forgot-password`      | Mot de passe oublié                | Public    |
| `/reset-password?token` | Réinitialiser le mot de passe      | Public    |
| `/dashboard`            | Espace parent                      | Connecté  |
| `/profil`               | Mon profil                         | Connecté  |
| `/admin`                | Back-office tableau de bord        | Admin     |
| `/admin/activities`     | Gérer les activités                | Admin     |
| `/admin/registrations`  | Gérer les inscriptions             | Admin     |
| `/admin/users`          | Gérer les familles                 | Admin     |
| `/admin/interest`       | Demandes de contact                | Admin     |

---

## Emails automatiques

| Déclencheur                     | Destinataire  | Email envoyé                    |
|---------------------------------|---------------|---------------------------------|
| Création de compte              | Parent        | Email de bienvenue              |
| Nouvelle inscription            | Parent        | Inscription reçue (en attente)  |
| Admin confirme une inscription  | Parent        | Inscription confirmée ✅         |
| Admin annule une inscription    | Parent        | Inscription annulée ❌           |
| Demande mot de passe oublié     | Parent        | Lien de réinitialisation        |
| Nouveau formulaire vitrine      | Admin         | Notification de contact         |

---

## API Routes

### Auth
| Méthode | Route                  | Auth  |
|---------|------------------------|-------|
| POST    | /api/auth/register     | Non   |
| POST    | /api/auth/login        | Non   |
| POST    | /api/auth/forgot-password | Non |
| POST    | /api/auth/reset-password | Non  |
| PATCH   | /api/auth/profile      | Oui   |

### Activités, Enfants, Inscriptions, Contact
→ Voir documentation complète dans le code source.


Activités outdoor encadrées pour les 6–14 ans en Haute-Savoie.

---

## Stack technique

| Couche     | Technologie                        |
|------------|------------------------------------|
| Frontend   | React + Vite + React Router        |
| Backend    | NestJS (Node.js) + TypeORM         |
| Base de données | MySQL / MariaDB               |
| Auth       | JWT (access token 7 jours)         |

---

## Prérequis

- **Node.js** v20+ → https://nodejs.org
- **MySQL** v8+ ou **MariaDB** v10.6+
- **npm** v10+ (inclus avec Node.js)

---

## 1. Cloner / récupérer le projet

```bash
# Si tu as Git
git clone <url-du-repo> capaventure
cd capaventure

# Sinon, crée le dossier et copie les fichiers dedans
mkdir capaventure && cd capaventure
```

---

## 2. Créer la base de données MySQL

Connecte-toi à MySQL (via XAMPP, terminal, ou MySQL Workbench) :

```sql
CREATE DATABASE capaventure CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'capaventure'@'localhost' IDENTIFIED BY 'capaventure';
GRANT ALL PRIVILEGES ON capaventure.* TO 'capaventure'@'localhost';
FLUSH PRIVILEGES;
```

> **Note :** TypeORM crée automatiquement les tables au démarrage en mode `development`.

---

## 3. Installer et lancer le backend

```bash
cd backend

# Installer les dépendances
npm install

# Vérifier le fichier .env (déjà créé, adapter si besoin)
cat .env

# Lancer en mode développement
npm run start:dev
```

✅ L'API démarre sur **http://localhost:3001/api**

---

## 4. Installer et lancer le frontend

```bash
cd frontend  # (depuis la racine du projet)

# Installer les dépendances
npm install

# Lancer en mode développement
npm run dev
```

✅ Le site est accessible sur **http://localhost:3000**

---

## 5. Créer le premier compte admin

Une fois le backend démarré, crée ton compte via l'API :

```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "prenom": "Ton Prénom",
    "nom": "Ton Nom",
    "email": "admin@capaventure.fr",
    "password": "motdepasse123"
  }'
```

Puis passe ce compte en admin directement en base :

```sql
UPDATE users SET role = 'admin' WHERE email = 'admin@capaventure.fr';
```

---

## Structure du projet

```
capaventure/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/        # Navbar, Footer, ProtectedRoute
│   │   │   └── sections/      # Hero, Projet, Valeurs, Activites, Clubs, Contact
│   │   ├── context/           # AuthContext (état global authentification)
│   │   ├── hooks/             # useReveal (animations scroll)
│   │   ├── pages/             # HomePage, LoginPage, RegisterPage, DashboardPage
│   │   ├── styles/            # global.css (variables CSS + utilitaires)
│   │   └── App.jsx            # Routing principal
│   └── package.json
│
└── backend/
    ├── src/
    │   ├── config/            # database.config.ts (TypeORM + JWT)
    │   ├── common/guards/     # JwtAuthGuard, RolesGuard, CurrentUser
    │   └── modules/
    │       ├── auth/          # login, register, JWT strategy
    │       ├── users/         # CRUD utilisateurs
    │       ├── children/      # CRUD enfants (liés aux parents)
    │       ├── activities/    # CRUD activités
    │       ├── registrations/ # Inscriptions enfants ↔ activités
    │       └── interest/      # Formulaire de contact vitrine
    └── package.json
```

---

## Routes API

### Auth
| Méthode | Route              | Description          | Auth  |
|---------|--------------------|----------------------|-------|
| POST    | /api/auth/register | Créer un compte      | Non   |
| POST    | /api/auth/login    | Se connecter         | Non   |

### Activités
| Méthode | Route              | Description              | Auth    |
|---------|--------------------|--------------------------|---------|
| GET     | /api/activities    | Liste activités à venir  | Non     |
| GET     | /api/activities?all=true | Toutes les activités | Non  |
| POST    | /api/activities    | Créer une activité       | Admin   |
| PUT     | /api/activities/:id| Modifier une activité    | Admin   |
| DELETE  | /api/activities/:id| Supprimer une activité   | Admin   |

### Enfants
| Méthode | Route              | Description              | Auth    |
|---------|--------------------|--------------------------|---------|
| GET     | /api/children      | Mes enfants (ou tous si admin) | Oui |
| POST    | /api/children      | Ajouter un enfant        | Parent  |
| DELETE  | /api/children/:id  | Supprimer un enfant      | Parent/Admin |

### Inscriptions
| Méthode | Route                         | Description                  | Auth   |
|---------|-------------------------------|------------------------------|--------|
| GET     | /api/registrations/mine       | Mes inscriptions             | Parent |
| GET     | /api/registrations            | Toutes les inscriptions      | Admin  |
| GET     | /api/registrations/activity/:id | Inscrits par activité      | Admin  |
| POST    | /api/registrations            | S'inscrire à une activité    | Parent |
| PATCH   | /api/registrations/:id/status | Changer le statut            | Admin  |
| DELETE  | /api/registrations/:id        | Annuler une inscription      | Parent/Admin |

### Formulaire d'intérêt
| Méthode | Route           | Description              | Auth  |
|---------|-----------------|--------------------------|-------|
| POST    | /api/interest   | Soumettre le formulaire  | Non   |
| GET     | /api/interest   | Voir les demandes        | Admin |

---

## Prochaines étapes

- [ ] Back-office admin (tableau de bord, gestion activités, liste inscrits)
- [ ] Calendrier des activités
- [ ] Export PDF liste des inscrits
- [ ] Notifications email (Nodemailer)
- [ ] Upload photos activités

---

## Dépannage fréquent

**Erreur de connexion MySQL :**
Vérifie que MySQL est bien démarré et que les credentials dans `.env` sont corrects.

**Port déjà utilisé :**
Change `PORT=3001` dans `.env` ou `port: 3000` dans `vite.config.js`.

**Tables pas créées :**
Vérifie que `synchronize: true` est actif (c'est le cas en `NODE_ENV=development`).
