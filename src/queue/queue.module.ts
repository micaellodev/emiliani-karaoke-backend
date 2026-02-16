import { Module } from '@nestjs/common';
import { QueueService } from './queue.service';
import { QueueController } from './queue.controller';
import { PrismaService } from '../prisma.service';
import { EventsGateway } from '../gateway/events.gateway';

import { OrdersModule } from '../orders/orders.module';

@Module({
    imports: [OrdersModule],
    controllers: [QueueController],
    providers: [QueueService, PrismaService, EventsGateway],
    exports: [QueueService],
})
export class QueueModule { }
