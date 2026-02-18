"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var PrinterService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrinterService = void 0;
const common_1 = require("@nestjs/common");
const PDFDocument = require("pdfkit");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
let PrinterService = PrinterService_1 = class PrinterService {
    constructor() {
        this.logger = new common_1.Logger(PrinterService_1.name);
        this.receiptsDir = path.join(process.cwd(), 'receipts');
        this.ensureReceiptsDir();
    }
    ensureReceiptsDir() {
        if (!fs.existsSync(this.receiptsDir)) {
            fs.mkdirSync(this.receiptsDir, { recursive: true });
        }
    }
    async printOrder(order) {
        try {
            const fileName = `order_${order.tableNumber}_${Date.now()}.pdf`;
            const filePath = path.join(this.receiptsDir, fileName);
            const doc = new PDFDocument({
                size: [226, 600],
                margins: { top: 10, bottom: 10, left: 10, right: 10 }
            });
            const stream = fs.createWriteStream(filePath);
            doc.pipe(stream);
            const titleFontSize = 24;
            const subtitleFontSize = 14;
            const regularFontSize = 12;
            const smallFontSize = 10;
            doc.font('Helvetica-Bold').fontSize(titleFontSize).text('Barra', { align: 'center' });
            doc.moveDown(0.5);
            doc.font('Helvetica').fontSize(regularFontSize);
            doc.text(`Mesa: ${order.tableNumber}`);
            doc.text(`Cliente: ${order.userName || 'Sin nombre'}`);
            doc.text(`Fecha: ${new Date().toLocaleDateString('es-ES')}`);
            doc.text(`Hora: ${new Date().toLocaleTimeString('es-ES')}`);
            doc.text(`Vendedor: ${order.workerName || 'App / QR'}`);
            doc.moveDown(0.5);
            doc.text('--------------------------------', { align: 'center' });
            doc.moveDown(0.5);
            order.items.forEach((item) => {
                const name = item.name.substring(0, 30);
                const qty = item.quantity.toString();
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
        }
        catch (error) {
            this.logger.error('Error generating PDF receipt', error);
        }
    }
    async printPreBill(tableNumber, data) {
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
        }
        catch (error) {
            this.logger.error('Error generating PDF pre-bill', error);
        }
    }
};
exports.PrinterService = PrinterService;
exports.PrinterService = PrinterService = PrinterService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], PrinterService);
//# sourceMappingURL=printer.service.js.map