# Configuration email Gmail — CapAventure

Gratuit. Compte 10 minutes. Limite : 500 emails par jour (large pour toi).

---

## ÉTAPE 1 — Activer la validation en deux étapes

Le mot de passe d'application n'est disponible que si la 2FA est active.

1. Va sur **myaccount.google.com/security**
2. Section "Validation en deux étapes" → active-la si ce n'est pas fait
   (Google te demandera ton numéro de téléphone)

---

## ÉTAPE 2 — Créer un mot de passe d'application

1. Va sur **myaccount.google.com/apppasswords**
   (ou cherche "mot de passe application" dans les paramètres de sécurité)
2. Nom de l'application : tape `CapAventure`
3. Google génère un code de **16 caractères** type `abcd efgh ijkl mnop`
4. **Copie-le maintenant** — il ne réapparaîtra plus

Ce code remplace ton mot de passe Gmail uniquement pour l'envoi automatique.
Ton mot de passe habituel reste inchangé.

---

## ÉTAPE 3 — Configurer le .env du backend

Ajoute ces lignes dans `backend/.env` :

```
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_SECURE=false
MAIL_USER=delfosseremi33@gmail.com
MAIL_PASS=abcdefghijklmnop
MAIL_FROM=delfosseremi33@gmail.com
ADMIN_EMAIL=delfosseremi33@gmail.com
```

**Important pour MAIL_PASS :** colle le code à 16 caractères SANS les espaces.
`abcd efgh ijkl mnop` devient `abcdefghijklmnop`.

**Les rôles :**
- `MAIL_USER` / `MAIL_PASS` : le compte qui envoie
- `MAIL_FROM` : l'adresse affichée comme expéditeur
- `ADMIN_EMAIL` : où tu reçois les notifications de nouveaux contacts
  (c'est la même que MAIL_USER ici, mais tu peux en mettre une autre)

---

## ÉTAPE 4 — Redémarrer le backend

```
cd backend
npm run build
pm2 restart capaventure-api --update-env
```

Le `--update-env` est indispensable : sans lui, PM2 garde les anciennes
variables et ignore ton nouveau .env.

---

## CE QUI SE PASSE MAINTENANT

**Quand un parent envoie le formulaire de contact :**
Tu reçois immédiatement un email sur delfosseremi33@gmail.com avec son
prénom, son email, son téléphone, le service demandé, l'échéance et son
message. Tu peux répondre directement depuis ta boîte Gmail (le "répondre"
tombe sur l'adresse du parent).

**Quand tu réponds depuis l'espace admin :**
Dans Admin → Demandes, ouvre une demande, clique "Répondre depuis le site".
Ton message part par email au parent, avec l'en-tête CapAventure. Sa réponse
arrivera sur ta boîte Gmail. La demande passe automatiquement en "traitée".

**Les autres emails automatiques :**
Création de compte, réinitialisation de mot de passe, séance planifiée,
compte-rendu partagé — tout part par la même configuration.

---

## SI ÇA NE MARCHE PAS

**Rien ne part et pas d'erreur :** vérifie que le .env est bien lu. Le log
au démarrage dit "Email non configuré" si MAIL_USER ou MAIL_PASS manque.

**Erreur "Invalid login" :** le mot de passe d'application est mal copié
(espaces ?) ou la 2FA n'est pas active.

**Les emails arrivent en spam :** normal au début avec Gmail. Marque le
premier comme "non spam". Pour un envoi vraiment propre à terme, il existe
des services dédiés (Brevo gratuit jusqu'à 300 mails/jour avec meilleure
délivrabilité), mais pour ton volume Gmail suffit.

**Sécurité :** ne mets JAMAIS le .env sur Git. Vérifie qu'il est bien dans
ton .gitignore. Si le mot de passe d'application fuite, révoque-le sur
myaccount.google.com/apppasswords et régénères-en un.

---

## ALTERNATIVE SI TU VEUX UNE ADRESSE PRO

Gmail affiche delfosseremi33@gmail.com comme expéditeur. Ça fonctionne, mais
contact@capaventure33.fun ferait plus sérieux.

Deux options quand tu voudras :
- Ton hébergeur du domaine capaventure33.fun propose peut-être des adresses
  email gratuites (souvent 1 à 5 incluses)
- Tu gardes Gmail pour l'envoi mais tu configures MAIL_FROM avec l'adresse
  pro (nécessite quelques réglages supplémentaires côté Gmail)

Pour démarrer, ton Gmail actuel est parfait.
