import { Database } from 'bun:sqlite';
import * as bcrypt from 'bcryptjs';

const db = new Database('./prisma/dev.db');

console.log('🗄️ Creando tablas en SQLite...');

// Create tables
db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    role TEXT NOT NULL CHECK(role IN ('OWNER', 'ADMIN')),
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
  )
`);

db.run(`
  CREATE TABLE IF NOT EXISTS queue_items (
    id TEXT PRIMARY KEY,
    youtube_id TEXT NOT NULL,
    title TEXT NOT NULL,
    channel_title TEXT,
    duration TEXT,
    thumbnail TEXT,
    status TEXT NOT NULL CHECK(status IN ('PENDING', 'APPROVED', 'REJECTED', 'PLAYING', 'FINISHED')) DEFAULT 'PENDING',
    "order" INTEGER NOT NULL DEFAULT 0,
    table_number TEXT,
    requested_by TEXT,
    played_at DATETIME,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
  )
`);

db.run(`
  CREATE TABLE IF NOT EXISTS settings (
    id TEXT PRIMARY KEY,
    venue_name TEXT NOT NULL,
    is_system_locked INTEGER NOT NULL DEFAULT 0,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
  )
`);

console.log('✅ Tablas creadas');

// Seed admin user
const hashedPassword = await bcrypt.hash('admin123', 10);

const insertUser = db.prepare(`
  INSERT OR IGNORE INTO users (id, username, password, role, created_at, updated_at)
  VALUES (?, ?, ?, ?, datetime('now'), datetime('now'))
`);

insertUser.run('admin-001', 'admin', hashedPassword, 'OWNER');

console.log('✅ Usuario admin creado (admin/admin123)');

// Seed settings
const insertSettings = db.prepare(`
  INSERT OR IGNORE INTO settings (id, venue_name, is_system_locked, created_at, updated_at)
  VALUES (?, ?, ?, datetime('now'), datetime('now'))
`);

insertSettings.run('1', 'Karaoke Puerto Maldonado', 0);

console.log('✅ Configuración inicial creada');

db.close();

console.log('🎉 Base de datos lista!');
