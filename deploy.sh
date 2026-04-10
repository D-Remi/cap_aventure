#!/bin/bash
# ============================================================
# CapAventure — Script de mise à jour
# Lancer depuis le VPS : ./deploy.sh
# ============================================================
set -e
cd /var/www/capaventure

echo "📦 Récupération du code..."
git pull origin main

echo "🔧 Build backend..."
cd backend && npm install --production=false && npm run build && cd ..

echo "🎨 Build frontend..."
cd frontend && npm install && npm run build && cd ..

echo "♻️  Redémarrage backend..."
pm2 reload capaventure-api

echo "🔄 Rechargement Nginx..."
systemctl reload nginx

echo "✅ Mise à jour terminée !"
pm2 status
