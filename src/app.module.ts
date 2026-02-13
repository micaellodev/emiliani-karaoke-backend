import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { QueueModule } from './queue/queue.module';
import { YouTubeModule } from './youtube/youtube.module';
import { EventsGateway } from './gateway/events.gateway';
import { PrismaService } from './prisma.service';

import { UsersModule } from './users/users.module';

@Module({
    imports: [AuthModule, QueueModule, YouTubeModule, UsersModule],
    providers: [EventsGateway, PrismaService],
})
export class AppModule { }
