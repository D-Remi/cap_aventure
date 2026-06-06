# CapAventure v40 — Déploiement

## Migrations SQL (dans l'ordre)
```bash
mysql -u capaventure -p'CapAv2024!' capaventure < database/schema_v4.sql
mysql -u capaventure -p'CapAv2024!' capaventure < database/migrate_contrats.sql
mysql -u capaventure -p'CapAv2024!' capaventure < database/migrate_documents_base64.sql
```

## Backend
```bash
cd backend
npm install
npm run build
pm2 restart capaventure-api
```

## Frontend
```bash
cd frontend
npm install
npm run build
systemctl reload nginx
```

## Nouveautés v40
- Module Contrats Répit complet (admin + parent)
- Signature électronique canvas (souris/tactile)
- Saisie des séances + kilométrage
- Génération de factures
- Documents stockés en base64 (visualisation directe)
- Messages admin fonctionnels
- Stats réelles
- Fiche familles admin
- Récurrence de créneaux
- Modal de contact intelligente (pré-remplie si connecté)
- Pages services dédiées (Garde, Répit, Événements)
- Calendrier semaine style Pronote avec modal réservation
- Présences supprimées
- PWA banner supprimée
