# 🚀 Déploiement CapAventure sur Ionos VPS

## Ce que tu as
- VPS Ionos Linux (Ubuntu 22.04)
- Accès SSH root
- IP publique fournie par Ionos dans ton espace client

---

## ÉTAPE 1 — Récupérer les infos de connexion (2 min)

Dans ton espace client Ionos :
**Menu** → **Serveur & Cloud** → ton VPS → **Accès**

Tu vois :
- **Adresse IP** : ex `217.160.0.1`
- **Utilisateur** : `root`
- **Mot de passe** : celui que tu as défini à la commande

---

## ÉTAPE 2 — Se connecter en SSH (2 min)

**Windows** → ouvrir **PowerShell** ou **Windows Terminal** :
```bash
ssh root@217.160.0.1
# remplacer par ton IP Ionos
```

**Mac/Linux** → ouvrir le Terminal :
```bash
ssh root@217.160.0.1
```

Taper `yes` à la première connexion, puis ton mot de passe.

---

## ÉTAPE 3 — Installer tout ce qu'il faut (15 min)

Copier-coller ce bloc en une seule fois :

```bash
# Mise à jour système
apt update && apt upgrade -y

# Node.js 20 LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# PM2 (garde le backend en vie)
npm install -g pm2

# Nginx (serveur web)
apt install -y nginx

# MySQL
apt install -y mysql-server

# Certbot (SSL gratuit Let's Encrypt)
apt install -y certbot python3-certbot-nginx

# Git
apt install -y git

# Utilitaires
apt install -y ufw curl wget unzip

# Vérifier
echo "Node: $(node -v)"
echo "NPM: $(npm -v)"
echo "Nginx: $(nginx -v 2>&1)"
echo "MySQL: $(mysql --version)"
```

---

## ÉTAPE 4 — Configurer le pare-feu (2 min)

```bash
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw --force enable
ufw status
```

---

## ÉTAPE 5 — Configurer MySQL (5 min)

```bash
# Sécuriser MySQL
mysql_secure_installation
# → Appuyer sur Entrée pour le mot de passe root actuel
# → Y pour définir un mot de passe root
# → Y Y Y Y pour le reste

# Créer la base CapAventure
mysql -u root -p
```

Dans MySQL, taper :
```sql
CREATE DATABASE capaventure CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'capaventure'@'localhost' IDENTIFIED BY 'CHOISIR_UN_MOT_DE_PASSE_FORT';
GRANT ALL PRIVILEGES ON capaventure.* TO 'capaventure'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

⚠️ Noter le mot de passe — tu en auras besoin plus tard.

---

## ÉTAPE 6 — Mettre le code sur GitHub (5 min)

**Sur ton PC** (pas sur le VPS), ouvrir un terminal dans le dossier du projet :

```bash
git init
git add .
git commit -m "version initiale"
```

Créer un compte sur **github.com** → New repository → `capaventure` (privé) :

```bash
git remote add origin https://github.com/TON_USERNAME/capaventure.git
git push -u origin main
```

---

## ÉTAPE 7 — Cloner le code sur le VPS (3 min)

De retour dans le terminal SSH :

```bash
mkdir -p /var/www/capaventure
cd /var/www/capaventure
git clone https://github.com/TON_USERNAME/capaventure.git .
ls
# → backend/  frontend/  database/  nginx.conf  deploy.sh ...
```

---

## ÉTAPE 8 — Créer le fichier .env (5 min)

```bash
cp /var/www/capaventure/backend/.env.production /var/www/capaventure/backend/.env
nano /var/www/capaventure/backend/.env
```

Modifier ces valeurs :
```
DB_PASS=le_mot_de_passe_mysql_créé_étape_5
JWT_SECRET=COLLER_UNE_CLE_GENEREE_ICI
MAIL_USER=ton.email@gmail.com
MAIL_PASS=mot_de_passe_app_gmail
ADMIN_EMAIL=ton.email@gmail.com
FRONTEND_URL=https://capaventure74.fr
ALLOWED_ORIGINS=https://capaventure74.fr,https://www.capaventure74.fr
```

Générer JWT_SECRET : https://www.allkeysgenerator.com → 512-bit → copier
Mot de passe Gmail : https://myaccount.google.com/apppasswords → "CapAventure"

**Ctrl+X** → **Y** → **Entrée** pour sauvegarder.

---

## ÉTAPE 9 — Builder le backend (5 min)

```bash
cd /var/www/capaventure/backend
npm install
npm run build

# Vérifier que ça a compilé
ls dist/
# → main.js  ...
```

---

## ÉTAPE 10 — Démarrer le backend avec PM2 (3 min)

```bash
cd /var/www/capaventure
pm2 start ecosystem.config.js
pm2 save
pm2 startup
# Copier-coller la commande affichée (commence par "sudo env PATH=...")

# Vérifier
pm2 status
# → capaventure-api   online   ✅
```

---

## ÉTAPE 11 — Builder le frontend (5 min)

```bash
cd /var/www/capaventure/frontend
npm install
npm run build

# Vérifier
ls dist/
# → index.html  assets/  ...
```

---

## ÉTAPE 12 — Configurer le domaine (5 min)

Dans ton espace client **Ionos** → **Domaines & SSL** → **capaventure74.fr** → **DNS** :

Modifier ou ajouter :
```
Type  Nom   Valeur          TTL
A     @     217.160.0.1     3600   ← ton IP VPS Ionos
A     www   217.160.0.1     3600
```

Supprimer tous les autres enregistrements A qui pointaient ailleurs.

> ⏳ Attendre 5 à 30 min que le DNS se propage avant de continuer.

---

## ÉTAPE 13 — Configurer Nginx (5 min)

**D'abord, config temporaire HTTP** pour obtenir le SSL :

```bash
cat > /etc/nginx/sites-available/capaventure << 'EOF'
server {
    listen 80;
    server_name capaventure74.fr www.capaventure74.fr;

    root /var/www/capaventure/frontend/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://127.0.0.1:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /uploads/ {
        alias /var/www/capaventure/backend/uploads/;
    }
}
EOF

ln -s /etc/nginx/sites-available/capaventure /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl reload nginx
```

---

## ÉTAPE 14 — Obtenir le SSL gratuit (3 min)

```bash
certbot --nginx -d capaventure74.fr -d www.capaventure74.fr
# → Entrer ton email
# → Y pour les conditions
# → Y ou N pour les emails marketing
# → Certbot configure le SSL automatiquement ✅
```

Ensuite copier la config Nginx complète (avec SSL) :

```bash
cp /var/www/capaventure/nginx.conf /etc/nginx/sites-available/capaventure
nginx -t && systemctl reload nginx
```

---

## ÉTAPE 15 — Importer la base de données (5 min)

```bash
cd /var/www/capaventure
mysql -u capaventure -p capaventure < database/migration_subscription.sql
mysql -u capaventure -p capaventure < database/migration_v2.sql
mysql -u capaventure -p capaventure < database/planning_2025_2027.sql
```

---

## ÉTAPE 16 — Créer le compte admin (2 min)

S'inscrire normalement sur **https://capaventure74.fr/register**, puis :

```bash
mysql -u capaventure -p capaventure
```

```sql
UPDATE users SET role='admin' WHERE email='ton@email.com';
EXIT;
```

---

## 🎉 C'est en ligne !

Ouvrir **https://capaventure74.fr** → le site doit s'afficher avec le cadenas SSL.

---

## Commandes quotidiennes

```bash
# Mettre à jour le site après un git push depuis ton PC
cd /var/www/capaventure && ./deploy.sh

# Voir les logs du backend
pm2 logs capaventure-api

# Redémarrer le backend
pm2 restart capaventure-api

# Statut général
pm2 status
systemctl status nginx
```

---

## En cas de problème

```bash
# Nginx ne démarre pas
nginx -t                          # voir l'erreur
journalctl -u nginx --no-pager   # logs détaillés

# Backend planté
pm2 logs capaventure-api --lines 50

# Base de données inaccessible
systemctl status mysql
systemctl start mysql
```
