import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { QueueService } from './queue.service';
import { EventsGateway } from '../gateway/events.gateway';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

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
        comments?: string;
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

    @Post('add')
    @UseGuards(JwtAuthGuard)
    async addSongDirectly(@Body() body: {
        youtubeId: string;
        title: string;
        channelTitle: string;
        duration: string;
    }, @Request() req) {
        const song = await this.queueService.addDirect({
            ...body,
            addedBy: req.user.username || 'Admin'
        });
        this.eventsGateway.emitQueueUpdated();
        return song;
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
        this.eventsGateway.emitQueueUpdated();
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

    @Get('table/:id/session')
    async getTableSession(@Param('id') id: string) {
        const tableNumber = parseInt(id);
        const session = await this.queueService.getTableSession(tableNumber);
        return session || { userName: null }; // Return null object if no session
    }

    @Get('tables')
    async getTables() {
        return this.queueService.getActiveTables();
    }

    @Get('timer')
    async getTimerEnabled() {
        return { enabled: this.queueService.getTimerEnabled() };
    }

    @Post('timer')
    async setTimerEnabled(@Body() body: { enabled: boolean }) {
        const enabled = this.queueService.setTimerEnabled(body.enabled);
        this.eventsGateway.emitTimerUpdate(enabled);
        return { enabled };
    }
}
