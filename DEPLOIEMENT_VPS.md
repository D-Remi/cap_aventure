# 🚀 Déploiement CapAventure sur VPS Hostinger

## 💰 Coût total
| | Prix |
|--|--|
| VPS KVM1 Hostinger | ~4€/mois |
| Domaine capaventure74.fr | ~7€/an (~0.60€/mois) |
| **Total** | **~4.60€/mois** |

---

## ÉTAPE 1 — Acheter chez Hostinger (10 min)

1. Aller sur **hostinger.fr**
2. **Hébergement** → **VPS** → choisir **KVM 1** (~4€/mois)
   - OS : **Ubuntu 22.04 LTS**
   - Datacenter : **France** ou **Europe**
3. En même temps, chercher le domaine **capaventure74.fr** → l'ajouter au panier
4. Payer — tu reçois un email avec :
   - L'adresse IP de ton VPS (ex: `91.234.56.78`)
   - Le mot de passe root temporaire

---

## ÉTAPE 2 — Configurer les DNS du domaine (5 min)

Dans le panneau Hostinger → **Domaines** → **capaventure74.fr** → **DNS / Nameservers** :

Ajouter ces enregistrements :
```
Type  Nom   Valeur
A     @     91.234.56.78   (ton IP VPS)
A     www   91.234.56.78   (ton IP VPS)
```

> ⏳ La propagation DNS prend 5 minutes à 2h

---

## ÉTAPE 3 — Se connecter au VPS en SSH (2 min)

**Sur Windows** : télécharger **PuTTY** ou utiliser Windows Terminal
**Sur Mac/Linux** : ouvrir le Terminal

```bash
ssh root@91.234.56.78
# Entrer le mot de passe reçu par email
```

Une fois connecté, changer le mot de passe root :
```bash
passwd
```

---

## ÉTAPE 4 — Installer les dépendances (15 min)

Copier-coller ces commandes dans l'ordre :

```bash
# Mettre à jour Ubuntu
apt update && apt upgrade -y

# Installer Node.js 20 LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# Vérifier
node --version   # doit afficher v20.x.x
npm --version

# Installer PM2 (gestionnaire de processus)
npm install -g pm2

# Installer Nginx (serveur web)
apt install -y nginx

# Installer MySQL
apt install -y mysql-server

# Installer Certbot (SSL gratuit)
apt install -y certbot python3-certbot-nginx

# Installer Git
apt install -y git

# Vérifier tout
nginx -v && mysql --version && git --version
```

---

## ÉTAPE 5 — Configurer MySQL (10 min)

```bash
# Sécuriser MySQL
mysql_secure_installation
# Répondre : Y, Y, Y, Y, Y

# Se connecter à MySQL
mysql -u root -p

# Créer la base et l'utilisateur
CREATE DATABASE capaventure CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'capaventure'@'localhost' IDENTIFIED BY 'MON_MOT_DE_PASSE_FORT';
GRANT ALL PRIVILEGES ON capaventure.* TO 'capaventure'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

---

## ÉTAPE 6 — Déposer le code sur GitHub (5 min)

Sur ton PC (pas sur le VPS) :

1. Créer un compte **github.com** (gratuit)
2. Créer un dépôt privé nommé `capaventure`
3. Ouvrir un terminal dans le dossier du projet :

```bash
git init
git add .
git commit -m "première version"
git remote add origin https://github.com/TON_USERNAME/capaventure.git
git push -u origin main
```

---

## ÉTAPE 7 — Cloner le code sur le VPS (5 min)

De retour dans le terminal SSH du VPS :

```bash
# Créer le dossier
mkdir -p /var/www/capaventure
cd /var/www/capaventure

# Cloner depuis GitHub
git clone https://github.com/TON_USERNAME/capaventure.git .

# Vérifier que les fichiers sont là
ls
# → backend/ frontend/ database/ deploy.sh nginx.conf ...
```

---

## ÉTAPE 8 — Créer le fichier .env (5 min)

```bash
# Copier le template
cp backend/.env.production backend/.env

# Éditer avec nano
nano backend/.env
```

Modifier les valeurs CHANGE_MOI :
- `DB_PASS` : le mot de passe MySQL créé à l'étape 5
- `JWT_SECRET` : générer sur https://www.allkeysgenerator.com (512-bit)
- `MAIL_USER`, `MAIL_PASS` : tes infos Gmail
- Sauvegarder : **Ctrl+X**, puis **Y**, puis **Entrée**

---

## ÉTAPE 9 — Builder et démarrer le backend (10 min)

```bash
cd /var/www/capaventure

# Installer et builder le backend
cd backend
npm install
npm run build
cd ..

# Démarrer avec PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup   # copier-coller la commande affichée

# Vérifier que ça tourne
pm2 status
# → capaventure-api  online ✓
```

---

## ÉTAPE 10 — Builder le frontend (5 min)

```bash
cd /var/www/capaventure/frontend
npm install
npm run build

# Vérifier que le dossier dist est créé
ls dist/
# → index.html  assets/  ...
```

---

## ÉTAPE 11 — Configurer Nginx (5 min)

```bash
# Copier la config Nginx
cp /var/www/capaventure/nginx.conf /etc/nginx/sites-available/capaventure

# Activer le site
ln -s /etc/nginx/sites-available/capaventure /etc/nginx/sites-enabled/

# Désactiver le site par défaut
rm -f /etc/nginx/sites-enabled/default

# Tester la config
nginx -t
# → syntax is ok ✓

# Pour l'instant, commenter les lignes SSL (pas encore de certificat)
# Modifier temporairement le fichier pour écouter sur le port 80 sans SSL
nano /etc/nginx/sites-available/capaventure
# → Commenter les 2 blocs "return 301" et le block ssl pour l'instant
# → Mettre listen 80 directement sur le 2ème server block

# Redémarrer Nginx
systemctl restart nginx
systemctl enable nginx
```

---

## ÉTAPE 12 — Obtenir le certificat SSL (5 min)

```bash
# Obtenir le certificat gratuit Let's Encrypt
certbot --nginx -d capaventure74.fr -d www.capaventure74.fr

# Certbot modifie automatiquement nginx.conf
# Recopier notre config complète avec SSL
cp /var/www/capaventure/nginx.conf /etc/nginx/sites-available/capaventure
nginx -t && systemctl reload nginx
```

---

## ÉTAPE 13 — Importer la base de données (5 min)

```bash
# Importer les migrations dans l'ordre
mysql -u capaventure -p capaventure < /var/www/capaventure/database/migration_subscription.sql
mysql -u capaventure -p capaventure < /var/www/capaventure/database/migration_v2.sql
mysql -u capaventure -p capaventure < /var/www/capaventure/database/planning_2025_2027.sql
```

---

## ÉTAPE 14 — Créer le compte admin (2 min)

```bash
mysql -u capaventure -p capaventure
```

```sql
-- S'inscrire d'abord sur le site, puis passer en admin :
UPDATE users SET role='admin' WHERE email='ton@email.com';
EXIT;
```

---

## ÉTAPE 15 — Tester 🎉

Ouvrir **https://capaventure74.fr** dans le navigateur.

Si tout fonctionne :
- La page d'accueil s'affiche ✓
- `/admin` → connexion avec ton compte ✓
- Cadenas SSL vert dans la barre d'adresse ✓

---

## Commandes utiles au quotidien

```bash
# Voir les logs en direct
pm2 logs capaventure-api

# Redémarrer le backend
pm2 restart capaventure-api

# Mettre à jour le site (après un git push depuis ton PC)
cd /var/www/capaventure && ./deploy.sh

# Voir l'utilisation des ressources
pm2 monit

# Renouveler SSL (automatique, mais vérifier)
certbot renew --dry-run
```

---

## ❓ En cas de problème

**Le site ne s'affiche pas :**
```bash
systemctl status nginx
pm2 status
pm2 logs capaventure-api --lines 50
```

**Erreur de base de données :**
```bash
systemctl status mysql
```

**Support Hostinger :** chat 24h/7j sur hostinger.fr
