import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersGateway } from './orders.gateway';
import { PrismaService } from '../prisma.service';

@Module({
    providers: [OrdersService, OrdersGateway, PrismaService],
})
export class OrdersModule { }
