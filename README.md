# 🎤 Karaoke System - Backend (NestJS)

Backend del sistema de karaoke con NestJS, Socket.io, JWT y auto-recuperación para entornos con energía inestable.

## 🚀 Inicio Rápido

### 1. Instalar dependencias
```bash
bun install
```

### 2. Configurar variables de entorno
```bash
cp .env.example .env
# Editar .env con tus credenciales
```

Variables requeridas:
```env
DATABASE_URL="postgresql://user:password@host:5432/database"
JWT_SECRET="your-super-secret-jwt-key"
YOUTUBE_API_KEY="your-youtube-api-key"
PORT=3001
```

### 3. Configurar base de datos
```bash
bun run db:push      # Push schema a PostgreSQL
bun run db:generate  # Generar Prisma Client
bun run db:seed      # Crear usuario admin (admin/admin123)
```

### 4. Iniciar servidor
```bash
bun run start:dev    # Desarrollo (hot reload)
# o
bun run start        # Producción
```

Servidor corriendo en: **http://localhost:3001**

---

## 📋 Comandos Disponibles

| Comando | Descripción |
|---------|-------------|
| `bun run start:dev` | Servidor desarrollo con hot reload |
| `bun run start` | Servidor producción |
| `bun run build` | Compilar TypeScript |
| `bun run db:push` | Push schema Prisma a DB |
| `bun run db:generate` | Generar Prisma Client |
| `bun run db:seed` | Seed base de datos |

---

## 🔌 API Endpoints

### Autenticación
- `POST /auth/login` - Login (retorna JWT)

### Gestión de Cola
- `POST /queue/request` - Agregar canción
- `GET /queue` - Obtener cola completa
- `GET /queue/recover` - **Auto-recuperación** (crítico)
- `PATCH /queue/approve/:id` - Aprobar canción
- `PATCH /queue/reject/:id` - Rechazar canción
- `POST /queue/play/:id` - Marcar como reproduciendo
- `POST /queue/next` - Completar canción actual
- `PATCH /queue/reorder` - Reordenar cola

### YouTube
- `GET /youtube/search?q=query` - Buscar videos

---

## 🔄 Auto-Recuperación

Endpoint crítico para cortes de energía:

**GET /queue/recover**

Lógica:
1. Busca canción con status `PLAYING`
2. Si existe, la retorna (reanudar reproducción)
3. Si no, retorna la siguiente canción `APPROVED`
4. Si la cola está vacía, retorna `null`

---

## 🌐 Socket.io Events

### Eventos Emitidos
- `new_request` - Nueva canción solicitada
- `queue_updated` - Cola actualizada
- `play_next` - Siguiente canción lista

### Eventos Escuchados
- `skip_song` - Saltar canción
- `pause_song` - Pausar reproducción

---

## 🗄️ Estructura

```
server/
├── src/
│   ├── auth/          # JWT authentication
│   ├── queue/         # Queue management
│   ├── youtube/       # YouTube API
│   ├── gateway/       # Socket.io
│   ├── app.module.ts
│   ├── main.ts
│   └── prisma.service.ts
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
└── package.json
```

---

## 🔒 Seguridad

- Contraseñas hasheadas con bcryptjs (10 rounds)
- JWT expira en 24 horas
- CORS habilitado para `http://localhost:3000`
- Guards JWT para rutas protegidas

---

## 🛠️ Stack Tecnológico

- NestJS 10
- TypeScript
- Bun runtime
- PostgreSQL + Prisma
- Socket.io
- JWT + Passport
- Google YouTube Data API v3
- bcryptjs

---

**Backend listo para producción** ✅
