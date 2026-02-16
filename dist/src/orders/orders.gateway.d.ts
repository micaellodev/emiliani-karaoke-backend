import { Server, Socket } from 'socket.io';
import { OrdersService } from './orders.service';
export declare class OrdersGateway {
    private readonly ordersService;
    server: Server;
    constructor(ordersService: OrdersService);
    handleCreateOrder(data: {
        tableNumber: number;
        userName?: string;
        items: any[];
    }, client: Socket): Promise<{
        id: string;
        createdAt: Date;
        status: string;
        tableNumber: number;
        userName: string | null;
        items: import("@prisma/client/runtime/library").JsonValue;
        totalPrice: number;
    }>;
    handleGetOrders(): Promise<{
        id: string;
        createdAt: Date;
        status: string;
        tableNumber: number;
        userName: string | null;
        items: import("@prisma/client/runtime/library").JsonValue;
        totalPrice: number;
    }[]>;
    handleCompleteOrder(data: {
        id: string;
    }): Promise<void>;
    handleGetCompletedOrders(): Promise<{
        id: string;
        createdAt: Date;
        status: string;
        tableNumber: number;
        userName: string | null;
        items: import("@prisma/client/runtime/library").JsonValue;
        totalPrice: number;
    }[]>;
    handleDeleteOrder(data: {
        id: string;
    }): Promise<void>;
    handleGetOrdersByTable(data: {
        tableNumber: number;
    }): Promise<{
        tableNumber: number;
        orders: {
            id: string;
            createdAt: Date;
            status: string;
            tableNumber: number;
            userName: string | null;
            items: import("@prisma/client/runtime/library").JsonValue;
            totalPrice: number;
        }[];
        aggregatedItems: {
            name: string;
            quantity: number;
        }[];
        totalPrice: number;
        orderCount: number;
    }>;
}
