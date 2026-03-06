# 🚀 Guía Rápida de Inicio

## Instalación en 3 pasos

### 1️⃣ Instalar dependencias

```bash
cd react-native
npm install
```

### 2️⃣ Configurar variables de entorno (Opcional)

El archivo `.env` ya está configurado con los valores correctos que coinciden con tu app web en Vercel.

Si necesitas actualizarlos, edita `.env` basándote en `.env.example`.

✅ **Ya está listo para usar con tu base de datos actual**

### 3️⃣ Iniciar la app

```bash
npm start
```

Escanea el código QR con Expo Go en tu móvil.

## 📱 Generar APK (Instalable)

### Método Rápido con EAS

Una vez que verificaste que la app funciona con `npm start`, puedes generar el APK:

```bash
# 1. Instalar EAS CLI
npm install -g eas-cli

# 2. Login (requiere cuenta Expo - libre en https://expo.dev)
eas login

# 3. Generar APK
eas build -p android --profile preview
```

**⏱️ Espera 15-20 minutos** y tendrás tu APK listo para instalar en Android.

📖 **Guía completa paso a paso**: [GENERAR_APK.md](GENERAR_APK.md)

- Instrucciones detalladas
- Solución de problemas comunes
- Métodos alternativos
- Cómo instalar en tu teléfono

## ✅ Variables de Entorno Actuales

Tu `.env` ya está configurado con:

| Variable                        | Valor                                 | Origen                   |
| ------------------------------- | ------------------------------------- | ------------------------ |
| `EXPO_PUBLIC_SUPABASE_URL`      | `vdprbdudjoqiptxavzmt.supabase.co`    | ✅ Misma BD que web      |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY` | ████████...                           | ✅ Misma API key que web |
| `EXPO_PUBLIC_API_URL`           | `https://stock-sync-api.onrender.com` | ✅ Mismo backend que web |
| `EXPO_PUBLIC_ADMIN_API_TOKEN`   | ████████...                           | ✅ Token sincronizado    |

**🎉 Todo está configurado como tu app web en Vercel**

---

## ⚡ Comandos Útiles

```bash
# Desarrollo
npm start              # Iniciar Expo
npm run android       # Ejecutar en emulador Android
npm run ios           # Ejecutar en simulador iOS (Mac)

# Build con EAS
eas build -p android   # Generar APK
eas build -p ios       # Generar IPA (iOS)
```

---

## 🆘 Solución de Problemas

### Error: "Expo not found"

```bash
npm install -g expo-cli
```

### Error de "variables de entorno"

- Verifica que el archivo `.env` existe en `react-native/`
- Verifica que las variables empiezan con `EXPO_PUBLIC_`
- Reinicia el servidor Expo: `npm start`

### "App no carga datos"

- ✅ Verifica tu conexión a internet
- ✅ Verifica que Supabase está accesible
- ✅ Verifica que el API backend está online

### "APK no instala"

- Baja la versión de Android API si tienes problemas
- Verifica que tienes espacio en tu teléfono
- Intenta instalar versión preview primero

---

## 📚 Documentación Relacionada

- [README.md](README.md) - Documentación completa
- [GENERAR_APK.md](GENERAR_APK.md) - Guía detallada para generar APK
- [INDEX.md](INDEX.md) - Índice de toda la documentación

---

## 📞 Soporte

- **Expo Docs**: https://docs.expo.dev
- **Supabase Docs**: https://supabase.com/docs
- **EAS Build**: https://docs.expo.dev/build/setup/

---

**¿Listo?** 👇

```bash
cd react-native
npm install
npm start
```

Escanea el QR con **Expo Go** en tu móvil

Una vez que funciona localmente, ve a **[GENERAR_APK.md](GENERAR_APK.md)** para crear tu APK instalable
