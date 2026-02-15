import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { QueueModule } from './queue/queue.module';
import { YouTubeModule } from './youtube/youtube.module';
import { EventsGateway } from './gateway/events.gateway';
import { PrismaService } from './prisma.service';
import { UsersModule } from './users/users.module';
import { OrdersModule } from './orders/orders.module';

@Module({
    imports: [AuthModule, QueueModule, YouTubeModule, UsersModule, OrdersModule],
    providers: [EventsGateway, PrismaService],
})
export class AppModule { }
