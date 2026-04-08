@echo off
title CapAventure - Dev
echo Lancement de CapAventure en mode developpement...
echo.

cd /d "%~dp0"

:: Lancer le backend dans une nouvelle fenetre
start "CapAventure - Backend :3001" cmd /k "cd backend && npm run start:dev"

:: Attendre 3 secondes que le backend demarre
timeout /t 3 /nobreak >nul

:: Lancer le frontend dans une nouvelle fenetre
start "CapAventure - Frontend :3000" cmd /k "cd frontend && npm run dev"

echo Les deux serveurs sont en cours de demarrage...
echo Backend  : http://localhost:3001/api
echo Frontend : http://localhost:3000
echo.
echo Ferme cette fenetre quand tu as fini.
pause
