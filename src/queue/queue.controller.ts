import { Controller, Get, Post, Patch, Delete, Body, Param } from '@nestjs/common';
import { QueueService } from './queue.service';
import { EventsGateway } from '../gateway/events.gateway';

@Controller('queue')
export class QueueController {
    constructor(
        private queueService: QueueService,
        private eventsGateway: EventsGateway,
    ) { }

    @Post('request')
    async requestSong(@Body() body: {
        youtubeId: string;
        title: string;
        channelTitle: string;
        duration: string;
        requestedByTable: number;
        requestedBy?: string;
    }) {
        try {
            console.log('Received request body:', body);
            const song = await this.queueService.requestSong(body);
            this.eventsGateway.emitNewRequest(song);
            return song;
        } catch (error) {
            console.error('Error requesting song:', error);
            throw error;
        }
    }

    @Patch('approve/:id')
    async approveSong(@Param('id') id: string) {
        const song = await this.queueService.approveSong(id);
        this.eventsGateway.emitQueueUpdated();
        return song;
    }

    @Patch('reject/:id')
    async rejectSong(@Param('id') id: string) {
        const song = await this.queueService.rejectSong(id);
        this.eventsGateway.emitQueueUpdated();
        return song;
    }

    @Delete(':id')
    async deleteSong(@Param('id') id: string) {
        const song = await this.queueService.deleteSong(id);
        this.eventsGateway.emitQueueUpdated();
        return song;
    }

    @Post('playback/pause')
    async pausePlayback() {
        this.eventsGateway.emitPauseSong();
        return { success: true };
    }

    @Post('playback/resume')
    async resumePlayback() {
        this.eventsGateway.emitResumeSong();
        return { success: true };
    }

    @Post('table/:id/reset')
    async resetTable(@Param('id') id: string) {
        const tableNumber = parseInt(id);
        await this.queueService.resetTable(tableNumber);
        this.eventsGateway.emitResetTable(tableNumber);
        return { success: true };
    }

    @Get('stats')
    async getStats() {
        return this.queueService.getStats();
    }

    @Get()
    async getQueue() {
        return this.queueService.getQueue();
    }

    @Get('recover')
    async recover() {
        return this.queueService.recover();
    }

    @Post('play/:id')
    async playSong(@Param('id') id: string) {
        const song = await this.queueService.playSong(id);
        this.eventsGateway.emitQueueUpdated();
        return song;
    }

    @Post('next')
    async completeSong(@Body() body: { currentId: string }) {
        const result = await this.queueService.completeSong(body.currentId);
        this.eventsGateway.emitPlayNext(result.nextSong);
        return result;
    }

    @Patch('reorder')
    async reorderQueue(@Body() body: { items: { id: string; order: number }[] }) {
        const result = await this.queueService.reorderQueue(body.items);
        this.eventsGateway.emitQueueUpdated();
        return result;
    }

    // Table Session Endpoints

    @Post('table/join')
    async joinTable(@Body() body: { tableNumber: number; userName: string }) {
        const session = await this.queueService.joinTable(body.tableNumber, body.userName);
        this.eventsGateway.emitTablesUpdate(); // Notify admins
        return session;
    }

    @Get('tables')
    async getTables() {
        return this.queueService.getActiveTables();
    }
}
