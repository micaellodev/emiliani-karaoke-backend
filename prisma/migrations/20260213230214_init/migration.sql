-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('OWNER', 'WORKER');

-- CreateEnum
CREATE TYPE "QueueStatus" AS ENUM ('PENDING', 'APPROVED', 'PLAYING', 'FINISHED', 'REJECTED');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'WORKER',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "queue_items" (
    "id" TEXT NOT NULL,
    "youtube_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "channel_title" TEXT NOT NULL,
    "duration" TEXT NOT NULL,
    "requested_by_table" INTEGER NOT NULL,
    "requested_by" TEXT,
    "status" "QueueStatus" NOT NULL DEFAULT 'PENDING',
    "order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "played_at" TIMESTAMP(3),

    CONSTRAINT "queue_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "table_sessions" (
    "id" SERIAL NOT NULL,
    "table_number" INTEGER NOT NULL,
    "user_name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "table_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "settings" (
    "id" TEXT NOT NULL,
    "venue_name" TEXT NOT NULL DEFAULT 'Karaoke Venue',
    "is_system_locked" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "settings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE INDEX "queue_items_status_order_idx" ON "queue_items"("status", "order");

-- CreateIndex
CREATE UNIQUE INDEX "table_sessions_table_number_key" ON "table_sessions"("table_number");
