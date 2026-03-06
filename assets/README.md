# Assets - Imágenes de la App

Esta carpeta contiene los recursos visuales de la aplicación.

## Archivos Requeridos

### icon.png

- **Tamaño**: 1024x1024 px
- **Formato**: PNG con transparencia
- **Uso**: Icono principal de la app

### adaptive-icon.png

- **Tamaño**: 1024x1024 px
- **Formato**: PNG con transparencia
- **Uso**: Icono adaptativo para Android (parte central de 512x512)

### splash.png

- **Tamaño**: Mínimo 1242x2436 px
- **Formato**: PNG
- **Uso**: Pantalla de inicio (splash screen)

### favicon.png

- **Tamaño**: 48x48 px
- **Formato**: PNG
- **Uso**: Favicon para versión web

## Crear tus propios assets

### Herramientas Recomendadas

1. **Online**:
   - [Canva](https://canva.com) - Diseño gráfico
   - [Remove.bg](https://remove.bg) - Remover fondos
   - [ezgif](https://ezgif.com/resize) - Redimensionar imágenes

2. **Desktop**:
   - GIMP (gratuito)
   - Photoshop
   - Figma

### Generadores de Iconos

- [App Icon Generator](https://www.appicon.co/)
- [Icon Kitchen](https://icon.kitchen/)

### Tips de Diseño

1. **Icon.png**:
   - Usa colores distintivos relacionados con stock/inventario
   - Mantén el diseño simple y reconocible
   - Evita texto pequeño
   - Usa transparencia para bordes suaves

2. **Splash Screen**:
   - Mantén el contenido importante en el centro
   - Usa el mismo color de fondo que en app.json
   - Puede incluir logo y nombre de la app

## Reemplazar Assets

1. Coloca tus archivos PNG en esta carpeta
2. Asegúrate de usar los nombres exactos:
   - `icon.png`
   - `adaptive-icon.png`
   - `splash.png`
   - `favicon.png`
3. Limpia cache y reconstruye:
   ```bash
   expo start --clear
   ```

## Assets Actuales

Los archivos placeholder actuales deben ser reemplazados con tus propios diseños antes de generar el APK de producción.

Para una app profesional:

1. Diseña un logo único
2. Crea iconos en alta resolución
3. Diseña un splash screen atractivo
4. Genera todas las variantes de tamaño

## Colores Sugeridos para Stock-Sync

- Azul: `#007bff` (Primario)
- Verde: `#28a745` (Éxito/Stock)
- Amarillo: `#ffc107` (Advertencia)
- Rojo: `#dc3545` (Peligro/Agotado)
- Gris: `#6c757d` (Secundario)
