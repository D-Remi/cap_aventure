#!/bin/bash
# ============================================================
# CapAventure — Script de déploiement automatique
# À exécuter sur le VPS après la première installation
# Usage : ./deploy.sh
# ============================================================

set -e
cd /var/www/capaventure

echo "📦 Mise à jour du code..."
git pull origin main

echo "🔧 Build backend..."
cd backend
npm install --production=false
npm run build
echo "✅ Backend buildé"

echo "🎨 Build frontend..."
cd ../frontend
npm install
VITE_API_URL="" npm run build
echo "✅ Frontend buildé"

echo "♻️  Redémarrage..."
cd ..
pm2 reload capaventure-api || pm2 start backend/dist/main.js --name capaventure-api
pm2 save

echo "🎉 Déployé avec succès !"
