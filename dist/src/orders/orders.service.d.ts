import { PrismaService } from '../prisma.service';
import { PrinterService } from '../services/printer.service';
export declare class OrdersService {
    private prisma;
    private printerService;
    constructor(prisma: PrismaService, printerService: PrinterService);
    getSalesLog(filter: {
        startDate?: Date;
        endDate?: Date;
        tableNumber?: number;
        sellerName?: string;
    }): Promise<{
        id: string;
        tableNumber: number;
        userName: string | null;
        items: import("@prisma/client/runtime/library").JsonValue;
        totalPrice: number;
        status: string;
        createdAt: Date;
    }[]>;
    getTopBeverages(startDate?: Date, endDate?: Date): Promise<{
        name: string;
        count: number;
    }[]>;
    createOrder(data: {
        tableNumber: number;
        userName?: string;
        items: any[];
    }): Promise<{
        id: string;
        tableNumber: number;
        userName: string | null;
        items: import("@prisma/client/runtime/library").JsonValue;
        totalPrice: number;
        status: string;
        createdAt: Date;
    }>;
    getOrders(): Promise<{
        id: string;
        tableNumber: number;
        userName: string | null;
        items: import("@prisma/client/runtime/library").JsonValue;
        totalPrice: number;
        status: string;
        createdAt: Date;
    }[]>;
    closeTable(tableNumber: number): Promise<import(".prisma/client").Prisma.BatchPayload>;
    getCompletedOrders(): Promise<{
        id: string;
        tableNumber: number;
        userName: string | null;
        items: import("@prisma/client/runtime/library").JsonValue;
        totalPrice: number;
        status: string;
        createdAt: Date;
    }[]>;
    completeOrder(id: string): Promise<{
        id: string;
        tableNumber: number;
        userName: string | null;
        items: import("@prisma/client/runtime/library").JsonValue;
        totalPrice: number;
        status: string;
        createdAt: Date;
    }>;
    deleteOrder(id: string): Promise<{
        id: string;
        tableNumber: number;
        userName: string | null;
        items: import("@prisma/client/runtime/library").JsonValue;
        totalPrice: number;
        status: string;
        createdAt: Date;
    }>;
    getOrdersByTable(tableNumber: number): Promise<{
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
