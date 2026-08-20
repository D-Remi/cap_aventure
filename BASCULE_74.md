# Bascule vers educetvous74.fr — Guide

Tu passes de educetvous33.fr à **educetvous74.fr** (cohérent avec la
Haute-Savoie). Voici les étapes.

---

## 1. Faire pointer le nouveau domaine vers ton VPS

Dans l'interface DNS de ton registrar (là où tu as acheté educetvous74.fr),
crée deux enregistrements A vers l'IP de ton VPS :

```
Type A   @      → [IP de ton VPS]
Type A   www    → [IP de ton VPS]
```

Propagation DNS : de quelques minutes à 24h.

---

## 2. Certificat HTTPS pour le nouveau domaine

```
sudo certbot --nginx -d educetvous74.fr -d www.educetvous74.fr
```

---

## 3. Config nginx du nouveau domaine

Crée /etc/nginx/sites-available/educetvous74.fr :

```nginx
server {
    server_name educetvous74.fr www.educetvous74.fr;
    root /var/www/cap_aventure/frontend/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://127.0.0.1:3001;   # SANS slash final !
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    listen 80;
}
```

Active-le :
```
sudo ln -s /etc/nginx/sites-available/educetvous74.fr /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

## 4. Mettre à jour le .env du backend

```
ALLOWED_ORIGINS=https://educetvous74.fr,https://www.educetvous74.fr
FRONTEND_URL=https://educetvous74.fr
```

Puis :
```
pm2 restart capaventure-api --update-env
```

---

## 5. Déployer le nouveau code

Remplace frontend/src, frontend/index.html, frontend/public (pour l'og-image)
et backend/src, puis :

```
cd frontend && npm install && npm run build
cd ../backend && npm install && npm run build
pm2 restart capaventure-api --update-env
```

---

## 6. Rediriger educetvous33.fr → educetvous74.fr

Garde l'ancien domaine et redirige-le, pour ne pas perdre le référencement
déjà acquis. Dans la config nginx de educetvous33.fr, remplace tout le
server par :

```nginx
server {
    server_name educetvous33.fr www.educetvous33.fr;
    return 301 https://educetvous74.fr$request_uri;
    listen 80;
}
```

Garde cette redirection au moins 6 mois à 1 an.

---

## 7. Google Search Console

- Ajoute educetvous74.fr comme nouvelle propriété
- Soumets le sitemap : https://educetvous74.fr/sitemap.xml
- Utilise l'outil de changement d'adresse si disponible (Paramètres →
  Changement d'adresse) pour dire à Google que tu déménages de 33 vers 74

---

## 8. Mettre à jour les liens externes

- Lien en bio Instagram / Facebook
- Signature email
- Pseudos réseaux si tu veux passer @educetvous74

---

Le nouveau domaine educetvous74.fr est déjà dans tout le code (site, emails,
PDF, sitemap, image de partage). Il ne reste que la config serveur ci-dessus.
