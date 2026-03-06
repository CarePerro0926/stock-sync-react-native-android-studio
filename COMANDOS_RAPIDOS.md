# 🚀 COMANDOS RÁPIDOS PARA COMPILAR

## Ejecuta estos comandos UNO POR UNO en PowerShell:

### 1. Ir a tu proyecto
```powershell
cd "D:\ARCHIVOS SENA\TRABAJOS SENA ADSO\APP REACT NATIVE\prueba 1\react-native"
```

### 2. Login en Expo (introduce tu email y contrasena)
```powershell
npx eas-cli login
```

### 3. Configurar proyecto (responde Y a todo)
```powershell
npx eas-cli build:configure
```

### 4. Compilar APK (espera 15-20 minutos)
```powershell
npx eas-cli build -p android --profile preview
```

---

## Si prefieres doble clic

Usa `abrir-compilador.cmd` (mantiene la consola abierta).

---

## ¿No tienes cuenta de Expo?

Créala en: https://expo.dev/signup

---

## Al terminar:

1. Copia el link que te da
2. Descarga el APK
3. Instálalo en tu Android
4. ¡Listo!

---

## Si hay error "Build failed":

```powershell
npx eas-cli build -p android --profile preview --clear-cache
```
