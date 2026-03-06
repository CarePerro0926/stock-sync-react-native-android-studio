# 📱 Stock-Sync Mobile - React Native

Aplicación móvil de gestión de inventario convertida de React Web a React Native usando Expo.

## 📚 Documentación Rápida

| Documento                                          | Descripción                    |
| -------------------------------------------------- | ------------------------------ |
| **[INICIO_RAPIDO.md](INICIO_RAPIDO.md)**           | 🚀 Empieza en 3 pasos          |
| **[CHECKLIST.md](CHECKLIST.md)**                   | ✅ Lista de tareas paso a paso |
| **[SUPABASE_SETUP.md](SUPABASE_SETUP.md)**         | 🔐 Configurar base de datos    |
| **[GENERAR_APK.md](GENERAR_APK.md)**               | 📦 Cómo generar el APK         |
| **[TROUBLESHOOTING.md](TROUBLESHOOTING.md)**       | 🔧 Solución de problemas       |
| **[CONVERSION_SUMMARY.md](CONVERSION_SUMMARY.md)** | 📊 Resumen de la conversión    |

---

## 📱 Características

- ✅ Autenticación de usuarios (Login/Registro)
- ✅ Vista de Administrador con gestión de inventario
- ✅ Vista de Cliente con carrito de compras
- ✅ Catálogo público de productos
- ✅ Sincronización en tiempo real con Supabase
- ✅ Gestión de productos, proveedores y categorías
- ✅ Sistema de pagos simulado (Tarjeta y Efecty)

## 🚀 Instalación y Configuración

### Requisitos Previos

- Node.js (versión 16 o superior)
- npm o yarn
- Expo CLI: `npm install -g expo-cli`
- Para generar APK: Cuenta en [Expo Application Services (EAS)](https://expo.dev)

### Paso 1: Instalar Dependencias

```bash
cd react-native
npm install
```

### Paso 2: Configurar Variables de Entorno

1. Copia el archivo de ejemplo:

```bash
copy .env.example .env
```

2. Edita el archivo `.env` con tus credenciales de Supabase:

```env
EXPO_PUBLIC_SUPABASE_URL=tu_supabase_url_aqui
EXPO_PUBLIC_SUPABASE_ANON_KEY=tu_supabase_anon_key_aqui
EXPO_PUBLIC_API_URL=https://stock-sync-api.onrender.com
```

### Paso 3: Ejecutar la Aplicación

#### Desarrollo con Expo Go

```bash
npm start
```

Luego escanea el código QR con:

- **Android**: App Expo Go desde Google Play Store
- **iOS**: Cámara del iPhone o app Expo Go desde App Store

#### Ejecutar en Emulador

```bash
# Android
npm run android

# iOS (solo en Mac)
npm run ios
```

## 📦 Generar APK para Instalación

### Opción 1: Usando EAS Build (Recomendado)

1. **Instalar EAS CLI**:

```bash
npm install -g eas-cli
```

2. **Iniciar sesión en Expo**:

```bash
eas login
```

3. **Configurar el proyecto**:

```bash
eas build:configure
```

4. **Generar APK**:

```bash
eas build -p android --profile preview
```

Este comando generará un APK que puedes descargar e instalar directamente en tu dispositivo Android.

5. **Descargar el APK**:
   Una vez completado el build, recibirás un link para descargar el APK. También puedes verlo en:

```bash
eas build:list
```

### Opción 2: Build Local (Avanzado)

Si prefieres generar el APK localmente sin usar EAS:

```bash
# Instalar Android Studio y configurar SDK
# Luego ejecutar:
npx expo run:android --variant release
```

## 📱 Instalación del APK

1. Descarga el APK generado
2. En tu dispositivo Android, ve a **Configuración > Seguridad**
3. Habilita **Fuentes desconocidas** o **Instalar apps desconocidas**
4. Abre el archivo APK descargado
5. Toca **Instalar**

## 🔑 Credenciales de Prueba

### Administrador

- Usuario: `admin@stocksync.com`
- Contraseña: `admin123`

### Cliente

- Usuario: `cliente@test.com`
- Contraseña: `cliente123`

## 🏗️ Estructura del Proyecto

```
react-native/
├── src/
│   ├── components/
│   │   ├── Admin/
│   │   │   ├── AddTab.js
│   │   │   └── InventoryTab.js
│   │   ├── Modals/
│   │   │   ├── PaymentModal.js
│   │   │   └── ConfirmationModal.js
│   │   ├── AdminView.js
│   │   ├── ClientView.js
│   │   ├── LoginView.js
│   │   ├── PublicCatalogView.js
│   │   └── RegisterView.js
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── usePayment.js
│   │   └── useRealtimeSync.js
│   ├── services/
│   │   ├── categoryService.js
│   │   ├── productService.js
│   │   ├── providerService.js
│   │   └── supabaseClient.js
│   └── data/
│       └── initialData.js
├── App.js
├── app.json
├── eas.json
├── package.json
└── .env
```

## 🛠️ Tecnologías Utilizadas

- **React Native**: Framework principal
- **Expo**: Herramientas de desarrollo y build
- **Supabase**: Backend y base de datos en tiempo real
- **AsyncStorage**: Almacenamiento local persistente
- **React Hooks**: Gestión de estado

## 📖 Funcionalidades Principales

### Vista de Login

- Autenticación con correo/usuario y contraseña
- Validación de credenciales contra Supabase
- Persistencia de sesión con AsyncStorage

### Vista de Cliente

- Catálogo de productos filtrable
- Búsqueda por categoría y texto
- Carrito de compras
- Simulación de pagos (Tarjeta y Efecty)

### Vista de Administrador

- Inventario completo con filtros
- Agregar productos, categorías y proveedores
- Sincronización en tiempo real

### Catálogo Público

- Vista sin autenticación
- Filtros por categoría
- Búsqueda de productos

## 🔄 Sincronización en Tiempo Real

La aplicación se sincroniza automáticamente con Supabase usando:

- Suscripciones a cambios de PostgreSQL
- Actualizaciones instantáneas en productos y proveedores
- Sin necesidad de recargar manualmente

## 🐛 Solución de Problemas

### Error: "Expo not found"

```bash
npm install -g expo-cli
```

### Error de variables de entorno

Asegúrate de que el archivo `.env` esté en la raíz del proyecto y contenga todas las variables necesarias.

### Error al generar APK

1. Verifica tu conexión a internet
2. Asegúrate de estar autenticado en EAS: `eas whoami`
3. Revisa el archivo `eas.json` esté configurado correctamente

## 🔐 Seguridad

- Las contraseñas se validan en el backend
- Las credenciales de Supabase están en variables de entorno
- AsyncStorage se usa para sesiones locales seguras

## 📄 Licencia

Proyecto educativo para SENA ADSO

## 👨‍💻 Desarrollo

Para contribuir o modificar:

1. Clona el repositorio
2. Instala dependencias: `npm install`
3. Crea una rama: `git checkout -b feature/nueva-funcionalidad`
4. Realiza cambios y prueba
5. Commit: `git commit -m "Descripción del cambio"`
6. Push: `git push origin feature/nueva-funcionalidad`

## 📞 Soporte

Para problemas o preguntas:

- Revisa la documentación de [Expo](https://docs.expo.dev)
- Consulta la documentación de [Supabase](https://supabase.com/docs)
- Revisa los logs con: `npx expo start --clear`

---

**Nota**: Esta es una conversión completa de la aplicación web React a React Native. Todas las funcionalidades del proyecto original han sido adaptadas para funcionar nativamente en dispositivos móviles Android.
