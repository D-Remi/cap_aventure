# CapAventure v41 — Déploiement

## Changements v41
- Domaine mis à jour : capaventure33.fun

## Sur le VPS

### 1. Mettre à jour le .env
```bash
sed -i 's|capaventure74.fun|capaventure33.fun|g' /var/www/cap_aventure/backend/.env
```

### 2. Copier les fichiers frontend
```bash
cp -r frontend/src /var/www/cap_aventure/frontend/
cp frontend/index.html /var/www/cap_aventure/frontend/
cp frontend/public/sitemap.xml /var/www/cap_aventure/frontend/public/
cp frontend/public/robots.txt /var/www/cap_aventure/frontend/public/
cp frontend/public/manifest.json /var/www/cap_aventure/frontend/public/
```

### 3. Mettre à jour Nginx
```bash
sed -i 's|capaventure74.fun|capaventure33.fun|g' /etc/nginx/sites-available/capaventure
```

### 4. Nouveau certificat SSL
```bash
certbot --nginx -d capaventure33.fun -d www.capaventure33.fun
```

### 5. Rebuild et restart
```bash
cd /var/www/cap_aventure/frontend && npm run build
systemctl reload nginx
pm2 restart capaventure-api --update-env
```
