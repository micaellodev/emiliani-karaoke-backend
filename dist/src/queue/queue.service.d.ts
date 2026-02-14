import { PrismaService } from '../prisma.service';
import { EventsGateway } from '../gateway/events.gateway';
export declare class QueueService {
    private prisma;
    private eventsGateway;
    constructor(prisma: PrismaService, eventsGateway: EventsGateway);
    requestSong(data: {
        youtubeId: string;
        title: string;
        channelTitle: string;
        duration: string;
        requestedByTable: number;
        requestedBy?: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        youtubeId: string;
        title: string;
        channelTitle: string;
        duration: string;
        requestedByTable: number;
        requestedBy: string | null;
        status: import(".prisma/client").$Enums.QueueStatus;
        order: number;
        playedAt: Date | null;
    }>;
    addDirect(data: {
        youtubeId: string;
        title: string;
        channelTitle: string;
        duration: string;
        addedBy: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        youtubeId: string;
        title: string;
        channelTitle: string;
        duration: string;
        requestedByTable: number;
        requestedBy: string | null;
        status: import(".prisma/client").$Enums.QueueStatus;
        order: number;
        playedAt: Date | null;
    }>;
    approveSong(id: string): Promise<{
        id: string;
        createdAt: Date;
        youtubeId: string;
        title: string;
        channelTitle: string;
        duration: string;
        requestedByTable: number;
        requestedBy: string | null;
        status: import(".prisma/client").$Enums.QueueStatus;
        order: number;
        playedAt: Date | null;
    }>;
    rejectSong(id: string): Promise<{
        id: string;
        createdAt: Date;
        youtubeId: string;
        title: string;
        channelTitle: string;
        duration: string;
        requestedByTable: number;
        requestedBy: string | null;
        status: import(".prisma/client").$Enums.QueueStatus;
        order: number;
        playedAt: Date | null;
    }>;
    deleteSong(id: string): Promise<{
        id: string;
        createdAt: Date;
        youtubeId: string;
        title: string;
        channelTitle: string;
        duration: string;
        requestedByTable: number;
        requestedBy: string | null;
        status: import(".prisma/client").$Enums.QueueStatus;
        order: number;
        playedAt: Date | null;
    }>;
    getQueue(): Promise<{
        thumbnail: string;
        id: string;
        createdAt: Date;
        youtubeId: string;
        title: string;
        channelTitle: string;
        duration: string;
        requestedByTable: number;
        requestedBy: string | null;
        status: import(".prisma/client").$Enums.QueueStatus;
        order: number;
        playedAt: Date | null;
    }[]>;
    recover(): Promise<{
        id: string;
        createdAt: Date;
        youtubeId: string;
        title: string;
        channelTitle: string;
        duration: string;
        requestedByTable: number;
        requestedBy: string | null;
        status: import(".prisma/client").$Enums.QueueStatus;
        order: number;
        playedAt: Date | null;
    }>;
    playSong(id: string): Promise<{
        id: string;
        createdAt: Date;
        youtubeId: string;
        title: string;
        channelTitle: string;
        duration: string;
        requestedByTable: number;
        requestedBy: string | null;
        status: import(".prisma/client").$Enums.QueueStatus;
        order: number;
        playedAt: Date | null;
    }>;
    completeSong(id: string): Promise<{
        nextSong: {
            id: string;
            createdAt: Date;
            youtubeId: string;
            title: string;
            channelTitle: string;
            duration: string;
            requestedByTable: number;
            requestedBy: string | null;
            status: import(".prisma/client").$Enums.QueueStatus;
            order: number;
            playedAt: Date | null;
        };
    }>;
    reorderQueue(items: {
        id: string;
        order: number;
    }[]): Promise<{
        success: boolean;
    }>;
    getStats(): Promise<{
        totalRequests: number;
        pendingRequests: number;
        playedSongs: number;
        topSongs: {
            id: string;
            title: string;
            channelTitle: string;
            duration: string;
            thumbnail: string;
            count: number;
        }[];
    }>;
    joinTable(tableNumber: number, userName: string): Promise<{
        id: number;
        createdAt: Date;
        tableNumber: number;
        userName: string;
    }>;
    getTableSession(tableNumber: number): Promise<{
        id: number;
        createdAt: Date;
        tableNumber: number;
        userName: string;
    }>;
    getActiveTables(): Promise<{
        id: number;
        createdAt: Date;
        tableNumber: number;
        userName: string;
    }[]>;
    resetTable(tableNumber: number): Promise<{
        success: boolean;
    }>;
}
