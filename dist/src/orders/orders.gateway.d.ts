import { Server, Socket } from 'socket.io';
import { OrdersService } from './orders.service';
export declare class OrdersGateway {
    private readonly ordersService;
    server: Server;
    constructor(ordersService: OrdersService);
    handleCreateOrder(data: {
        tableNumber: number;
        items: any[];
    }, client: Socket): Promise<{
        id: string;
        tableNumber: number;
        items: import("@prisma/client/runtime/library").JsonValue;
        status: string;
        createdAt: Date;
    }>;
    handleGetOrders(): Promise<{
        id: string;
        tableNumber: number;
        items: import("@prisma/client/runtime/library").JsonValue;
        status: string;
        createdAt: Date;
    }[]>;
    handleCompleteOrder(data: {
        id: string;
    }): Promise<void>;
}
