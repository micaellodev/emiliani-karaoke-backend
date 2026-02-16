import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { calculateOrderPrice } from './pricing.utils';

@Injectable()
export class OrdersService {
    constructor(private prisma: PrismaService) { }

    async createOrder(data: { tableNumber: number; userName?: string; items: any[] }) {
        const totalPrice = calculateOrderPrice(data.items);

        return this.prisma.order.create({
            data: {
                tableNumber: data.tableNumber,
                userName: data.userName,
                items: data.items,
                totalPrice: totalPrice,
                status: 'PENDING',
            } as any, // Temporary workaround for Prisma type generation issue
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

    async completeOrder(id: string) {
        return this.prisma.order.update({
            where: { id },
            data: { status: 'COMPLETED' },
        });
    }

    async deleteOrder(id: string) {
        return this.prisma.order.delete({
            where: { id }
        });
    }

    async getOrdersByTable(tableNumber: number) {
        const orders = await this.prisma.order.findMany({
            where: {
                tableNumber: tableNumber,
                status: 'PENDING'
            },
            orderBy: { createdAt: 'desc' },
        });

        // Aggregate items across all orders
        const itemsMap = new Map<string, number>();
        let totalPrice = 0;

        for (const order of orders) {
            totalPrice += order.totalPrice || 0;

            if (Array.isArray(order.items)) {
                for (const item of order.items as any[]) {
                    const currentQty = itemsMap.get(item.name) || 0;
                    itemsMap.set(item.name, currentQty + item.quantity);
                }
            }
        }

        // Convert map to array
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
}
