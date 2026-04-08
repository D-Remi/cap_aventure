@echo off
:: Script de mise a jour DuckDNS
:: A placer dans C:\duckdns\update.bat
:: Et planifier toutes les 5 minutes via le Planificateur de taches Windows

:: !! REMPLACE CES DEUX VALEURS !!
set DOMAIN=capaventure
set TOKEN=ton-token-duckdns-ici

curl "https://www.duckdns.org/update?domains=%DOMAIN%&token=%TOKEN%&ip=" -o "%~dp0duck.log" -s

:: Log la date de mise a jour
echo Mis a jour le %date% a %time% >> "%~dp0history.log"
