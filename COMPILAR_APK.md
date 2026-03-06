# 🚀 GUÍA COMPLETA: COMPILAR APK DE STOCK-SYNC

## ✅ PREPARACIÓN COMPLETADA

He preparado tu proyecto para compilación:
- ✅ EAS CLI instalado
- ✅ app.json configurado con splash screen y adaptive icon
- ✅ eas.json ya existe con perfiles de build

---

## 📱 PASO A PASO PARA GENERAR TU APK

### **PASO 1: Crear cuenta en Expo (si no tienes)** 🆔

1. Ve a: https://expo.dev/signup
2. Crea una cuenta con tu email
3. Confirma tu email
4. ¡Listo!

---

### **PASO 2: Iniciar sesión en EAS** 🔐

Abre **PowerShell** en tu carpeta del proyecto y ejecuta:

```powershell
cd "D:\ARCHIVOS SENA\TRABAJOS SENA ADSO\APP REACT NATIVE\prueba 1\react-native"
eas login
```

**Se te pedirá:**
- Email o username de Expo
- Contraseña

**Escribe** tus credenciales y presiona Enter.

Verás: `✔ Logged in`

---

### **PASO 3: Configurar el proyecto en EAS** ⚙️

```powershell
eas build:configure
```

**Preguntas que te hará:**

1. **"Generate a new Android Keystore?"**
   → Responde: `Y` (Yes)
   
2. **"Would you like to automatically create an EAS project?"**
   → Responde: `Y` (Yes)

**Resultado:**
- Se creará tu proyecto en Expo
- Se actualizará `app.json` con el projectId real
- El keystore se generará automáticamente

---

### **PASO 4: COMPILAR EL APK** 🎯

```powershell
eas build -p android --profile preview
```

**Esto iniciará la compilación en la nube de Expo.**

**Preguntas posibles:**

1. **"Commit changes to git?"**
   → Responde: `n` (No) si no usas git

2. **"Do you want to proceed?"**
   → Responde: `Y` (Yes)

**Lo que sucederá:**
1. ⬆️ Subirá tu código a los servidores de Expo
2. 🔨 Compilará el APK en la nube (10-20 minutos)
3. 📦 Te dará un link para descargar el APK

**Verás algo así:**
```
✔ Build finished!
📦 Android app:
https://expo.dev/artifacts/eas/XXXXXXXXXXXXX.apk
```

---

### **PASO 5: Descargar el APK** 📥

1. **Copia el link** que te dio EAS
2. **Ábrelo en tu navegador**
3. **Descarga el archivo .apk** (puede ser de 30-50 MB)
4. **Guárdalo** en un lugar seguro

---

### **PASO 6: Instalar el APK en tu teléfono** 📲

#### **Opción A: Transferir por cable USB**

1. Conecta tu teléfono Android al PC
2. Copia el APK a la carpeta "Descargas" de tu teléfono
3. En tu teléfono, abre "Archivos" o "Gestor de archivos"
4. Ve a "Descargas"
5. Toca el archivo APK
6. Si dice "Instalación bloqueada":
   - Ve a Configuración → Seguridad
   - Activa "Fuentes desconocidas" o "Instalar apps desconocidas"
7. Toca "Instalar"
8. ¡Listo! Abre "Stock Sync"

#### **Opción B: Enviar por WhatsApp/Email**

1. Envíate el APK por WhatsApp o email
2. Ábrelo desde tu teléfono
3. Descárgalo
4. Instálalo (permite fuentes desconocidas si es necesario)

---

## 🎯 COMANDOS RESUMIDOS

**TODO EN UNO (copia y pega en PowerShell):**

```powershell
# 1. Ir a la carpeta del proyecto
cd "D:\ARCHIVOS SENA\TRABAJOS SENA ADSO\APP REACT NATIVE\prueba 1\react-native"

# 2. Login en Expo (introduce tus credenciales)
eas login

# 3. Configurar proyecto
eas build:configure

# 4. Compilar APK
eas build -p android --profile preview
```

**Tiempo estimado total:** 15-25 minutos

---

## 📋 CHECKLIST

- [ ] Tengo cuenta en Expo.dev
- [ ] Ejecuté `eas login`
- [ ] Ejecuté `eas build:configure`
- [ ] Ejecuté `eas build -p android --profile preview`
- [ ] La compilación terminó exitosamente
- [ ] Descargué el APK desde el link
- [ ] Transferí el APK a mi teléfono
- [ ] Instalé el APK
- [ ] ¡La app funciona!

---

## ⚠️ SOLUCIÓN DE PROBLEMAS

### **❌ "You must be logged in to run this command"**

**Solución:**
```powershell
eas login
```

---

### **❌ "Could not find eas.json"**

**Solución:**
```powershell
eas build:configure
```

---

### **❌ "Build failed" o error durante compilación**

**Causas comunes:**

1. **Dependencias incompatibles**
   ```powershell
   npm install
   eas build -p android --profile preview --clear-cache
   ```

2. **Error en el código**
   - Revisa los logs en la URL que te da EAS
   - Busca el error específico
   - Corrígelo y vuelve a compilar

3. **Problema de red**
   - Verifica tu conexión a internet
   - Intenta de nuevo

---

### **❌ "No space left on device" en el teléfono**

**Solución:**
- Libera espacio en tu teléfono (mínimo 100 MB)
- Desinstala apps que no uses
- Intenta instalar de nuevo

---

### **❌ El APK se instala pero no abre / crashea**

**Posibles causas:**

1. **Versión de Android muy antigua**
   - Necesitas Android 5.0 (Lollipop) o superior
   - Verifica en Configuración → Acerca del teléfono

2. **Problema con Supabase**
   - La app funcionará con datos de fallback
   - Algunas funciones requerirán conexión

---

## 🔍 VERIFICAR EL ESTADO DEL BUILD

Puedes ver el progreso en:
```
https://expo.dev/accounts/TU_USUARIO/projects/stock-sync-mobile/builds
```

**Estados posibles:**
- 🟡 **In Queue**: Esperando a compilar
- 🔵 **In Progress**: Compilando (10-20 min)
- 🟢 **Finished**: ¡Listo para descargar!
- 🔴 **Failed**: Error (revisa los logs)

---

## 📦 TIPOS DE BUILD DISPONIBLES

### **preview** (El que estamos usando)
- ✅ APK instalable
- ✅ Funciona en cualquier Android
- ✅ Ideal para pruebas
- ✅ No requiere Google Play

### **production**
- 📦 Genera AAB (Android App Bundle)
- 🏪 Para subir a Google Play Store
- 🔐 Firmado para producción

**Para generar production:**
```powershell
eas build -p android --profile production
```

---

## 🎨 PERSONALIZAR ANTES DE COMPILAR (Opcional)

### **Cambiar nombre de la app:**
Edita `app.json`:
```json
"name": "Mi Inventario Pro",
```

### **Cambiar ícono:**
1. Reemplaza `assets/logo-fondo.png` con tu ícono (1024x1024 px)
2. Vuelve a compilar

### **Cambiar versión:**
```json
"version": "1.0.1",
"android": {
  "versionCode": 2
}
```

---

## 💰 COSTO

**EAS Build:**
- ✅ **GRATIS**: Hasta 30 builds por mes (plan gratuito)
- ✅ Más que suficiente para desarrollo

**Si necesitas más:**
- Plan Developer: $29/mes (builds ilimitados)

---

## 🚀 COMPILAR DE NUEVO (Actualizaciones)

Cuando hagas cambios al código:

```powershell
# 1. Guarda todos tus cambios
# 2. Incrementa la versión en app.json
# 3. Compila de nuevo

eas build -p android --profile preview
```

**Cada build genera un nuevo APK** que puedes instalar sobre el anterior.

---

## 📊 COMPARACIÓN: EXPO GO VS APK

| Característica | Expo Go | APK Compilado |
|----------------|---------|---------------|
| Instalación | Escanear QR | Instalar archivo |
| Requiere PC | ✅ Sí | ❌ No |
| Funciona offline | ❌ No | ✅ Sí |
| Compartir con otros | ❌ Difícil | ✅ Fácil |
| Desarrollo | ✅ Ideal | ❌ Lento |
| Producción | ❌ No | ✅ Sí |

---

## 🎉 DESPUÉS DE INSTALAR EL APK

Tu app funcionará **completamente independiente**:

✅ No necesita Expo Go
✅ No necesita estar conectada al PC
✅ Funciona como cualquier app normal
✅ Puedes compartirla con amigos/clientes
✅ Guarda datos localmente (AsyncStorage)
✅ Conecta a Supabase automáticamente

---

## 🔐 CREDENCIALES PARA PROBAR

Una vez instalado el APK:

**Cliente:**
```
Usuario: cliente
Contraseña: cliente123
```

**Administrador:**
```
Usuario: admin
Contraseña: admin123
```

O crea cuentas nuevas desde "Registrarse"

---

## 📱 COMPATIBILIDAD

**Tu APK funcionará en:**
- ✅ Android 5.0 (Lollipop) o superior
- ✅ Cualquier marca (Samsung, Xiaomi, Huawei, etc.)
- ✅ Teléfonos y tablets
- ✅ Con o sin Google Play Services

**Tamaño del APK:** ~30-50 MB

---

## 🆘 SI TIENES PROBLEMAS

**Durante la compilación:**
1. Lee el mensaje de error completo
2. Busca en Google: "EAS build error [tu error]"
3. Revisa los logs en la URL de Expo
4. Intenta con `--clear-cache`

**Durante la instalación:**
1. Activa "Fuentes desconocidas"
2. Verifica espacio en el teléfono
3. Reinicia el teléfono si es necesario

**Si la app crashea:**
1. Desinstala
2. Reinicia el teléfono
3. Instala de nuevo
4. Si persiste, revisa los logs de compilación

---

## 📞 INFORMACIÓN DE TU PROYECTO

**Nombre del paquete:**
```
com.stocksync.mobile
```

**Versión:**
```
1.0.0 (versionCode: 1)
```

**Framework:**
```
React Native 0.81.5 + Expo 54.0.23
```

---

## ✅ RESUMEN ULTRA RÁPIDO

```powershell
# En PowerShell:
cd "D:\ARCHIVOS SENA\TRABAJOS SENA ADSO\APP REACT NATIVE\prueba 1\react-native"
eas login
eas build:configure
eas build -p android --profile preview

# Espera 15-20 minutos
# Descarga el APK del link
# Instálalo en tu Android
# ¡Listo!
```

---

## 🎓 PARA TU PROYECTO SENA

**Este APK sirve como entregable:**
- ✅ Demuestra que el proyecto funciona
- ✅ Puede instalarse y probarse
- ✅ No requiere configuración técnica
- ✅ Es una app real y funcional
- ✅ Puede presentarse en dispositivo físico

---

# 🚀 ¡AHORA EJECUTA LOS COMANDOS!

Abre **PowerShell** y sigue los pasos de arriba.

**¡Buena suerte con tu compilación!** 🎉

Si tienes algún error durante el proceso, copia el mensaje completo y te ayudo a resolverlo.

