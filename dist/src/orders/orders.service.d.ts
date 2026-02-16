import { PrismaService } from '../prisma.service';
export declare class OrdersService {
    private prisma;
    constructor(prisma: PrismaService);
    createOrder(data: {
        tableNumber: number;
        userName?: string;
        items: any[];
    }): Promise<{
        id: string;
        createdAt: Date;
        status: string;
        tableNumber: number;
        userName: string | null;
        items: import("@prisma/client/runtime/library").JsonValue;
        totalPrice: number;
    }>;
    getOrders(): Promise<{
        id: string;
        createdAt: Date;
        status: string;
        tableNumber: number;
        userName: string | null;
        items: import("@prisma/client/runtime/library").JsonValue;
        totalPrice: number;
    }[]>;
    getCompletedOrders(): Promise<{
        id: string;
        createdAt: Date;
        status: string;
        tableNumber: number;
        userName: string | null;
        items: import("@prisma/client/runtime/library").JsonValue;
        totalPrice: number;
    }[]>;
    completeOrder(id: string): Promise<{
        id: string;
        createdAt: Date;
        status: string;
        tableNumber: number;
        userName: string | null;
        items: import("@prisma/client/runtime/library").JsonValue;
        totalPrice: number;
    }>;
    deleteOrder(id: string): Promise<{
        id: string;
        createdAt: Date;
        status: string;
        tableNumber: number;
        userName: string | null;
        items: import("@prisma/client/runtime/library").JsonValue;
        totalPrice: number;
    }>;
    getOrdersByTable(tableNumber: number): Promise<{
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
