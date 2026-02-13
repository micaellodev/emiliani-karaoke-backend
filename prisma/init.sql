-- Create tables directly in SQLite
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('OWNER', 'ADMIN')),
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS queue_items (
    id TEXT PRIMARY KEY,
    youtube_id TEXT NOT NULL,
    title TEXT NOT NULL,
    channel_title TEXT,
    duration TEXT,
    thumbnail TEXT,
    status TEXT NOT NULL CHECK (
        status IN (
            'PENDING',
            'APPROVED',
            'REJECTED',
            'PLAYING',
            'FINISHED'
        )
    ) DEFAULT 'PENDING',
    "order" INTEGER NOT NULL DEFAULT 0,
    table_number TEXT,
    requested_by TEXT,
    played_at DATETIME,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS settings (
    id TEXT PRIMARY KEY,
    venue_name TEXT NOT NULL,
    is_system_locked BOOLEAN NOT NULL DEFAULT 0,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Insert admin user (password: admin123)
INSERT
OR IGNORE INTO users (
    id,
    username,
    password,
    role,
    created_at,
    updated_at
)
VALUES (
        'admin-001',
        'admin',
        '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
        'OWNER',
        datetime ('now'),
        datetime ('now')
    );

-- Insert default settings
INSERT
OR IGNORE INTO settings (
    id,
    venue_name,
    is_system_locked,
    created_at,
    updated_at
)
VALUES (
        '1',
        'Karaoke Puerto Maldonado',
        0,
        datetime ('now'),
        datetime ('now')
    );