@echo off
title JÓVENES EN MISIÓN SMP - Modo Producción Local
color 2F

echo ======================================================================
echo           JÓVENES EN MISIÓN SMP - MODO PRODUCCIÓN LOCAL
echo                     "LA FE SE VIVE SIRVIENDO"
echo                        Tarija, Bolivia (2026)
echo ======================================================================
echo.

cd /d "%~dp0"

echo [1/2] Compilando la aplicacion para produccion...
call npm run build
if %errorlevel% neq 0 (
    color 4F
    echo [ERROR] Fallo la compilacion de produccion.
    pause
    exit /b 1
)

echo.
echo [2/2] Iniciando servidor optimizado de produccion y abriendo navegador...
echo ----------------------------------------------------------------------
echo Presiona Ctrl + C en esta ventana para cerrar el servidor.
echo ----------------------------------------------------------------------
echo.

call npx vite preview --open

pause
