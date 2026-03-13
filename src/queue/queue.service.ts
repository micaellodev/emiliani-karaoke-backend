import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { QueueStatus } from '@prisma/client';

import { EventsGateway } from '../gateway/events.gateway';

@Injectable()
export class QueueService {
    private timerEnabled = true;
    private autoplayEnabled = false;

    constructor(
        private prisma: PrismaService,
        private eventsGateway: EventsGateway
    ) { }

    getTimerEnabled() {
        return this.timerEnabled;
    }

    setTimerEnabled(enabled: boolean) {
        this.timerEnabled = enabled;
        return this.timerEnabled;
    }

    getAutoplayEnabled() {
        return this.autoplayEnabled;
    }

    setAutoplayEnabled(enabled: boolean) {
        this.autoplayEnabled = enabled;
        return this.autoplayEnabled;
    }

    async requestSong(data: {
        youtubeId: string;
        title: string;
        channelTitle: string;
        duration: string;
        requestedByTable: number;
        requestedBy?: string;
        comments?: string;
    }) {
        // Get max order in PENDING
        const maxOrder = await this.prisma.queueItem.findFirst({
            where: { status: 'PENDING' },
            orderBy: { order: 'desc' },
            select: { order: true },
        });

        const nextOrder = (maxOrder?.order ?? 0) + 1;

        return this.prisma.queueItem.create({
            data: {
                ...data,
                status: 'PENDING',
                order: nextOrder,
            },
        });
    }

    async addDirect(data: {
        youtubeId: string;
        title: string;
        channelTitle: string;
        duration: string;
        addedBy: string;
    }) {
        // Get max order in APPROVED
        const maxOrder = await this.prisma.queueItem.findFirst({
            where: { status: 'APPROVED' },
            orderBy: { order: 'desc' },
            select: { order: true },
        });

        const nextOrder = (maxOrder?.order ?? 0) + 1;

        return this.prisma.queueItem.create({
            data: {
                youtubeId: data.youtubeId,
                title: data.title,
                channelTitle: data.channelTitle,
                duration: data.duration,
                requestedByTable: 0, // Admin/System
                requestedBy: data.addedBy,
                status: 'APPROVED',
                order: nextOrder,
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
        // We want: PLAYING (at the very top) -> APPROVED (in order) -> PENDING (in order)
        const products = await this.prisma.queueItem.findMany({
            where: {
                status: {
                    in: ['PENDING', 'APPROVED', 'PLAYING'],
                },
            },
        });

        // Custom sort to ensure PLAYING is always first, then APPROVED, then PENDING
        const statusPriority = {
            'PLAYING': 0,
            'APPROVED': 1,
            'PENDING': 2,
            'FINISHED': 3,
            'REJECTED': 4
        };

        const queue = products.sort((a, b) => {
            if (statusPriority[a.status] !== statusPriority[b.status]) {
                return statusPriority[a.status] - statusPriority[b.status];
            }
            return a.order - b.order;
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
        // Mark any OTHER currently playing song as finished
        await this.prisma.queueItem.updateMany({
            where: {
                status: 'PLAYING',
                id: { not: id }
            },
            data: { status: 'FINISHED', playedAt: new Date() },
        });

        // Mark this song as playing
        return this.prisma.queueItem.update({
            where: { id },
            data: { status: 'PLAYING' },
        });
    }

    async completeSong(id: string) {
        // Mark current song as finished (only if it was actually playing to avoid accidental double-completes)
        await this.prisma.queueItem.updateMany({
            where: { id, status: 'PLAYING' },
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

        // Check if session already exists
        const existingSession = await this.prisma.tableSession.findUnique({
            where: { tableNumber },
        });

        if (existingSession) {
            console.log(`[DEBUG] Session already exists for table ${tableNumber}:`, existingSession);
            return existingSession;
        }

        console.log(`[DEBUG] Creating new session...`);
        const session = await this.prisma.tableSession.create({
            data: {
                tableNumber,
                userName,
            },
        });

        // Log table opening
        await this.prisma.tableLog.create({
            data: {
                tableNumber,
                customerName: userName,
                openedBy: 'Customer', // Default to Customer for now
            },
        });

        console.log(`[DEBUG] Session created:`, session);

        this.eventsGateway.emitTablesUpdate();
        return session;
    }

    async getTableSession(tableNumber: number) {
        return this.prisma.tableSession.findUnique({
            where: { tableNumber },
        });
    }

    async getActiveTables() {
        return this.prisma.tableSession.findMany();
    }

    async resetTable(tableNumber: number, closedByUsername?: string) {
        // Log table closing
        try {
            // Find active log (where closedAt is null) for this table
            // We order by openedAt desc to get the latest one
            const activeLog = await this.prisma.tableLog.findFirst({
                where: {
                    tableNumber,
                    closedAt: null,
                },
                orderBy: {
                    openedAt: 'desc',
                },
            });

            if (activeLog) {
                await this.prisma.tableLog.update({
                    where: { id: activeLog.id },
                    data: {
                        closedAt: new Date(),
                        closedBy: closedByUsername || 'System',
                    },
                });
            }
        } catch (e) {
            console.error('Error logging table close:', e);
        }

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

    async getTableLogs() {
        return this.prisma.tableLog.findMany({
            orderBy: {
                openedAt: 'desc',
            },
            take: 50, // Limit to last 50 entries
        });
    }
}
