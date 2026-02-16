import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { calculateOrderPrice } from './pricing.utils';

@Injectable()
export class OrdersService {
    constructor(private prisma: PrismaService) { }

    async getSalesLog(filter: { startDate?: Date; endDate?: Date; tableNumber?: number; sellerName?: string }) {
        const where: any = {
            status: 'COMPLETED', // Only completed orders count as sales
        };

        if (filter.startDate) {
            where.createdAt = { ...where.createdAt, gte: filter.startDate };
        }
        if (filter.endDate) {
            where.createdAt = { ...where.createdAt, lte: filter.endDate };
        }
        if (filter.tableNumber) {
            where.tableNumber = filter.tableNumber;
        }
        if (filter.sellerName) {
            where.userName = { contains: filter.sellerName, mode: 'insensitive' };
        }

        return this.prisma.order.findMany({
            where,
            orderBy: { createdAt: 'desc' },
        });
    }

    async getTopBeverages(startDate?: Date, endDate?: Date) {
        const where: any = {
            status: 'COMPLETED',
        };

        if (startDate) {
            where.createdAt = { ...where.createdAt, gte: startDate };
        }
        if (endDate) {
            where.createdAt = { ...where.createdAt, lte: endDate };
        }

        const orders = await this.prisma.order.findMany({
            where,
            select: { items: true },
        });

        const itemCounts = new Map<string, number>();

        for (const order of orders) {
            if (Array.isArray(order.items)) {
                for (const item of order.items as any[]) {
                    // Normalize name to avoid case sensitivity issues
                    const name = item.name.trim(); // You might want to remove 'trim' or handle it differently if needed
                    const quantity = item.quantity || 0;
                    itemCounts.set(name, (itemCounts.get(name) || 0) + quantity);
                }
            }
        }

        // Convert to array and sort
        return Array.from(itemCounts.entries())
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);
    }

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

    async closeTable(tableNumber: number) {
        return this.prisma.order.updateMany({
            where: {
                tableNumber: tableNumber,
                status: {
                    in: ['PENDING', 'COMPLETED']
                }
            },
            data: {
                status: 'CLOSED'
            }
        });
    }

    async getCompletedOrders() {
        return this.prisma.order.findMany({
            where: {
                status: {
                    in: ['COMPLETED', 'CLOSED']
                }
            },
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
                status: {
                    in: ['PENDING', 'COMPLETED']
                }
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
