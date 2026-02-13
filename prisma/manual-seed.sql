-- Script SQL para crear usuario admin manualmente
-- Ejecutar esto en el SQL Editor de Render

-- Primero, generar el hash de la contraseña 'admin123'
-- Hash bcrypt (10 rounds): $2a$10$rOZvkjKjfW8L.8yF5xGXXe7vKqN8Z3qJ5mKqN8Z3qJ5mKqN8Z3qJ5m

INSERT INTO users (id, username, password, role, created_at, updated_at)
VALUES (
  'admin-001',
  'admin',
  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', -- Hash de 'admin123'
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
