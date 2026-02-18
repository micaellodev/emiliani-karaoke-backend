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
        id: string;
        youtubeId: string;
        title: string;
        channelTitle: string;
        duration: string;
        requestedByTable: number;
        requestedBy: string | null;
        comments: string | null;
        status: import(".prisma/client").$Enums.QueueStatus;
        order: number;
        createdAt: Date;
        playedAt: Date | null;
    }>;
    addSongDirectly(body: {
        youtubeId: string;
        title: string;
        channelTitle: string;
        duration: string;
    }, req: any): Promise<{
        id: string;
        youtubeId: string;
        title: string;
        channelTitle: string;
        duration: string;
        requestedByTable: number;
        requestedBy: string | null;
        comments: string | null;
        status: import(".prisma/client").$Enums.QueueStatus;
        order: number;
        createdAt: Date;
        playedAt: Date | null;
    }>;
    approveSong(id: string): Promise<{
        id: string;
        youtubeId: string;
        title: string;
        channelTitle: string;
        duration: string;
        requestedByTable: number;
        requestedBy: string | null;
        comments: string | null;
        status: import(".prisma/client").$Enums.QueueStatus;
        order: number;
        createdAt: Date;
        playedAt: Date | null;
    }>;
    rejectSong(id: string): Promise<{
        id: string;
        youtubeId: string;
        title: string;
        channelTitle: string;
        duration: string;
        requestedByTable: number;
        requestedBy: string | null;
        comments: string | null;
        status: import(".prisma/client").$Enums.QueueStatus;
        order: number;
        createdAt: Date;
        playedAt: Date | null;
    }>;
    deleteSong(id: string): Promise<{
        id: string;
        youtubeId: string;
        title: string;
        channelTitle: string;
        duration: string;
        requestedByTable: number;
        requestedBy: string | null;
        comments: string | null;
        status: import(".prisma/client").$Enums.QueueStatus;
        order: number;
        createdAt: Date;
        playedAt: Date | null;
    }>;
    pausePlayback(): Promise<{
        success: boolean;
    }>;
    resumePlayback(): Promise<{
        success: boolean;
    }>;
    resetTable(id: string, req: any): Promise<{
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
    getTableLogs(): Promise<{
        id: number;
        tableNumber: number;
        customerName: string;
        openedAt: Date;
        closedAt: Date | null;
        openedBy: string;
        closedBy: string | null;
        totalTotal: number | null;
    }[]>;
    getQueue(): Promise<{
        thumbnail: string;
        id: string;
        youtubeId: string;
        title: string;
        channelTitle: string;
        duration: string;
        requestedByTable: number;
        requestedBy: string | null;
        comments: string | null;
        status: import(".prisma/client").$Enums.QueueStatus;
        order: number;
        createdAt: Date;
        playedAt: Date | null;
    }[]>;
    recover(): Promise<{
        id: string;
        youtubeId: string;
        title: string;
        channelTitle: string;
        duration: string;
        requestedByTable: number;
        requestedBy: string | null;
        comments: string | null;
        status: import(".prisma/client").$Enums.QueueStatus;
        order: number;
        createdAt: Date;
        playedAt: Date | null;
    }>;
    playSong(id: string): Promise<{
        id: string;
        youtubeId: string;
        title: string;
        channelTitle: string;
        duration: string;
        requestedByTable: number;
        requestedBy: string | null;
        comments: string | null;
        status: import(".prisma/client").$Enums.QueueStatus;
        order: number;
        createdAt: Date;
        playedAt: Date | null;
    }>;
    completeSong(body: {
        currentId: string;
    }): Promise<{
        nextSong: {
            id: string;
            youtubeId: string;
            title: string;
            channelTitle: string;
            duration: string;
            requestedByTable: number;
            requestedBy: string | null;
            comments: string | null;
            status: import(".prisma/client").$Enums.QueueStatus;
            order: number;
            createdAt: Date;
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
    getTimerEnabled(): Promise<{
        enabled: boolean;
    }>;
    setTimerEnabled(body: {
        enabled: boolean;
    }): Promise<{
        enabled: boolean;
    }>;
}
