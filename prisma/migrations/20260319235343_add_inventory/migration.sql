-- CreateTable
CREATE TABLE "table_logs" (
    "id" SERIAL NOT NULL,
    "table_number" INTEGER NOT NULL,
    "customer_name" TEXT NOT NULL,
    "opened_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "closed_at" TIMESTAMP(3),
    "opened_by" TEXT NOT NULL DEFAULT 'System',
    "closed_by" TEXT,
    "total_total" DOUBLE PRECISION,

    CONSTRAINT "table_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventory_products" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "inventory_products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "daily_inventory_entries" (
    "id" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "milliliters" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "quantity" INTEGER NOT NULL DEFAULT 0,
    "submitted_by" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "productId" TEXT NOT NULL,

    CONSTRAINT "daily_inventory_entries_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "inventory_products_name_key" ON "inventory_products"("name");

-- CreateIndex
CREATE INDEX "daily_inventory_entries_date_idx" ON "daily_inventory_entries"("date");

-- CreateIndex
CREATE UNIQUE INDEX "daily_inventory_entries_productId_date_key" ON "daily_inventory_entries"("productId", "date");

-- AddForeignKey
ALTER TABLE "daily_inventory_entries" ADD CONSTRAINT "daily_inventory_entries_productId_fkey" FOREIGN KEY ("productId") REFERENCES "inventory_products"("id") ON DELETE CASCADE ON UPDATE CASCADE;
