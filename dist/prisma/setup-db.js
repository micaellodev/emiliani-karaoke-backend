"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const bun_sqlite_1 = require("bun:sqlite");
const bcrypt = __importStar(require("bcryptjs"));
const db = new bun_sqlite_1.Database('./prisma/dev.db');
console.log('🗄️ Creando tablas en SQLite...');
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
const hashedPassword = await bcrypt.hash('admin123', 10);
const insertUser = db.prepare(`
  INSERT OR IGNORE INTO users (id, username, password, role, created_at, updated_at)
  VALUES (?, ?, ?, ?, datetime('now'), datetime('now'))
`);
insertUser.run('admin-001', 'admin', hashedPassword, 'OWNER');
console.log('✅ Usuario admin creado (admin/admin123)');
const insertSettings = db.prepare(`
  INSERT OR IGNORE INTO settings (id, venue_name, is_system_locked, created_at, updated_at)
  VALUES (?, ?, ?, datetime('now'), datetime('now'))
`);
insertSettings.run('1', 'Karaoke Puerto Maldonado', 0);
console.log('✅ Configuración inicial creada');
db.close();
console.log('🎉 Base de datos lista!');
//# sourceMappingURL=setup-db.js.map