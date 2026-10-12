@echo off
title JÓVENES EN MISIÓN SMP - Servidor Local
color 1F

echo ======================================================================
echo           JÓVENES EN MISIÓN SMP - PARROQUIA SAN MARTÍN DE PORRES
echo                     "LA FE SE VIVE SIRVIENDO"
echo                        Tarija, Bolivia (2026)
echo ======================================================================
echo.

cd /d "%~dp0"

echo [1/3] Verificando instalacion de Node.js...
where node >nul 2>&1
if %errorlevel% neq 0 (
    color 4F
    echo.
    echo [ERROR] Node.js no esta instalado o no se encuentra en el PATH.
    echo Por favor descarga e instala Node.js desde: https://nodejs.org/
    echo.
    pause
    exit /b 1
)

echo [2/3] Verificando dependencias del proyecto...
if not exist "node_modules\" (
    echo Instalando paquetes y librerias necesarias (esto tomara un momento)...
    call npm install
    if %errorlevel% neq 0 (
        color 4F
        echo [ERROR] Ocurrio un fallo al instalar las dependencias con npm.
        pause
        exit /b 1
    )
) else (
    echo Dependencias listas.
)

echo.
echo [3/3] Iniciando el servidor de desarrollo y abriendo tu navegador...
echo ----------------------------------------------------------------------
echo Presiona Ctrl + C en esta ventana cuando desees detener el servidor.
echo ----------------------------------------------------------------------
echo.

call npm run dev -- --open

pause
