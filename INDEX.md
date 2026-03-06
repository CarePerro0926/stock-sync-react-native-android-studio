# 📖 Índice de Documentación - Stock-Sync Mobile

Bienvenido a la documentación de Stock-Sync Mobile. Esta guía te ayudará a navegar por todos los recursos disponibles.

---

## 🚀 Inicio Rápido

**¿Primera vez? Empieza aquí:**

1. 📄 [INICIO_RAPIDO.md](INICIO_RAPIDO.md) - Configuración en 3 pasos
2. ✅ [CHECKLIST.md](CHECKLIST.md) - Lista completa de tareas
3. 🔐 [SUPABASE_SETUP.md](SUPABASE_SETUP.md) - Configurar backend

---

## 📚 Documentación Principal

### 📱 General

- **[README.md](README.md)** - Documentación completa del proyecto
- **[CONVERSION_SUMMARY.md](CONVERSION_SUMMARY.md)** - Resumen detallado de la conversión Web → Mobile

### 🔧 Configuración

- **[SUPABASE_SETUP.md](SUPABASE_SETUP.md)** - Cómo configurar Supabase
- **[.env.example](.env.example)** - Plantilla de variables de entorno

### 📦 Build y Distribución

- **[GENERAR_APK.md](GENERAR_APK.md)** - Guía completa para generar APK
- **[eas.json](eas.json)** - Configuración de EAS Build

### 🐛 Solución de Problemas

- **[TROUBLESHOOTING.md](TROUBLESHOOTING.md)** - Problemas comunes y soluciones

### 🎨 Assets

- **[assets/README.md](assets/README.md)** - Guía para iconos y splash screens

---

## 🗂️ Estructura del Código

### Componentes

```
src/components/
├── LoginView.js           # Pantalla de login
├── RegisterView.js        # Pantalla de registro
├── ClientView.js          # Vista del cliente
├── AdminView.js           # Vista del administrador
├── PublicCatalogView.js   # Catálogo público
├── Admin/
│   ├── InventoryTab.js    # Tab de inventario
│   └── AddTab.js          # Tab para agregar
└── Modals/
    ├── PaymentModal.js    # Modal de pago
    └── ConfirmationModal.js # Modal de confirmación
```

### Servicios

```
src/services/
├── supabaseClient.js      # Cliente de Supabase
├── productService.js      # Servicio de productos
├── providerService.js     # Servicio de proveedores
└── categoryService.js     # Servicio de categorías
```

### Hooks

```
src/hooks/
├── useAuth.js             # Hook de autenticación
├── usePayment.js          # Hook de pagos
└── useRealtimeSync.js     # Hook de sincronización
```

---

## 🎯 Flujo de Trabajo Recomendado

### Para Nuevos Desarrolladores

1. **Entender el proyecto**
   - Lee [CONVERSION_SUMMARY.md](CONVERSION_SUMMARY.md)
   - Revisa estructura de carpetas

2. **Configurar entorno**
   - Sigue [INICIO_RAPIDO.md](INICIO_RAPIDO.md)
   - Completa [CHECKLIST.md](CHECKLIST.md) pasos 1-6

3. **Configurar backend**
   - Sigue [SUPABASE_SETUP.md](SUPABASE_SETUP.md)
   - Crea las tablas necesarias

4. **Desarrollo**
   - Ejecuta `npm start`
   - Usa Expo Go para probar
   - Itera sobre features

5. **Build**
   - Sigue [GENERAR_APK.md](GENERAR_APK.md)
   - Genera APK de prueba
   - Distribuye a beta testers

### Para Mantenimiento

1. **Actualizar dependencias**
   - Ejecuta `npm outdated`
   - Actualiza con cuidado
   - Prueba después de actualizar

2. **Agregar features**
   - Crea componente en `src/components/`
   - Agrega servicio si es necesario
   - Actualiza App.js si es requerido
   - Prueba en desarrollo
   - Genera nuevo APK

3. **Solucionar problemas**
   - Consulta [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
   - Busca en logs con `adb logcat`
   - Limpia cache con `expo start --clear`

---

## 📊 Guías por Tarea

### Quiero... Entonces lee...

| Tarea                      | Documento                                      |
| -------------------------- | ---------------------------------------------- |
| Empezar rápido             | [INICIO_RAPIDO.md](INICIO_RAPIDO.md)           |
| Configurar Supabase        | [SUPABASE_SETUP.md](SUPABASE_SETUP.md)         |
| Generar APK                | [GENERAR_APK.md](GENERAR_APK.md)               |
| Resolver un error          | [TROUBLESHOOTING.md](TROUBLESHOOTING.md)       |
| Entender la conversión     | [CONVERSION_SUMMARY.md](CONVERSION_SUMMARY.md) |
| Cambiar iconos             | [assets/README.md](assets/README.md)           |
| Seguir una lista de tareas | [CHECKLIST.md](CHECKLIST.md)                   |

---

## 🔑 Archivos Clave

### Configuración

- `package.json` - Dependencias del proyecto
- `app.json` - Configuración de Expo
- `eas.json` - Configuración de builds
- `.env` - Variables de entorno (crear desde .env.example)

### Código Principal

- `App.js` - Punto de entrada de la aplicación
- `src/services/supabaseClient.js` - Conexión a Supabase
- `src/components/LoginView.js` - Primera pantalla

---

## 💡 Tips de Navegación

### Para Principiantes

1. Empieza con [INICIO_RAPIDO.md](INICIO_RAPIDO.md)
2. Si algo falla, ve a [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
3. Para entender el código, lee [CONVERSION_SUMMARY.md](CONVERSION_SUMMARY.md)

### Para Experimentados

1. Clona el proyecto
2. Copia `.env.example` a `.env`
3. `npm install && npm start`
4. Cuando quieras APK: [GENERAR_APK.md](GENERAR_APK.md)

### Para Apurados

```bash
cd react-native
cp .env.example .env
# Edita .env con tus credenciales
npm install
npm start
# Escanea QR con Expo Go
```

---

## 🔍 Búsqueda Rápida

### Por Tema

**Backend/Base de Datos**

- [SUPABASE_SETUP.md](SUPABASE_SETUP.md) - Todo sobre Supabase
- `src/services/` - Servicios de API

**UI/Componentes**

- `src/components/` - Todos los componentes
- [assets/README.md](assets/README.md) - Iconos y diseño

**Build/Distribución**

- [GENERAR_APK.md](GENERAR_APK.md) - APK generation
- `eas.json` - Build config

**Problemas**

- [TROUBLESHOOTING.md](TROUBLESHOOTING.md) - Troubleshooting guide

---

## 📞 Soporte

### Recursos Oficiales

- [Expo Documentation](https://docs.expo.dev)
- [React Native Docs](https://reactnative.dev/docs/getting-started)
- [Supabase Docs](https://supabase.com/docs)

### Comandos Útiles

```bash
# Ver ayuda
expo --help

# Limpiar cache
expo start --clear

# Ver logs Android
adb logcat | grep StockSync

# Ver info del proyecto
npx expo-doctor
```

---

## ✅ Estado de la Documentación

| Documento             | Estado      | Última Actualización |
| --------------------- | ----------- | -------------------- |
| README.md             | ✅ Completo | Hoy                  |
| INICIO_RAPIDO.md      | ✅ Completo | Hoy                  |
| CHECKLIST.md          | ✅ Completo | Hoy                  |
| SUPABASE_SETUP.md     | ✅ Completo | Hoy                  |
| GENERAR_APK.md        | ✅ Completo | Hoy                  |
| TROUBLESHOOTING.md    | ✅ Completo | Hoy                  |
| CONVERSION_SUMMARY.md | ✅ Completo | Hoy                  |

---

## 🎯 Próximos Pasos Sugeridos

1. ✅ **Leer esta página** (¡ya lo hiciste!)
2. 📖 Ir a [INICIO_RAPIDO.md](INICIO_RAPIDO.md)
3. 🔧 Configurar con [CHECKLIST.md](CHECKLIST.md)
4. 🚀 Desarrollar y probar
5. 📦 Generar APK con [GENERAR_APK.md](GENERAR_APK.md)

---

**¿Perdido?** Empieza con [INICIO_RAPIDO.md](INICIO_RAPIDO.md)

**¿Error?** Ve a [TROUBLESHOOTING.md](TROUBLESHOOTING.md)

**¿Listo?** Ejecuta `npm start` en la carpeta `react-native/`
