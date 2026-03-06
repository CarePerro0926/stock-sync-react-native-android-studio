# Solución de Problemas - Stock-Sync Mobile

## 🚨 Problemas Comunes y Soluciones

### 1. Error al instalar dependencias

**Problema**: `npm install` falla con errores

**Soluciones**:

```bash
# Limpia cache de npm
npm cache clean --force

# Elimina node_modules y reinstala
rm -rf node_modules
npm install

# Si persiste, usa yarn
npm install -g yarn
yarn install
```

### 2. App no carga - Pantalla blanca

**Problema**: La app muestra pantalla blanca o no carga

**Causas posibles**:

- Variables de entorno mal configuradas
- Errores de JavaScript no capturados
- Problemas con AsyncStorage

**Soluciones**:

```bash
# Limpia cache de Expo
expo start --clear

# Verifica logs
# En otra terminal:
npx react-native log-android  # Para Android
npx react-native log-ios      # Para iOS
```

Verifica que `.env` existe y tiene las variables correctas:

```env
EXPO_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=tu-clave-aqui
EXPO_PUBLIC_API_URL=https://tu-api.com
```

### 3. No conecta con Supabase

**Problema**: Datos no se cargan, errores de conexión

**Soluciones**:

1. Verifica las credenciales de Supabase en `.env`
2. Verifica que tu proyecto Supabase está activo
3. Verifica permisos de las tablas en Supabase:
   - Ve a Authentication > Policies
   - Asegúrate de tener políticas para SELECT, INSERT, UPDATE

4. Prueba la conexión manualmente:

```javascript
// En App.js, agrega temporalmente:
useEffect(() => {
  const testConnection = async () => {
    const { data, error } = await supabase
      .from("productos")
      .select("*")
      .limit(1);
    console.log("Test connection:", { data, error });
  };
  testConnection();
}, []);
```

### 4. Error en build de APK

**Problema**: `eas build` falla

**Soluciones**:

```bash
# Verifica que estás autenticado
eas whoami

# Si no estás autenticado
eas login

# Verifica que eas.json está configurado
cat eas.json

# Intenta de nuevo con logs verbose
eas build -p android --profile preview --verbose
```

**Errores comunes**:

- `Project not found`: Ejecuta `eas build:configure` primero
- `Invalid credentials`: Ejecuta `eas login` y vuelve a intentar
- `Build failed`: Revisa los logs en el dashboard de Expo

### 5. APK no instala en Android

**Problema**: Al intentar instalar el APK aparece error

**Soluciones**:

1. **Habilita instalación de fuentes desconocidas**:
   - Android 8+: Configuración > Apps > Acceso especial > Instalar apps desconocidas
   - Android 7-: Configuración > Seguridad > Fuentes desconocidas

2. **Verifica que el APK no está corrupto**:

   ```bash
   # Descarga de nuevo el APK
   # O usa ADB para instalar:
   adb install app-release.apk
   ```

3. **Verifica espacio de almacenamiento**: Asegúrate de tener al menos 100MB libres

### 6. App crashea al abrir

**Problema**: La app se cierra inmediatamente después de abrirla

**Diagnóstico**:

```bash
# Conecta el dispositivo por USB
# Habilita depuración USB en el dispositivo
# En tu computadora:
adb logcat | grep StockSync

# O todos los logs:
adb logcat | grep -i error
```

**Causas comunes**:

1. Variables de entorno no se empaquetaron en el APK
2. Permisos faltantes
3. Dependencias nativas mal configuradas

**Solución**:

- Asegúrate de que `.env` tiene las variables con el prefijo `EXPO_PUBLIC_`
- Regenera el APK después de configurar correctamente el `.env`

### 7. Realtime no funciona

**Problema**: Los cambios no se sincronizan en tiempo real

**Soluciones**:

1. Verifica que Realtime está habilitado en Supabase:
   - Dashboard > Settings > API > Realtime
   - Debe estar en "Enabled"

2. Verifica las políticas de la base de datos:
   - Las tablas deben tener habilitada la replicación

3. Verifica la suscripción en el código:

```javascript
// En useRealtimeSync.js, agrega logs:
.on('postgres_changes', ..., payload => {
  console.log('Received update:', payload);
  // ...
})
```

### 8. Problemas con AsyncStorage

**Problema**: Sesión no persiste o errores de almacenamiento

**Soluciones**:

```javascript
// Limpia AsyncStorage manualmente
import AsyncStorage from "@react-native-async-storage/async-storage";

// En tu código:
await AsyncStorage.clear();
```

O desde CLI:

```bash
# Android
adb shell run-as com.stocksync.mobile rm -rf /data/data/com.stocksync.mobile/databases
```

### 9. Expo Go no carga la app

**Problema**: Escaneas el QR pero no pasa nada

**Soluciones**:

1. Verifica que estés en la misma red WiFi
2. Desactiva VPN si está activa
3. Prueba con conexión por túnel:
   ```bash
   expo start --tunnel
   ```
4. Si falla, intenta con IP directa:
   ```bash
   expo start --lan
   ```

### 10. Errores de TypeScript

**Problema**: Errores `.ts` o tipos no encontrados

**Solución**:
Los archivos están en `.js`, ignora los warnings de TypeScript o:

```bash
# Si usas VS Code
# Crea .vscode/settings.json:
{
  "typescript.validate.enable": false
}
```

### 11. Navegación no funciona

**Problema**: Cambios de vista no funcionan

**Verifica**:

```javascript
// En App.js, agrega logs:
const handleLogin = (usr) => {
  console.log("Login called with:", usr);
  setVistaActual(usr.role === "administrador" ? "admin" : "client");
};
```

### 12. Estilos se ven mal

**Problema**: Elementos desbordados o mal posicionados

**Solución**:
React Native no usa CSS directamente. Verifica:

- No uses `display: flex` en StyleSheet (es por defecto)
- Usa `flexWrap: 'wrap'` para elementos que se desbordan
- Usa `ScrollView` para contenido largo

### 13. Imágenes no cargan

**Problema**: Assets no se muestran

**Solución**:

```bash
# Limpia cache y reinicia
expo start --clear
```

Verifica rutas en `app.json`:

```json
{
  "icon": "./assets/icon.png",
  "splash": {
    "image": "./assets/splash.png"
  }
}
```

## 🔍 Herramientas de Diagnóstico

### Ver logs en tiempo real

```bash
# Terminal 1: Corre la app
npm start

# Terminal 2: Ver logs de Android
npx react-native log-android

# Terminal 3: Ver logs de iOS
npx react-native log-ios
```

### Inspeccionar con Chrome DevTools

1. En Metro Bundler presiona `j` para abrir debugger
2. Abre Chrome en `http://localhost:19000/debugger-ui`
3. Usa la consola para ver logs

### React Native Debugger

```bash
npm install -g react-native-debugger
react-native-debugger
```

## 📞 Obtener Ayuda

### Información útil al reportar bugs:

```bash
# Versión de Node
node --version

# Versión de npm
npm --version

# Versión de Expo
expo --version

# Info del sistema
npx expo-doctor
```

### Comunidad:

- Expo Forums: https://forums.expo.dev
- Stack Overflow: Tag `expo` o `react-native`
- GitHub Issues: Del proyecto específico

## ✅ Checklist de Solución

Cuando tengas un problema, revisa en orden:

1. [ ] ¿Tengo la última versión de las dependencias?
2. [ ] ¿Limpié la cache (`expo start --clear`)?
3. [ ] ¿Las variables de entorno están correctas?
4. [ ] ¿Puedo ver los logs del error?
5. [ ] ¿El error persiste en otro dispositivo?
6. [ ] ¿Busqué el error en Google/Stack Overflow?
7. [ ] ¿Revisé la documentación oficial?

---

**Tip**: Cuando encuentres la solución a tu problema, documéntala para futura referencia.
