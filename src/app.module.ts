import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthModule } from './auth/auth.module';
import { QueueModule } from './queue/queue.module';
import { YouTubeModule } from './youtube/youtube.module';
import { EventsGateway } from './gateway/events.gateway';
import { PrismaService } from './prisma.service';
import { UsersModule } from './users/users.module';
import { OrdersModule } from './orders/orders.module';
import { SchedulerService } from './scheduler/scheduler.service';

@Module({
    imports: [
        ScheduleModule.forRoot(),
        AuthModule,
        QueueModule,
        YouTubeModule,
        UsersModule,
        OrdersModule
    ],
    providers: [EventsGateway, PrismaService, SchedulerService],
})
export class AppModule { }
