import { QueueService } from './queue.service';
import { EventsGateway } from '../gateway/events.gateway';
export declare class QueueController {
    private queueService;
    private eventsGateway;
    constructor(queueService: QueueService, eventsGateway: EventsGateway);
    requestSong(body: {
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
    addSongDirectly(body: {
        youtubeId: string;
        title: string;
        channelTitle: string;
        duration: string;
    }, req: any): Promise<{
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
    pausePlayback(): Promise<{
        success: boolean;
    }>;
    resumePlayback(): Promise<{
        success: boolean;
    }>;
    resetTable(id: string): Promise<{
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
    completeSong(body: {
        currentId: string;
    }): Promise<{
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
    reorderQueue(body: {
        items: {
            id: string;
            order: number;
        }[];
    }): Promise<{
        success: boolean;
    }>;
    joinTable(body: {
        tableNumber: number;
        userName: string;
    }): Promise<{
        id: number;
        createdAt: Date;
        tableNumber: number;
        userName: string;
    }>;
    getTableSession(id: string): Promise<{
        id: number;
        createdAt: Date;
        tableNumber: number;
        userName: string;
    } | {
        userName: any;
    }>;
    getTables(): Promise<{
        id: number;
        createdAt: Date;
        tableNumber: number;
        userName: string;
    }[]>;
}
