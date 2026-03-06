# 🔐 Configuración de Supabase

## Obtener Credenciales de Supabase

### Paso 1: Acceder a tu Proyecto Supabase

1. Ve a [https://supabase.com](https://supabase.com)
2. Inicia sesión con tu cuenta
3. Selecciona tu proyecto (o crea uno nuevo)

### Paso 2: Obtener las Credenciales

1. En el dashboard, ve a **Settings** (⚙️ icono en la barra lateral)
2. Click en **API** en el menú de configuración
3. Encontrarás dos valores importantes:

#### Project URL

```
https://tuproyecto.supabase.co
```

Esta es tu `EXPO_PUBLIC_SUPABASE_URL`

#### anon/public key

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Esta es tu `EXPO_PUBLIC_SUPABASE_ANON_KEY`

### Paso 3: Configurar en la App

Edita el archivo `.env` en la carpeta `react-native`:

```env
EXPO_PUBLIC_SUPABASE_URL=https://tuproyecto.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
EXPO_PUBLIC_API_URL=https://stock-sync-api.onrender.com
```

---

## 🗄️ Configurar Base de Datos

### Crear Tablas Necesarias

Si aún no tienes las tablas, créalas en Supabase:

#### 1. Tabla `usuarios`

```sql
CREATE TABLE usuarios (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  pass TEXT NOT NULL,
  role TEXT DEFAULT 'cliente',
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### 2. Tabla `categorias`

```sql
CREATE TABLE categorias (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### 3. Tabla `proveedores`

```sql
CREATE TABLE proveedores (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre TEXT NOT NULL,
  email TEXT,
  telefono TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### 4. Tabla `productos`

```sql
CREATE TABLE productos (
  id TEXT PRIMARY KEY,
  nombre TEXT NOT NULL,
  precio NUMERIC NOT NULL,
  cantidad INTEGER DEFAULT 0,
  categoria_id UUID REFERENCES categorias(id),
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### 5. Vista `vista_productos_con_categoria`

```sql
CREATE VIEW vista_productos_con_categoria AS
SELECT
  p.id,
  p.nombre,
  p.precio,
  p.cantidad,
  p.categoria_id,
  c.nombre as categoria_nombre,
  p.created_at
FROM productos p
LEFT JOIN categorias c ON p.categoria_id = c.id;
```

#### 6. Tabla `producto_proveedor` (relación)

```sql
CREATE TABLE producto_proveedor (
  producto_id TEXT REFERENCES productos(id) ON DELETE CASCADE,
  proveedor_id UUID REFERENCES proveedores(id) ON DELETE CASCADE,
  PRIMARY KEY (producto_id, proveedor_id)
);
```

#### 7. Tabla `proveedor_categorias` (relación)

```sql
CREATE TABLE proveedor_categorias (
  proveedor_id UUID REFERENCES proveedores(id) ON DELETE CASCADE,
  categoria_id UUID REFERENCES categorias(id) ON DELETE CASCADE,
  PRIMARY KEY (proveedor_id, categoria_id)
);
```

---

## 🔓 Configurar Políticas de Seguridad (RLS)

### Habilitar Row Level Security

Para cada tabla, ejecuta:

```sql
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE categorias ENABLE ROW LEVEL SECURITY;
ALTER TABLE proveedores ENABLE ROW LEVEL SECURITY;
ALTER TABLE productos ENABLE ROW LEVEL SECURITY;
ALTER TABLE producto_proveedor ENABLE ROW LEVEL SECURITY;
ALTER TABLE proveedor_categorias ENABLE ROW LEVEL SECURITY;
```

### Crear Políticas Públicas (Para desarrollo)

**⚠️ Nota**: Estas políticas son para desarrollo. En producción, ajusta según tus necesidades.

#### Usuarios - Solo lectura pública

```sql
CREATE POLICY "Allow public read" ON usuarios
  FOR SELECT USING (true);
```

#### Categorías - Lectura y escritura pública

```sql
CREATE POLICY "Allow public read" ON categorias
  FOR SELECT USING (true);

CREATE POLICY "Allow public insert" ON categorias
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public delete" ON categorias
  FOR DELETE USING (true);
```

#### Proveedores - Todas las operaciones

```sql
CREATE POLICY "Allow public all" ON proveedores
  FOR ALL USING (true);
```

#### Productos - Todas las operaciones

```sql
CREATE POLICY "Allow public all" ON productos
  FOR ALL USING (true);
```

#### Relaciones - Todas las operaciones

```sql
CREATE POLICY "Allow public all" ON producto_proveedor
  FOR ALL USING (true);

CREATE POLICY "Allow public all" ON proveedor_categorias
  FOR ALL USING (true);
```

---

## 🔄 Habilitar Realtime

### Para sincronización en tiempo real:

1. Ve a **Database** → **Replication**
2. Habilita replicación para:
   - ✅ `productos`
   - ✅ `proveedores`
   - ✅ `categorias`

O ejecuta SQL:

```sql
ALTER PUBLICATION supabase_realtime ADD TABLE productos;
ALTER PUBLICATION supabase_realtime ADD TABLE proveedores;
ALTER PUBLICATION supabase_realtime ADD TABLE categorias;
```

---

## 📊 Insertar Datos de Prueba

### Categorías

```sql
INSERT INTO categorias (nombre) VALUES
  ('Procesadores'),
  ('Tarjetas Gráficas'),
  ('Memorias RAM'),
  ('Discos Duros'),
  ('Boards'),
  ('Fuentes de Poder'),
  ('Gabinetes'),
  ('Periféricos'),
  ('Monitores'),
  ('Refrigeración'),
  ('Redes'),
  ('Accesorios'),
  ('Mobiliario');
```

### Productos de Ejemplo

```sql
-- Primero obtén el ID de una categoría
-- SELECT id FROM categorias WHERE nombre = 'Procesadores';

INSERT INTO productos (id, nombre, precio, cantidad, categoria_id) VALUES
  ('PROC001', 'Procesador Intel Core i5-13400', 1100000, 12, 'id-de-categoria-procesadores'),
  ('GPU001', 'Tarjeta Gráfica RTX 4060', 1600000, 15, 'id-de-categoria-graficas'),
  ('RAM001', 'Memoria RAM DDR5 16GB', 320000, 20, 'id-de-categoria-ram');
```

---

## 🧪 Verificar Configuración

### Prueba de Conexión

En la consola del navegador o en tu app:

```javascript
import { supabase } from "./src/services/supabaseClient";

// Prueba de lectura
const testConnection = async () => {
  const { data, error } = await supabase.from("productos").select("*").limit(1);

  if (error) {
    console.error("Error de conexión:", error);
  } else {
    console.log("Conexión exitosa:", data);
  }
};

testConnection();
```

---

## 🔒 Seguridad para Producción

### Mejores Prácticas

1. **No uses políticas públicas en producción**
   - Implementa autenticación de Supabase
   - Usa JWT tokens
   - Restringe acceso por rol

2. **Ejemplo de política segura**:

```sql
-- Solo usuarios autenticados pueden leer
CREATE POLICY "Authenticated users can read" ON productos
  FOR SELECT USING (auth.role() = 'authenticated');

-- Solo admins pueden insertar
CREATE POLICY "Only admins can insert" ON productos
  FOR INSERT WITH CHECK (
    auth.jwt() ->> 'role' = 'administrador'
  );
```

3. **Protege datos sensibles**:

```sql
-- No exponer contraseñas
CREATE VIEW usuarios_publicos AS
SELECT id, username, email, role
FROM usuarios;
```

---

## 🆘 Problemas Comunes

### Error: `relation "productos" does not exist`

**Solución**: Crea las tablas usando los scripts SQL de arriba

### Error: `JWT expired`

**Solución**: Regenera las claves en Settings → API

### Error: `permission denied for table`

**Solución**: Verifica las políticas RLS o desactiva RLS temporalmente:

```sql
ALTER TABLE productos DISABLE ROW LEVEL SECURITY;
```

### Datos no se sincronizan en realtime

**Solución**: Habilita replicación para las tablas

---

## 📚 Recursos Adicionales

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase SQL Editor](https://supabase.com/docs/guides/database)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Realtime Guide](https://supabase.com/docs/guides/realtime)

---

## ✅ Checklist de Configuración

- [ ] Crear proyecto en Supabase
- [ ] Obtener URL y ANON KEY
- [ ] Configurar en archivo `.env`
- [ ] Crear todas las tablas
- [ ] Crear vista de productos con categoría
- [ ] Habilitar RLS en todas las tablas
- [ ] Crear políticas de acceso
- [ ] Habilitar Realtime
- [ ] Insertar datos de prueba
- [ ] Probar conexión desde la app

---

**Siguiente paso**: Una vez configurado Supabase, vuelve a `CHECKLIST.md` para continuar con el desarrollo de la app.
