import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersGateway } from './orders.gateway';
import { OrdersController } from './orders.controller';
import { PrismaService } from '../prisma.service';
import { PrinterService } from '../services/printer.service';

@Module({
    controllers: [OrdersController],
    providers: [OrdersService, OrdersGateway, PrismaService, PrinterService],
    exports: [OrdersService],
})
export class OrdersModule { }
