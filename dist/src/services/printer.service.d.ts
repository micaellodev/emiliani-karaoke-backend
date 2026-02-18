import { Order } from '@prisma/client';
export declare class PrinterService {
    private readonly logger;
    private printerHost;
    private printerPort;
    printOrder(order: Order, items: any[]): Promise<void>;
    private formatReceipt;
    private formatReceiptText;
    private sendToPrinter;
}
