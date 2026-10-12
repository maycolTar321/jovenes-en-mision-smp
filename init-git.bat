@echo off
echo =======================================================
echo JÓVENES EN MISIÓN SMP - INICIALIZACIÓN DE REPOSITORIO GIT
echo =======================================================
echo Verificando si Git esta instalado en el sistema...

git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Git no esta instalado o no se encuentra en el PATH de Windows.
    echo Por favor descarga e instala Git desde: https://git-scm.com/download/win
    echo o utiliza GitHub Desktop: https://desktop.github.com/
    pause
    exit /b 1
)

echo Inicializando repositorio Git...
git init
echo Configurando rama principal 'main'...
git branch -M main
echo Agregando archivos de trabajo (respetando .gitignore)...
git add .
echo Creando commit inicial...
git commit -m "feat: Sistema integral Jóvenes en Misión SMP (Parroquia San Martín de Porres, Tarija)"
echo.
echo =======================================================
echo [LISTO] Repositorio local preparado exitosamente.
echo Para vincular con tu repositorio en GitHub ejecuta:
echo git remote add origin https://github.com/TU_USUARIO/TU_REPOSITORIO.git
echo git push -u origin main
echo =======================================================
pause
