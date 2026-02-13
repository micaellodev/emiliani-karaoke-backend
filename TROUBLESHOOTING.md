# 🔧 Solución al Error de Permisos de Base de Datos

## Problema
El seed script falla con error `DatabaseAccessDenied` al intentar crear el usuario admin.

## Causas Posibles
1. **URL incorrecta**: Estás usando la URL interna en lugar de la externa
2. **Permisos restrictivos**: El usuario de Render tiene permisos limitados
3. **Firewall**: Render está bloqueando conexiones externas

## Soluciones

### Opción 1: Verificar URL de Conexión (RECOMENDADA)

1. Ve a tu dashboard de Render: https://dashboard.render.com
2. Selecciona tu base de datos PostgreSQL
3. En la sección "Connections", copia la **External Database URL**
4. Reemplaza el `DATABASE_URL` en `server/.env`

La URL externa debería verse así:
```
postgresql://user:password@dpg-xxxxx-a.oregon-postgres.render.com/dbname
```

**Nota**: La URL que tienes actualmente usa `virginia-postgres.render.com`, asegúrate de que sea la URL externa.

### Opción 2: Crear Usuario Manualmente con SQL

1. Ve a tu dashboard de Render
2. Abre el **SQL Editor** de tu base de datos
3. Ejecuta el script `prisma/manual-seed.sql`:

```sql
INSERT INTO users (id, username, password, role, created_at, updated_at)
VALUES (
  'admin-001',
  'admin',
  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
  'OWNER',
  NOW(),
  NOW()
)
ON CONFLICT (username) DO NOTHING;

INSERT INTO settings (id, venue_name, is_system_locked, created_at, updated_at)
VALUES (
  '1',
  'Karaoke Puerto Maldonado',
  false,
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;
```

**Credenciales:**
- Usuario: `admin`
- Contraseña: `admin123`

### Opción 3: Usar Prisma Studio

1. Ejecuta:
   ```bash
   cd server
   bun x prisma studio
   ```

2. Se abrirá una interfaz web
3. Crea manualmente:
   - **User**: username=`admin`, password=`$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy`, role=`OWNER`
   - **Settings**: id=`1`, venueName=`Karaoke Puerto Maldonado`, isSystemLocked=`false`

### Opción 4: Permitir Conexiones Externas en Render

1. Ve a tu base de datos en Render
2. En "Settings" → "Access Control"
3. Asegúrate de que "Allow external connections" esté habilitado
4. Agrega tu IP a la whitelist si es necesario

## Verificar que Funcionó

Después de crear el usuario admin (por cualquier método), prueba el login:

```bash
cd server
bun run start:dev
```

En otra terminal:
```bash
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

Deberías recibir un JWT token.

## Siguiente Paso

Una vez que el usuario admin esté creado, puedes iniciar el backend:

```bash
cd server
bun run start:dev
```

El backend estará listo en `http://localhost:3001` 🚀
