import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class OrdersService {
    constructor(private prisma: PrismaService) { }

    async createOrder(data: { tableNumber: number; items: any[] }) {
        return this.prisma.order.create({
            data: {
                tableNumber: data.tableNumber,
                items: data.items,
                status: 'PENDING',
            },
        });
    }

    async getOrders() {
        return this.prisma.order.findMany({
            orderBy: { createdAt: 'desc' },
        });
    }

    async completeOrder(id: string) {
        return this.prisma.order.delete({
            where: { id },
        });
    }

    async deleteOrder(id: string) {
        return this.prisma.order.delete({
            where: { id }
        });
    }
}
