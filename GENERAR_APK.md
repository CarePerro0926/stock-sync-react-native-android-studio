# 📱 Generar APK - Guía Completa

Una vez que tu app funciona con `npm start`, sigue estos pasos para crear un **APK instalable**.

---

## 🎯 2 Métodos Disponibles

### Método 1: EAS Build (RECOMENDADO) ⭐

- ✅ No requiere Android Studio
- ✅ Build en la nube
- ✅ Más rápido y fácil
- ⏱️ 15-20 minutos

### Método 2: Build Local

- ✅ Control total
- ❌ Requiere Android Studio
- ❌ Más lento (primeros builds)
- ⏱️ 20-40 minutos

---

## 📋 Método 1: EAS Build (RECOMENDADO)

### ¿Qué es EAS?

EAS (Expo Application Services) es un servicio que **compila tu app en la nube** sin necesidad de Android Studio.

### Paso 1️⃣: Crear cuenta Expo (si no tienes)

1. Ve a https://expo.dev
2. Haz click en **"Sign Up"**
3. Completa el formulario con:
   - **Email**: Tu correo electrónico
   - **Password**: Una contraseña segura
   - **Username**: Tu nombre de usuario (será público)
4. Confirma tu email

✅ **¡Ya tienes cuenta Expo!**

---

### Paso 2️⃣: Instalar EAS CLI

Abre **PowerShell** (como administrador) y ejecuta:

```powershell
npm install -g eas-cli
```

Verifica que se instaló:

```powershell
eas --version
```

Deberías ver algo como: `eas-cli/13.5.0`

---

### Paso 3️⃣: Login en Expo

En la misma **PowerShell**, ejecuta:

```powershell
eas login
```

Te pedirá:

- **Email**: Tu email de Expo
- **Password**: Tu contraseña de Expo

✅ **¡Sesión iniciada!**

---

### Paso 4️⃣: Navega a tu proyecto

```powershell
cd d:\ARCHIVOS SENA\TRABAJOS SENA ADSO\REACT\stock-sync-mobile\react-native
```

Verifica que estés en el directorio correcto (deberías ver `App.js`):

```powershell
ls
```

---

### Paso 5️⃣: Actualiza el archivo app.json

Abre **react-native/app.json** y verifica/actualiza:

```json
{
  "expo": {
    "name": "Stock-Sync",
    "slug": "stock-sync-mobile",
    "version": "1.0.0",
    "platforms": ["ios", "android"],
    "android": {
      "package": "com.careperro.stocksync"
    }
  }
}
```

**Importante**: El `package` debe ser único (ej: `com.tu_usuario.nombreapp`)

---

### Paso 6️⃣: Generar el APK

Ejecuta este comando en **PowerShell**:

```powershell
eas build -p android --profile preview
```

Esto hará:

- 📥 Sube tu código a Expo
- 🔨 Compila en servidores de Expo
- 📦 Crea el APK
- 🔗 Te da un link para descargar

**Espera 15-20 minutos** ☕

---

### Paso 7️⃣: Descargar el APK

Cuando termine:

1. Verás un link en la consola como:

   ```
   ✅ Build finished!
   📱 Download APK: https://expo-updates...
   ```

2. **Haz click en el link** o ve a https://expo.dev/accounts/[tu-usuario]/projects/stock-sync-mobile/builds

3. **Descarga el archivo .apk**

---

### Paso 8️⃣: Instalar en tu teléfono

#### Opción A: Usando PC

1. Conecta tu teléfono a la PC con **cable USB**
2. Espera que aparezca en el Explorador
3. **Arrastra el APK** a la carpeta del teléfono
4. **Desconecta** (Expulsar con seguridad)
5. En el teléfono: Ve a **Archivos** > encuentra el APK
6. **Abre el archivo**
7. Si pide permiso:
   - Haz click en **Configuración**
   - Habilita **"Instalar apps de fuentes desconocidas"**
   - Vuelve y confirma la instalación

#### Opción B: Email/WhatsApp

1. Descarga el APK en tu PC
2. Envíate el archivo por **email** o **WhatsApp**
3. En el teléfono: Abre el archivo
4. Sigue los pasos de Opción A (paso 7 en adelante)

#### Opción C: Scaneando un QR

Expo puede generar un QR para instalar directamente desde la app de Expo Go (para desarrollo rápido)

---

## 📱 Método 2: Build Local (Avanzado)

Si prefieres compilar en tu PC:

### Requisitos

- **Android Studio**: https://developer.android.com/studio
- **Java JDK 11+**: https://www.oracle.com/java/technologies/downloads/
- **Espacio libre**: 10GB mínimo

### Instalación Android Studio

1. Descarga **Android Studio**
2. Instala con opciones por defecto
3. AL terminar la instalación, abre **SDK Manager**:
   - **Tools** > **SDK Manager**
   - Instala **Android 12 (API 33)** o superior
   - Instala **Android SDK Build-Tools**
   - Apunta la ruta (ej: `C:\Users\TU_USUARIO\AppData\Local\Android\Sdk`)

### Configurar Variables de Entorno

1. **Windows**:
   - Abre **Panel de Control** > **Variables de entorno**
   - **Nueva variable de usuario**:
     - **Nombre**: `ANDROID_HOME`
     - **Valor**: La ruta de tu SDK (ej: `C:\Users\TU_USUARIO\AppData\Local\Android\Sdk`)

2. **De la otra**: Ve a: https://react-native.dev/docs/environment-setup

### Compilar

```powershell
cd react-native
eas build -p android
```

Esto compilará localmente en tu PC (más lento la primera vez).

---

## ⚙️ Opciones Avanzadas

### Build de Producción (para Play Store)

```powershell
eas build -p android --profile production
```

Esto genera una versión optimizada para distribuir en Google Play Store.

### Ver builds anteriores

```powershell
eas builds
```

### Cancelar un build en progreso

```powershell
eas build:cancel
```

---

## 🆘 Problemas Comunes

### Error: "eas-cli not found"

```powershell
npm install -g eas-cli
```

### Error: "You are not logged in"

```powershell
eas login
```

### Error: "app.json not found"

Verifica que estés en la carpeta `react-native/`

### El APK no instala

1. Verifica que tu teléfono es **Android** (no iOS)
2. **Desinstala versiones anteriores** de Stock-Sync
3. Verifica que tienes **espacio libre** (100MB mínimo)
4. Intenta instalar directamente sin Expo Go primero

### Error: "Invalid package name"

Edita `app.json` y cambia:

```json
"android": {
  "package": "com.tunombre.stocksync"
}
```

---

## 📊 Diagrama del Proceso

```
Tu código local
       ↓
   npm start (pruebas)
       ↓
  eas build -p android
       ↓
  Sube a Expo Cloud
       ↓
  Compila en servidor
       ↓
  Descarga APK
       ↓
  Instala en teléfono
       ↓
  ¡Disfruta tu app!
```

---

## ✅ Checklist Generación APK

```
□ Verificaste que la app funciona con `npm start`
□ Tienes cuenta en https://expo.dev
□ Instalaste EAS CLI: eas --version ✓
□ Hiciste login: eas login ✓
□ Estás en carpeta react-native/
□ Actualizaste app.json
□ Ejecutaste: eas build -p android --profile preview
□ Esperaste 15-20 minutos
□ Descargaste el APK
□ Instalaste en tu teléfono
□ Probaste la app funcionando
```

---

## 🚀 Siguientes Pasos

1. **Prueba la app móvil** en tu teléfono
2. **Compara con la web**: https://stock-sync-react.vercel.app/
3. Verifica que **ambas sincronicen datos** correctamente
4. Si todo funciona → **¡Distribución!**

---

## 📞 Soporte

- **EAS Docs**: https://docs.expo.dev/build/setup/
- **Expo Docs**: https://docs.expo.dev
- **Play Store Publishing**: https://support.google.com/googleplay/android-developer/

---

**¡Listo!** 🎉 Ahora tienes tu APK instalable.

```bash
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

#### 4. Generar APK

```bash
# Instalar dependencias nativas
npx expo prebuild

# Build de release
cd android
./gradlew assembleRelease

# Windows
.\gradlew assembleRelease
```

#### 5. Encontrar el APK

El APK estará en:

```
android/app/build/outputs/apk/release/app-release.apk
```

## Método 3: Expo Build (Legacy - No recomendado)

Este método está deprecated pero aún funciona:

```bash
expo build:android -t apk
```

## Configuración de iconos y splash screen

### Crear iconos

1. Prepara una imagen PNG de 1024x1024 px
2. Guárdala como `assets/icon.png`
3. Para Android adaptive icon: `assets/adaptive-icon.png`

### Crear splash screen

1. Prepara una imagen PNG
2. Guárdala como `assets/splash.png`
3. Configura en `app.json`:

```json
{
  "splash": {
    "image": "./assets/splash.png",
    "resizeMode": "contain",
    "backgroundColor": "#ffffff"
  }
}
```

## Personalizar el APK

### Cambiar nombre de la app

En `app.json`:

```json
{
  "name": "Stock Sync",
  "slug": "stock-sync-mobile"
}
```

### Cambiar package name

En `app.json`:

```json
{
  "android": {
    "package": "com.tuempresa.stocksync"
  }
}
```

### Cambiar versión

En `app.json`:

```json
{
  "version": "1.0.0",
  "android": {
    "versionCode": 1
  }
}
```

## Firmar el APK (Producción)

Para publicar en Google Play Store necesitas firmar el APK:

### 1. Generar keystore

```bash
keytool -genkeypair -v -storetype PKCS12 -keystore stock-sync.keystore -alias stock-sync -keyalg RSA -keysize 2048 -validity 10000
```

### 2. Configurar en EAS

Crea `eas.json`:

```json
{
  "build": {
    "production": {
      "android": {
        "buildType": "apk"
      }
    }
  }
}
```

### 3. Build firmado

```bash
eas build -p android --profile production
```

## Solución de Problemas Comunes

### Error: "Could not find or load main class org.gradle.wrapper.GradleWrapperMain"

Solución:

```bash
cd android
./gradlew wrapper
```

### Error: "SDK location not found"

Solución: Crea `android/local.properties`:

```
sdk.dir=C:\\Users\\TU_USUARIO\\AppData\\Local\\Android\\Sdk
```

### El APK no instala

Posibles causas:

1. APK corrupto - vuelve a generar
2. Permisos insuficientes - habilita "Fuentes desconocidas"
3. Versión de Android incompatible - verifica minSdkVersion en app.json

### App crashea al abrir

Verifica:

1. Variables de entorno configuradas correctamente
2. Permisos en AndroidManifest.xml
3. Logs con: `adb logcat`

## Verificar el APK

### Información del APK

```bash
aapt dump badging app-release.apk
```

### Instalar con ADB

```bash
adb install app-release.apk
```

### Ver logs

```bash
adb logcat | grep -i "stock-sync"
```

## Optimización del APK

### Reducir tamaño

En `app.json`:

```json
{
  "android": {
    "enableProguardInReleaseBuilds": true,
    "enableShrinkResourcesInReleaseBuilds": true
  }
}
```

### Build de producción optimizado

```bash
eas build -p android --profile production
```

## Distribución

### Opción 1: Instalación directa

1. Comparte el APK por WhatsApp, email, USB, etc.
2. Usuario instala directamente

### Opción 2: Google Play Store

1. Crea cuenta de desarrollador ($25 USD único pago)
2. Sube el APK/AAB
3. Completa listing
4. Publica

### Opción 3: Distribución interna

- Usa Google Play Console para distribución interna
- Máximo 100 testers
- No requiere revisión

## Actualizar la App

1. Incrementa versión en `app.json`:

```json
{
  "version": "1.1.0",
  "android": {
    "versionCode": 2
  }
}
```

2. Genera nuevo APK
3. Distribuye la nueva versión

## Checklist Final

Antes de distribuir, verifica:

- [ ] Variables de entorno configuradas
- [ ] Iconos y splash screen agregados
- [ ] Nombre y package name correctos
- [ ] Versión actualizada
- [ ] APK probado en dispositivo físico
- [ ] Funcionalidades principales funcionan
- [ ] Conexión a backend funciona
- [ ] Sin logs de debug en producción

---

**Recomendación**: Usa EAS Build (Método 1) para la mayoría de casos. Es más simple y confiable.
