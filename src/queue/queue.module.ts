import { Module } from '@nestjs/common';
import { QueueService } from './queue.service';
import { QueueController } from './queue.controller';
import { PrismaService } from '../prisma.service';
import { EventsGateway } from '../gateway/events.gateway';

@Module({
    controllers: [QueueController],
    providers: [QueueService, PrismaService, EventsGateway],
    exports: [QueueService],
})
export class QueueModule { }
