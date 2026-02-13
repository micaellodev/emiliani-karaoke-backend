import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { QueueStatus } from '@prisma/client';

import { EventsGateway } from '../gateway/events.gateway';

@Injectable()
export class QueueService {
    constructor(
        private prisma: PrismaService,
        private eventsGateway: EventsGateway
    ) { }

    async requestSong(data: {
        youtubeId: string;
        title: string;
        channelTitle: string;
        duration: string;
        requestedByTable: number;
        requestedBy?: string;
    }) {
        return this.prisma.queueItem.create({
            data: {
                ...data,
                status: 'PENDING',
                order: 0,
            },
        });
    }

    async approveSong(id: string) {
        // Get the highest order number in approved queue
        const maxOrder = await this.prisma.queueItem.findFirst({
            where: { status: 'APPROVED' },
            orderBy: { order: 'desc' },
            select: { order: true },
        });

        const nextOrder = (maxOrder?.order ?? 0) + 1;

        return this.prisma.queueItem.update({
            where: { id },
            data: {
                status: 'APPROVED',
                order: nextOrder,
            },
        });
    }

    async rejectSong(id: string) {
        return this.prisma.queueItem.update({
            where: { id },
            data: { status: 'REJECTED' },
        });
    }

    async deleteSong(id: string) {
        return this.prisma.queueItem.delete({
            where: { id },
        });
    }

    async getQueue() {
        const queue = await this.prisma.queueItem.findMany({
            where: {
                status: {
                    in: ['PENDING', 'APPROVED', 'PLAYING'],
                },
            },
            orderBy: [
                { status: 'asc' }, // PENDING first, then APPROVED
                { order: 'asc' },
            ],
        });

        return queue.map((item) => ({
            ...item,
            thumbnail: `https://img.youtube.com/vi/${item.youtubeId}/mqdefault.jpg`,
        }));
    }

    // CRITICAL: Auto-recovery endpoint for power loss
    async recover() {
        // First check if there's a song currently playing
        const playingSong = await this.prisma.queueItem.findFirst({
            where: { status: 'PLAYING' },
        });

        if (playingSong) {
            return playingSong;
        }

        // If no playing song, get the next approved song
        const nextSong = await this.prisma.queueItem.findFirst({
            where: { status: 'APPROVED' },
            orderBy: { order: 'asc' },
        });

        return nextSong || null;
    }

    async playSong(id: string) {
        // Mark any currently playing song as finished
        await this.prisma.queueItem.updateMany({
            where: { status: 'PLAYING' },
            data: { status: 'FINISHED', playedAt: new Date() },
        });

        // Mark this song as playing
        return this.prisma.queueItem.update({
            where: { id },
            data: { status: 'PLAYING' },
        });
    }

    async completeSong(id: string) {
        // Mark current song as finished
        await this.prisma.queueItem.update({
            where: { id },
            data: {
                status: 'FINISHED',
                playedAt: new Date(),
            },
        });

        // Get next approved song
        const nextSong = await this.prisma.queueItem.findFirst({
            where: { status: 'APPROVED' },
            orderBy: { order: 'asc' },
        });

        return { nextSong };
    }

    async reorderQueue(items: { id: string; order: number }[]) {
        // Update order for each item
        const updates = items.map((item) =>
            this.prisma.queueItem.update({
                where: { id: item.id },
                data: { order: item.order },
            }),
        );

        await Promise.all(updates);
        return { success: true };
    }
    async getStats() {
        const totalRequests = await this.prisma.queueItem.count();
        const pendingRequests = await this.prisma.queueItem.count({ where: { status: 'PENDING' } });
        const playedSongs = await this.prisma.queueItem.count({ where: { status: 'FINISHED' } });

        const topSongs = await this.prisma.queueItem.groupBy({
            by: ['title', 'youtubeId', 'channelTitle', 'duration'],
            _count: {
                youtubeId: true,
            },
            orderBy: {
                _count: {
                    youtubeId: 'desc',
                },
            },
            take: 10,
        });

        return {
            totalRequests,
            pendingRequests,
            playedSongs,
            topSongs: topSongs.map((s) => ({
                id: s.youtubeId, // Mapping youtubeId to id for frontend compatibility
                title: s.title,
                channelTitle: s.channelTitle,
                duration: s.duration,
                thumbnail: `https://img.youtube.com/vi/${s.youtubeId}/mqdefault.jpg`,
                count: s._count.youtubeId,
            })),
        };
    }

    // Table Session Management

    async joinTable(tableNumber: number, userName: string) {
        console.log(`[DEBUG] joinTable called with table=${tableNumber}, user=${userName}`);
        // Remove existing session for this table if any (or update it? logic says one user per table)
        // ...

        // Actually, we want to update if exists or create.
        // But for simplifies, let's just upsert or delete old.
        // My implementation:
        // Delete old session for this table
        await this.prisma.tableSession.deleteMany({
            where: { tableNumber },
        });

        console.log(`[DEBUG] Creating session...`);
        const session = await this.prisma.tableSession.create({
            data: {
                tableNumber,
                userName,
            },
        });
        console.log(`[DEBUG] Session created:`, session);

        this.eventsGateway.emitTablesUpdate();
        return session;
    }

    async getActiveTables() {
        return this.prisma.tableSession.findMany();
    }

    async resetTable(tableNumber: number) {
        // Delete session
        try {
            await this.prisma.tableSession.delete({
                where: { tableNumber },
            });
        } catch (e) {
            // Ignore if already deleted
        }
        this.eventsGateway.emitTablesUpdate();
        return { success: true };
    }
}
