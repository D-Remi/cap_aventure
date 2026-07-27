# Bascule vers educetvous33.fr — Guide

Ton site s'appelle maintenant **Éduc & Vous** et pointe vers **educetvous33.fr**.
Voici les étapes pour la mise en ligne.

---

## 1. Acheter le domaine

Sur OVH, Gandi ou IONOS : `educetvous33.fr` (~10 €/an).

Réserve aussi les pseudos réseaux tant qu'ils sont libres :
`@educetvous33` sur Instagram, TikTok, Facebook.

---

## 2. Faire pointer le domaine vers ton serveur

Dans l'interface DNS de ton registrar, crée deux enregistrements A
pointant vers l'IP de ton VPS :

```
Type A   @      → [IP de ton VPS]
Type A   www    → [IP de ton VPS]
```

Le temps de propagation DNS va de quelques minutes à 24 h.

---

## 3. Certificat HTTPS

Sur le VPS, génère le certificat pour le nouveau domaine :

```
sudo certbot --nginx -d educetvous33.fr -d www.educetvous33.fr
```

(Adapte si tu utilises Apache ou une autre config.)

---

## 4. Mettre à jour le .env du backend

Dans `/var/www/.../backend/.env` :

```
ALLOWED_ORIGINS=https://educetvous33.fr,https://www.educetvous33.fr
FRONTEND_URL=https://educetvous33.fr
MAIL_FROM=delfosseremi33@gmail.com
```

Puis redémarre en forçant la relecture des variables :

```
pm2 restart educetvous-api --update-env
```

(Ou garde le nom de process actuel `capaventure-api` si tu ne veux pas
le renommer — le nom du process PM2 n'a pas d'impact sur le site.)

---

## 5. Déployer le nouveau code

Remplace entièrement `frontend/src`, `frontend/index.html` et `backend/src`
par les versions du zip, puis :

```
cd frontend && npm install && npm run build
cd ../backend && npm install && npm run build
pm2 restart educetvous-api --update-env
```

---

## 6. Rediriger l'ancien domaine (important pour le SEO)

Ne supprime pas capaventure33.fun tout de suite. Configure une redirection
301 (permanente) de l'ancien vers le nouveau, pour ne pas perdre les
visiteurs et transmettre le référencement acquis.

Dans ta config nginx du domaine capaventure33.fun :

```
server {
    server_name capaventure33.fun www.capaventure33.fun;
    return 301 https://educetvous33.fr$request_uri;
}
```

Garde cette redirection au moins 6 mois à 1 an.

---

## 7. Mettre à jour les liens externes

Une fois en ligne, pense à changer l'adresse partout où elle apparaît :
- Tes pages Facebook, Instagram, TikTok (lien en bio)
- Ta signature email
- Tes affiches et visuels (le kit réseaux sociaux mentionne l'ancien
  domaine — je peux te le régénérer avec educetvous33.fr)
- Google Business quand tu le créeras

---

## Ce qui a déjà été renommé dans le code

- Logo du site (Navbar, Footer, espace admin) : **Éduc & Vous**
- Titres, métadonnées, données structurées Google
- Emails automatiques (expéditeur, en-tête, contenus)
- Documents PDF générés (devis, factures)
- Tous les liens capaventure33.fun → educetvous33.fr

Le nom de marque affiché est **Éduc & Vous** (avec le &), le domaine et les
pseudos sont **educetvous33** (sans caractère spécial). C'est la bonne
combinaison : joli à l'œil, simple à taper.
