@echo off
setlocal
color 0A
cd /d "%~dp0"

echo ========================================
echo   COMPILACION DE STOCK-SYNC APK
echo ========================================
echo.
echo Si esta ventana se cerraba antes, ahora
echo mostrara el error y esperara ENTER.
echo.
pause

echo.
echo [1/5] Verificando Node.js...
node --version || goto :fail_node

echo.
echo [2/5] Verificando npm...
npm --version || goto :fail_npm

echo.
echo [3/5] Verificando EAS CLI...
call npx eas-cli --version >nul 2>&1
if errorlevel 1 (
  echo EAS CLI no esta disponible. Instalando globalmente...
  call npm install -g eas-cli || goto :fail_eas_install
)

echo.
echo [4/5] Login en Expo
call npx eas-cli login || goto :fail_login

echo.
echo [5/5] Configurar y compilar APK
call npx eas-cli build:configure || goto :fail_config
call npx eas-cli build -p android --profile preview || goto :fail_build

echo.
echo ========================================
echo   COMPILACION INICIADA/FINALIZADA OK
echo ========================================
echo Revisa el enlace que imprime EAS para descargar el APK.
echo.
pause
exit /b 0

:fail_node
echo.
echo ERROR: Node.js no esta instalado o no esta en PATH.
goto :end_with_pause

:fail_npm
echo.
echo ERROR: npm no esta instalado o no esta en PATH.
goto :end_with_pause

:fail_eas_install
echo.
echo ERROR: No se pudo instalar EAS CLI.
goto :end_with_pause

:fail_login
echo.
echo ERROR: Fallo el login en Expo.
goto :end_with_pause

:fail_config
echo.
echo ERROR: Fallo eas build:configure.
goto :end_with_pause

:fail_build
echo.
echo ERROR: Fallo eas build -p android --profile preview.
goto :end_with_pause

:end_with_pause
echo.
echo La ventana se quedara abierta para que copies el error.
pause
exit /b 1
