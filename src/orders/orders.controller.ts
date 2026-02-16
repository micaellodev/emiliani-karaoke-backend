import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { AuthGuard } from '@nestjs/passport'; // Assuming AuthGuard follows standard NestJS patterns

@Controller('orders')
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) { }

    @Get('sales')
    async getSalesLog(
        @Query('startDate') startDate?: string,
        @Query('endDate') endDate?: string,
        @Query('tableNumber') tableNumber?: string,
        @Query('sellerName') sellerName?: string,
    ) {
        return this.ordersService.getSalesLog({
            startDate: startDate ? new Date(startDate) : undefined,
            endDate: endDate ? new Date(endDate) : undefined,
            tableNumber: tableNumber ? parseInt(tableNumber) : undefined,
            sellerName,
        });
    }

    @Get('stats/top-beverages')
    async getTopBeverages(
        @Query('startDate') startDate?: string,
        @Query('endDate') endDate?: string,
    ) {
        return this.ordersService.getTopBeverages(
            startDate ? new Date(startDate) : undefined,
            endDate ? new Date(endDate) : undefined,
        );
    }
}
