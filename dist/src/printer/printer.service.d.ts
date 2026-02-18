export declare class PrinterService {
    private logger;
    private receiptsDir;
    constructor();
    private ensureReceiptsDir;
    printOrder(order: {
        tableNumber: number;
        userName?: string;
        workerName?: string;
        items: any[];
    }): Promise<void>;
    printPreBill(tableNumber: number, data: {
        orders: any[];
        aggregatedItems: any[];
        totalPrice: number;
    }): Promise<void>;
}
