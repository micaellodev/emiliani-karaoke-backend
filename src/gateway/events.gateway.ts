import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    OnGatewayConnection,
    OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
    cors: {
        origin: [
            'http://localhost:3000',
            'https://l4valink-production.up.railway.app',
            'https://emilianipizzas.com',
            'https://www.emilianipizzas.com',
            'http://emilianipizzas.com',
        ],
        credentials: true,
    },
})
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    handleConnection(client: Socket) {
        console.log(`Client connected: ${client.id}`);
    }

    handleDisconnect(client: Socket) {
        console.log(`Client disconnected: ${client.id}`);
    }

    // Emit events to all clients
    emitNewRequest(song: any) {
        this.server.emit('new_request', song);
    }

    emitQueueUpdated() {
        this.server.emit('queue_updated');
    }

    emitPlayNext(nextSong: any) {
        this.server.emit('play_next', nextSong);
    }

    emitPauseSong() {
        this.server.emit('pause_song');
    }

    emitResumeSong() {
        this.server.emit('resume_song');
    }

    // Listen for events from admin
    @SubscribeMessage('skip_song')
    handleSkipSong(client: Socket, data: any) {
        this.server.emit('skip_song', data);
    }

    @SubscribeMessage('pause_song')
    handlePauseSong(client: Socket, data: any) {
        this.server.emit('pause_song', data);
    }

    emitResetTable(tableNumber: number) {
        this.server.emit('reset_table', { tableNumber });
    }

    emitTablesUpdate() {
        this.server.emit('tables_updated');
    }

    emitTimerUpdate(enabled: boolean) {
        this.server.emit('timer_updated', { enabled });
    }
}
