import { OrdersService } from './orders.service';
export declare class OrdersController {
    private readonly ordersService;
    constructor(ordersService: OrdersService);
    getSalesLog(startDate?: string, endDate?: string, tableNumber?: string, sellerName?: string): Promise<{
        id: string;
        tableNumber: number;
        userName: string | null;
        items: import("@prisma/client/runtime/library").JsonValue;
        totalPrice: number;
        status: string;
        createdAt: Date;
    }[]>;
    getTopBeverages(startDate?: string, endDate?: string): Promise<{
        name: string;
        count: number;
    }[]>;
}
