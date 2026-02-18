import { Injectable, Logger } from '@nestjs/common';
import PDFDocument = require('pdfkit');
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class PrinterService {
    private logger = new Logger(PrinterService.name);
    private receiptsDir = path.join(process.cwd(), 'receipts');

    constructor() {
        this.ensureReceiptsDir();
    }

    private ensureReceiptsDir() {
        if (!fs.existsSync(this.receiptsDir)) {
            fs.mkdirSync(this.receiptsDir, { recursive: true });
        }
    }

    public async printOrder(order: { tableNumber: number; userName?: string; workerName?: string; items: any[] }) {
        try {
            const fileName = `order_${order.tableNumber}_${Date.now()}.pdf`;
            const filePath = path.join(this.receiptsDir, fileName);

            // Create a document with small width to simulate receipt paper
            const doc = new PDFDocument({
                size: [226, 600],
                margins: { top: 10, bottom: 10, left: 10, right: 10 }
            });

            const stream = fs.createWriteStream(filePath);
            doc.pipe(stream);

            // Styling constants - Larger for better readability
            const titleFontSize = 24;
            const subtitleFontSize = 14;
            const regularFontSize = 12; // Increased from 10
            const smallFontSize = 10;

            // Header
            doc.font('Helvetica-Bold').fontSize(titleFontSize).text('Barra', { align: 'center' }); // Changed from Caja
            doc.moveDown(0.5);

            doc.font('Helvetica').fontSize(regularFontSize);
            doc.text(`Mesa: ${order.tableNumber}`);
            doc.text(`Cliente: ${order.userName || 'Sin nombre'}`);
            doc.text(`Fecha: ${new Date().toLocaleDateString('es-ES')}`);
            doc.text(`Hora: ${new Date().toLocaleTimeString('es-ES')}`);
            doc.text(`Vendedor: ${order.workerName || 'App / QR'}`); // Changed from Tomó el pedido
            doc.moveDown(0.5);
            doc.text('--------------------------------', { align: 'center' });
            doc.moveDown(0.5);

            // Items
            order.items.forEach((item) => {
                const name = item.name.substring(0, 30);
                const qty = item.quantity.toString();
                // Bold and larger for items
                doc.font('Helvetica-Bold').fontSize(subtitleFontSize).text(`${qty} x ${name}`);
                if (item.notes) {
                    doc.font('Helvetica').fontSize(smallFontSize).text(`   Nota: ${item.notes}`);
                }
                doc.moveDown(0.5);
            });

            doc.moveDown();
            doc.font('Helvetica').fontSize(regularFontSize).text('--------------------------------', { align: 'center' });

            doc.end();

            this.logger.log(`Order receipt generated: ${filePath}`);
        } catch (error) {
            this.logger.error('Error generating PDF receipt', error);
        }
    }

    public async printPreBill(tableNumber: number, data: { orders: any[]; aggregatedItems: any[]; totalPrice: number }) {
        try {
            const fileName = `prebill_table_${tableNumber}_${Date.now()}.pdf`;
            const filePath = path.join(this.receiptsDir, fileName);

            const doc = new PDFDocument({
                size: [226, 800],
                margins: { top: 10, bottom: 10, left: 10, right: 10 }
            });

            const stream = fs.createWriteStream(filePath);
            doc.pipe(stream);

            const titleFontSize = 20;
            const regularFontSize = 12;

            doc.font('Helvetica-Bold').fontSize(titleFontSize).text(`MESA ${tableNumber}`, { align: 'center' });
            doc.fontSize(14).text('PRE-CUENTA', { align: 'center' });
            doc.moveDown();

            doc.font('Helvetica').fontSize(regularFontSize);
            doc.text(`Fecha: ${new Date().toLocaleString('es-ES')}`);
            doc.moveDown();
            doc.text('--------------------------------', { align: 'center' });
            doc.moveDown();

            // Items
            data.aggregatedItems.forEach((item) => {
                const name = item.name.substring(0, 25);
                const qty = item.quantity.toString().padStart(2, ' ');
                doc.text(`${qty} x ${name}`);
                doc.moveDown(0.5);
            });

            doc.moveDown();
            doc.text('--------------------------------', { align: 'center' });
            doc.moveDown();

            doc.font('Helvetica-Bold').fontSize(16).text(`TOTAL: S/. ${data.totalPrice.toFixed(2)}`, { align: 'right' });

            doc.moveDown();
            doc.fontSize(10).text('********************************', { align: 'center' });

            doc.end();

            this.logger.log(`Pre-bill receipt generated: ${filePath}`);
        } catch (error) {
            this.logger.error('Error generating PDF pre-bill', error);
        }
    }
}
