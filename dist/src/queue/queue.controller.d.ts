import { QueueService } from './queue.service';
import { OrdersService } from '../orders/orders.service';
import { EventsGateway } from '../gateway/events.gateway';
export declare class QueueController {
    private queueService;
    private eventsGateway;
    private ordersService;
    constructor(queueService: QueueService, eventsGateway: EventsGateway, ordersService: OrdersService);
    requestSong(body: {
        youtubeId: string;
        title: string;
        channelTitle: string;
        duration: string;
        requestedByTable: number;
        requestedBy?: string;
        comments?: string;
    }): Promise<{
        order: number;
        id: string;
        status: import(".prisma/client").$Enums.QueueStatus;
        createdAt: Date;
        youtubeId: string;
        title: string;
        channelTitle: string;
        duration: string;
        requestedByTable: number;
        requestedBy: string | null;
        comments: string | null;
        playedAt: Date | null;
    }>;
    addSongDirectly(body: {
        youtubeId: string;
        title: string;
        channelTitle: string;
        duration: string;
    }, req: any): Promise<{
        order: number;
        id: string;
        status: import(".prisma/client").$Enums.QueueStatus;
        createdAt: Date;
        youtubeId: string;
        title: string;
        channelTitle: string;
        duration: string;
        requestedByTable: number;
        requestedBy: string | null;
        comments: string | null;
        playedAt: Date | null;
    }>;
    approveSong(id: string): Promise<{
        order: number;
        id: string;
        status: import(".prisma/client").$Enums.QueueStatus;
        createdAt: Date;
        youtubeId: string;
        title: string;
        channelTitle: string;
        duration: string;
        requestedByTable: number;
        requestedBy: string | null;
        comments: string | null;
        playedAt: Date | null;
    }>;
    rejectSong(id: string): Promise<{
        order: number;
        id: string;
        status: import(".prisma/client").$Enums.QueueStatus;
        createdAt: Date;
        youtubeId: string;
        title: string;
        channelTitle: string;
        duration: string;
        requestedByTable: number;
        requestedBy: string | null;
        comments: string | null;
        playedAt: Date | null;
    }>;
    deleteSong(id: string): Promise<{
        order: number;
        id: string;
        status: import(".prisma/client").$Enums.QueueStatus;
        createdAt: Date;
        youtubeId: string;
        title: string;
        channelTitle: string;
        duration: string;
        requestedByTable: number;
        requestedBy: string | null;
        comments: string | null;
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
        order: number;
        id: string;
        status: import(".prisma/client").$Enums.QueueStatus;
        createdAt: Date;
        youtubeId: string;
        title: string;
        channelTitle: string;
        duration: string;
        requestedByTable: number;
        requestedBy: string | null;
        comments: string | null;
        playedAt: Date | null;
    }[]>;
    recover(): Promise<{
        order: number;
        id: string;
        status: import(".prisma/client").$Enums.QueueStatus;
        createdAt: Date;
        youtubeId: string;
        title: string;
        channelTitle: string;
        duration: string;
        requestedByTable: number;
        requestedBy: string | null;
        comments: string | null;
        playedAt: Date | null;
    }>;
    playSong(id: string): Promise<{
        order: number;
        id: string;
        status: import(".prisma/client").$Enums.QueueStatus;
        createdAt: Date;
        youtubeId: string;
        title: string;
        channelTitle: string;
        duration: string;
        requestedByTable: number;
        requestedBy: string | null;
        comments: string | null;
        playedAt: Date | null;
    }>;
    completeSong(body: {
        currentId: string;
    }): Promise<{
        nextSong: {
            order: number;
            id: string;
            status: import(".prisma/client").$Enums.QueueStatus;
            createdAt: Date;
            youtubeId: string;
            title: string;
            channelTitle: string;
            duration: string;
            requestedByTable: number;
            requestedBy: string | null;
            comments: string | null;
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
        tableNumber: number;
        userName: string;
        createdAt: Date;
    }>;
    getTableSession(id: string): Promise<{
        id: number;
        tableNumber: number;
        userName: string;
        createdAt: Date;
    } | {
        userName: any;
    }>;
    getTables(): Promise<{
        id: number;
        tableNumber: number;
        userName: string;
        createdAt: Date;
    }[]>;
    getTimerEnabled(): Promise<{
        enabled: boolean;
    }>;
    setTimerEnabled(body: {
        enabled: boolean;
    }): Promise<{
        enabled: boolean;
    }>;
}
