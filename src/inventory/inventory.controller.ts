import {
    Controller, Get, Post, Delete, Body, Param, Query, HttpCode, HttpStatus,
} from '@nestjs/common';
import { InventoryService } from './inventory.service';

@Controller('inventory')
export class InventoryController {
    constructor(private readonly inventoryService: InventoryService) {}

    // ── Products ─────────────────────────────────────────────

    @Get('products')
    listProducts() {
        return this.inventoryService.listProducts();
    }

    @Post('products')
    @HttpCode(HttpStatus.CREATED)
    createProduct(@Body() body: { name: string }) {
        return this.inventoryService.createProduct(body.name);
    }

    @Delete('products/:id')
    @HttpCode(HttpStatus.OK)
    deleteProduct(@Param('id') id: string) {
        return this.inventoryService.deleteProduct(id);
    }

    // ── Daily inventory ──────────────────────────────────────

    // GET /inventory/daily?date=YYYY-MM-DD
    @Get('daily')
    getDailyInventory(@Query('date') date: string) {
        return this.inventoryService.getDailyInventory(date);
    }

    // POST /inventory/daily
    // body: { date: string, entries: [{productId, milliliters, quantity}], submittedBy: string }
    @Post('daily')
    @HttpCode(HttpStatus.OK)
    submitDailyInventory(
        @Body()
        body: {
            date: string;
            entries: Array<{ productId: string; milliliters: number; quantity: number }>;
            submittedBy: string;
        },
    ) {
        return this.inventoryService.upsertDailyInventory(body.date, body.entries, body.submittedBy);
    }
}
