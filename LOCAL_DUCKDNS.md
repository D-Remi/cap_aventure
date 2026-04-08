# 🌐 Hébergement local + DuckDNS — Guide complet

Ton site tourne sur ton PC, accessible depuis internet via un vrai domaine gratuit.
Exemple final : **http://capaventure.duckdns.org**

---

## ÉTAPE 1 — Créer ton domaine gratuit DuckDNS

1. Va sur https://www.duckdns.org
2. Connecte-toi avec Google ou GitHub
3. Dans "sub domain", tape : **capaventure** (ou ce que tu veux)
4. Clique **"add domain"**
5. Note le **token** affiché en haut de page (une longue chaîne de caractères)
6. Note aussi ton domaine : `capaventure.duckdns.org`

---

## ÉTAPE 2 — Mettre à jour DuckDNS avec ton IP automatiquement

DuckDNS doit toujours pointer vers ton IP actuelle.

### Sur Windows — Script automatique

Crée un fichier `C:\duckdns\update.bat` :

```bat
@echo off
curl "https://www.duckdns.org/update?domains=capaventure&token=TON_TOKEN_ICI&ip=" -o C:\duckdns\duck.log
```

Remplace `TON_TOKEN_ICI` par ton vrai token.

### Planifier l'exécution toutes les 5 minutes

1. Ouvre **Planificateur de tâches** Windows (cherche dans le menu démarrer)
2. "Créer une tâche de base"
3. Nom : `DuckDNS Update`
4. Déclencheur : **Toutes les 5 minutes** (répétition)
5. Action : Démarrer le programme → `C:\duckdns\update.bat`
6. Valider

---

## ÉTAPE 3 — Ouvrir les ports sur ta box

Tu dois dire à ta box de rediriger les connexions internet vers ton PC.

### Trouver l'IP locale de ton PC

Ouvre un terminal et tape :
```
ipconfig
```
Note l'**IPv4** (genre `192.168.1.XX`)

### Ouvrir les ports (redirection de ports / NAT)

Connecte-toi à ta box : http://192.168.1.1 (ou http://livebox.home pour Orange)

**Pour chaque box :**

| Box | URL admin |
|-----|-----------|
| Orange Livebox | http://livebox.home |
| SFR | http://192.168.1.1 |
| Bouygues | http://192.168.1.254 |
| Free Freebox | http://mafreebox.freebox.fr |

**Ports à ouvrir :**

| Port externe | Port interne | Protocole | Vers (IP de ton PC) |
|-------------|-------------|-----------|---------------------|
| 3000 | 3000 | TCP | 192.168.1.XX |
| 3001 | 3001 | TCP | 192.168.1.XX |

> 💡 Cherche "Redirection de ports", "NAT", ou "Port Forwarding" dans les paramètres de ta box

---

## ÉTAPE 4 — Configurer le projet pour la prod locale

### Modifier le fichier `backend/.env`

```env
NODE_ENV=production
PORT=3001

DB_HOST=localhost
DB_PORT=3306
DB_USER=capaventure
DB_PASS=capaventure
DB_NAME=capaventure

JWT_SECRET=remplace-par-une-cle-aleatoire-longue

MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_SECURE=false
MAIL_USER=ton@gmail.com
MAIL_PASS=ton-mot-de-passe-app-gmail
MAIL_FROM=CapAventure <ton@gmail.com>
ADMIN_EMAIL=ton@gmail.com

# Ton domaine DuckDNS
FRONTEND_URL=http://capaventure.duckdns.org:3000
```

### Modifier `frontend/src/services/api.js`

Remplace la ligne `baseURL` pour pointer vers ton backend :

```javascript
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://capaventure.duckdns.org:3001',
})
```

### Créer `frontend/.env.local` (pour le build)

```
VITE_API_URL=http://capaventure.duckdns.org:3001
```

---

## ÉTAPE 5 — Builder et lancer le projet

### Builder le frontend (une seule fois, ou à chaque modif)

```bash
cd frontend
npm run build
```
Cela crée un dossier `frontend/dist/`

### Installer `serve` pour servir le frontend builté

```bash
npm install -g serve
```

### Lancer le backend

```bash
cd backend
npm run build
node dist/main.js
```

### Lancer le frontend (dans un autre terminal)

```bash
cd frontend
serve dist -l 3000
```

---

## ÉTAPE 6 — Lancer automatiquement au démarrage de Windows

Pour que le site redémarre tout seul si ton PC redémarre.

### Installer PM2

```bash
npm install -g pm2
npm install -g pm2-windows-startup
```

### Créer un fichier `ecosystem.config.js` à la racine du projet

```javascript
module.exports = {
  apps: [
    {
      name: 'capaventure-backend',
      script: './backend/dist/main.js',
      env: { NODE_ENV: 'production', PORT: 3001 },
      cwd: './backend',
    },
    {
      name: 'capaventure-frontend',
      script: 'serve',
      args: 'dist -l 3000',
      cwd: './frontend',
      interpreter: 'none',
    }
  ]
}
```

### Lancer avec PM2

```bash
# Depuis la racine du projet
pm2 start ecosystem.config.js
pm2 save

# Configurer le démarrage auto Windows
pm2-startup install
```

### Commandes PM2 utiles

```bash
pm2 status          # voir l'état des services
pm2 logs            # voir les logs en temps réel
pm2 restart all     # redémarrer tout
pm2 stop all        # tout arrêter
```

---

## ÉTAPE 7 — Tester

1. Depuis ton réseau local : http://localhost:3000 ✅
2. Depuis internet : http://capaventure.duckdns.org:3000 ✅
3. Partage ce lien à tes proches 🎉

---

## Créer ton compte admin

```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"prenom\":\"Ton Prenom\",\"nom\":\"Nom\",\"email\":\"admin@cap.fr\",\"password\":\"MotDePasse123!\"}"
```

Puis dans MySQL :
```sql
UPDATE users SET role = 'admin' WHERE email = 'admin@cap.fr';
```

---

## ⚠️ Points importants

**Ton PC doit rester allumé** pour que le site soit accessible.
→ Désactive la mise en veille : Paramètres → Alimentation → Jamais

**Ton IP publique change** → C'est pour ça qu'on a mis DuckDNS qui se met à jour toutes les 5 min.

**Pas de HTTPS** → Pour une démo entre proches c'est OK. Pour du vrai usage avec des parents, il faudrait HTTPS (nécessite un vrai domaine payant + certificat).

**Sécurité réseau** → Tu ouvres ton réseau domestique. C'est acceptable pour une démo, pas pour une mise en production réelle avec des données sensibles.

---

## Résumé des URLs finales

| Service | URL |
|---------|-----|
| Site web | http://capaventure.duckdns.org:3000 |
| API | http://capaventure.duckdns.org:3001/api |
| Back-office | http://capaventure.duckdns.org:3000/admin |
| En local | http://localhost:3000 |
