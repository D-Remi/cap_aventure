@echo off
echo ============================================
echo    CapAventure - Demarrage production
echo ============================================
echo.

:: Aller a la racine du projet
cd /d "%~dp0"

:: Build backend
echo [1/4] Build du backend...
cd backend
call npm run build
if %errorlevel% neq 0 (
    echo ERREUR: Build backend echoue
    pause
    exit /b 1
)
cd ..

:: Build frontend
echo [2/4] Build du frontend...
cd frontend
call npm run build
if %errorlevel% neq 0 (
    echo ERREUR: Build frontend echoue
    pause
    exit /b 1
)
cd ..

:: Verifier PM2
echo [3/4] Verification PM2...
where pm2 >nul 2>&1
if %errorlevel% neq 0 (
    echo Installation de PM2 et serve...
    call npm install -g pm2 serve pm2-windows-startup
)

:: Creer dossier logs
if not exist "logs" mkdir logs

:: Lancer avec PM2
echo [4/4] Lancement des services...
pm2 stop all 2>nul
pm2 start ecosystem.config.js
pm2 save

echo.
echo ============================================
echo    Site accessible sur :
echo    http://localhost:3000
echo    http://capaventure.duckdns.org:3000
echo ============================================
echo.
pm2 status
pause
