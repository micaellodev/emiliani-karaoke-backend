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
        tableNumber: number;
        userName: string | null;
        items: import("@prisma/client/runtime/library").JsonValue;
        totalPrice: number;
        status: string;
        createdAt: Date;
    }>;
    handleGetOrders(): Promise<{
        id: string;
        tableNumber: number;
        userName: string | null;
        items: import("@prisma/client/runtime/library").JsonValue;
        totalPrice: number;
        status: string;
        createdAt: Date;
    }[]>;
    handleCompleteOrder(data: {
        id: string;
    }): Promise<void>;
    handleGetCompletedOrders(): Promise<{
        id: string;
        tableNumber: number;
        userName: string | null;
        items: import("@prisma/client/runtime/library").JsonValue;
        totalPrice: number;
        status: string;
        createdAt: Date;
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
            tableNumber: number;
            userName: string | null;
            items: import("@prisma/client/runtime/library").JsonValue;
            totalPrice: number;
            status: string;
            createdAt: Date;
        }[];
        aggregatedItems: {
            name: string;
            quantity: number;
        }[];
        totalPrice: number;
        orderCount: number;
    }>;
}
