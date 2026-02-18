import { PrismaService } from '../prisma.service';
import { PrinterService } from '../printer/printer.service';
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
        createdAt: Date;
        status: string;
        tableNumber: number;
        userName: string | null;
        workerName: string | null;
        items: import("@prisma/client/runtime/library").JsonValue;
        totalPrice: number;
    }[]>;
    getTopBeverages(startDate?: Date, endDate?: Date): Promise<{
        name: string;
        count: number;
    }[]>;
    createOrder(data: {
        tableNumber: number;
        userName?: string;
        workerName?: string;
        items: any[];
    }): Promise<{
        id: string;
        createdAt: Date;
        status: string;
        tableNumber: number;
        userName: string | null;
        workerName: string | null;
        items: import("@prisma/client/runtime/library").JsonValue;
        totalPrice: number;
    }>;
    getOrders(): Promise<{
        id: string;
        createdAt: Date;
        status: string;
        tableNumber: number;
        userName: string | null;
        workerName: string | null;
        items: import("@prisma/client/runtime/library").JsonValue;
        totalPrice: number;
    }[]>;
    closeTable(tableNumber: number): Promise<import(".prisma/client").Prisma.BatchPayload>;
    getCompletedOrders(): Promise<{
        id: string;
        createdAt: Date;
        status: string;
        tableNumber: number;
        userName: string | null;
        workerName: string | null;
        items: import("@prisma/client/runtime/library").JsonValue;
        totalPrice: number;
    }[]>;
    completeOrder(id: string): Promise<{
        id: string;
        createdAt: Date;
        status: string;
        tableNumber: number;
        userName: string | null;
        workerName: string | null;
        items: import("@prisma/client/runtime/library").JsonValue;
        totalPrice: number;
    }>;
    deleteOrder(id: string): Promise<{
        id: string;
        createdAt: Date;
        status: string;
        tableNumber: number;
        userName: string | null;
        workerName: string | null;
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
            workerName: string | null;
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
