# 🚀 Déploiement sur Ionos VPS — capaventure74.fun

## Infos du projet
- VPS : `/var/www/cap_aventure/`
- Domaine : `capaventure74.fun`
- Backend port : `3001`
- Nginx + Certbot déjà configurés

---

## Installation initiale (une seule fois)

### 1. Connexion SSH
```bash
ssh root@TON_IP_IONOS
```

### 2. Installer Node.js 20 + PM2
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs
npm install -g pm2
```

### 3. Cloner le projet
```bash
mkdir -p /var/www/cap_aventure
cd /var/www/cap_aventure
git clone https://github.com/TON_USERNAME/capaventure.git .
```

### 4. Créer le .env
```bash
cp backend/.env.example backend/.env
nano backend/.env
# Remplir : DB_PASS, JWT_SECRET, MAIL_USER, MAIL_PASS
```

### 5. MySQL — créer la base
```bash
mysql -u root -p
```
```sql
CREATE DATABASE capaventure CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'capaventure'@'localhost' IDENTIFIED BY 'TON_MOT_DE_PASSE';
GRANT ALL PRIVILEGES ON capaventure.* TO 'capaventure'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### 6. Importer les tables
```bash
mysql -u capaventure -p capaventure < database/migration_subscription.sql
mysql -u capaventure -p capaventure < database/migration_v2.sql
mysql -u capaventure -p capaventure < database/planning_2025_2027.sql
```

### 7. Builder et démarrer
```bash
cd /var/www/cap_aventure

# Backend
cd backend && npm install && npm run build && cd ..

# Frontend
cd frontend && npm install && npm run build && cd ..

# Démarrer avec PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup  # copier-coller la commande affichée
```

### 8. Configurer Nginx
```bash
# Copier la config (basée sur le vhost Certbot existant)
# Remplacer le contenu de ton vhost existant par le contenu de nginx.conf
cat nginx.conf
# → Copier-coller dans /etc/nginx/sites-available/capaventure74.fun

nginx -t && systemctl reload nginx
```

### 9. Créer le compte admin
```bash
# S'inscrire sur https://capaventure74.fun/register
# Puis passer en admin :
mysql -u capaventure -p capaventure
```
```sql
UPDATE users SET role='admin' WHERE email='ton@email.com';
EXIT;
```

---

## Mise à jour du site
```bash
cd /var/www/cap_aventure && ./deploy.sh
```

---

## Commandes utiles
```bash
pm2 status                    # état du backend
pm2 logs capaventure-api      # logs en direct
pm2 restart capaventure-api   # redémarrer
systemctl status nginx        # état nginx
nginx -t                      # tester la config nginx
```
