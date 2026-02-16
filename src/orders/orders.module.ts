import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersGateway } from './orders.gateway';
import { OrdersController } from './orders.controller';
import { PrismaService } from '../prisma.service';

@Module({
    controllers: [OrdersController],
    providers: [OrdersService, OrdersGateway, PrismaService],
    exports: [OrdersService],
})
export class OrdersModule { }
