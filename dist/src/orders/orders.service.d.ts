import { PrismaService } from '../prisma.service';
export declare class OrdersService {
    private prisma;
    constructor(prisma: PrismaService);
    createOrder(data: {
        tableNumber: number;
        items: any[];
    }): Promise<{
        id: string;
        tableNumber: number;
        items: import("@prisma/client/runtime/library").JsonValue;
        status: string;
        createdAt: Date;
    }>;
    getOrders(): Promise<{
        id: string;
        tableNumber: number;
        items: import("@prisma/client/runtime/library").JsonValue;
        status: string;
        createdAt: Date;
    }[]>;
    completeOrder(id: string): Promise<{
        id: string;
        tableNumber: number;
        items: import("@prisma/client/runtime/library").JsonValue;
        status: string;
        createdAt: Date;
    }>;
    deleteOrder(id: string): Promise<{
        id: string;
        tableNumber: number;
        items: import("@prisma/client/runtime/library").JsonValue;
        status: string;
        createdAt: Date;
    }>;
}
