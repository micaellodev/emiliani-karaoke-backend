"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
const pricing_utils_1 = require("./pricing.utils");
let OrdersService = class OrdersService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createOrder(data) {
        const totalPrice = (0, pricing_utils_1.calculateOrderPrice)(data.items);
        return this.prisma.order.create({
            data: {
                tableNumber: data.tableNumber,
                userName: data.userName,
                items: data.items,
                totalPrice: totalPrice,
                status: 'PENDING',
            },
        });
    }
    async getOrders() {
        return this.prisma.order.findMany({
            where: { status: 'PENDING' },
            orderBy: { createdAt: 'desc' },
        });
    }
    async getCompletedOrders() {
        return this.prisma.order.findMany({
            where: { status: 'COMPLETED' },
            orderBy: { createdAt: 'desc' },
        });
    }
    async completeOrder(id) {
        return this.prisma.order.update({
            where: { id },
            data: { status: 'COMPLETED' },
        });
    }
    async deleteOrder(id) {
        return this.prisma.order.delete({
            where: { id }
        });
    }
    async getOrdersByTable(tableNumber) {
        const orders = await this.prisma.order.findMany({
            where: {
                tableNumber: tableNumber,
                status: 'PENDING'
            },
            orderBy: { createdAt: 'desc' },
        });
        const itemsMap = new Map();
        let totalPrice = 0;
        for (const order of orders) {
            totalPrice += order.totalPrice || 0;
            if (Array.isArray(order.items)) {
                for (const item of order.items) {
                    const currentQty = itemsMap.get(item.name) || 0;
                    itemsMap.set(item.name, currentQty + item.quantity);
                }
            }
        }
        const aggregatedItems = Array.from(itemsMap.entries()).map(([name, quantity]) => ({
            name,
            quantity
        }));
        return {
            tableNumber,
            orders,
            aggregatedItems,
            totalPrice,
            orderCount: orders.length
        };
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], OrdersService);
//# sourceMappingURL=orders.service.js.map