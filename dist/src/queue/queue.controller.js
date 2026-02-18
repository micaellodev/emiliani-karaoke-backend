"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueueController = void 0;
const common_1 = require("@nestjs/common");
const queue_service_1 = require("./queue.service");
const orders_service_1 = require("../orders/orders.service");
const events_gateway_1 = require("../gateway/events.gateway");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let QueueController = class QueueController {
    constructor(queueService, eventsGateway, ordersService) {
        this.queueService = queueService;
        this.eventsGateway = eventsGateway;
        this.ordersService = ordersService;
    }
    async requestSong(body) {
        try {
            console.log('Received request body:', body);
            const song = await this.queueService.requestSong(body);
            this.eventsGateway.emitNewRequest(song);
            return song;
        }
        catch (error) {
            console.error('Error requesting song:', error);
            throw error;
        }
    }
    async addSongDirectly(body, req) {
        const song = await this.queueService.addDirect({
            ...body,
            addedBy: req.user.username || 'Admin'
        });
        this.eventsGateway.emitQueueUpdated();
        return song;
    }
    async approveSong(id) {
        const song = await this.queueService.approveSong(id);
        this.eventsGateway.emitQueueUpdated();
        return song;
    }
    async rejectSong(id) {
        const song = await this.queueService.rejectSong(id);
        this.eventsGateway.emitQueueUpdated();
        return song;
    }
    async deleteSong(id) {
        const song = await this.queueService.deleteSong(id);
        this.eventsGateway.emitQueueUpdated();
        return song;
    }
    async pausePlayback() {
        this.eventsGateway.emitPauseSong();
        return { success: true };
    }
    async resumePlayback() {
        this.eventsGateway.emitResumeSong();
        return { success: true };
    }
    async resetTable(id, req) {
        const tableNumber = parseInt(id);
        const closedBy = req.user.username;
        await this.queueService.resetTable(tableNumber, closedBy);
        await this.ordersService.closeTable(tableNumber);
        this.eventsGateway.emitResetTable(tableNumber);
        return { success: true };
    }
    async getStats() {
        return this.queueService.getStats();
    }
    async getTableLogs() {
        return this.queueService.getTableLogs();
    }
    async getQueue() {
        return this.queueService.getQueue();
    }
    async recover() {
        return this.queueService.recover();
    }
    async playSong(id) {
        const song = await this.queueService.playSong(id);
        this.eventsGateway.emitQueueUpdated();
        return song;
    }
    async completeSong(body) {
        const result = await this.queueService.completeSong(body.currentId);
        this.eventsGateway.emitPlayNext(result.nextSong);
        this.eventsGateway.emitQueueUpdated();
        return result;
    }
    async reorderQueue(body) {
        const result = await this.queueService.reorderQueue(body.items);
        this.eventsGateway.emitQueueUpdated();
        return result;
    }
    async joinTable(body) {
        const session = await this.queueService.joinTable(body.tableNumber, body.userName);
        this.eventsGateway.emitTablesUpdate();
        return session;
    }
    async getTableSession(id) {
        const tableNumber = parseInt(id);
        const session = await this.queueService.getTableSession(tableNumber);
        return session || { userName: null };
    }
    async getTables() {
        return this.queueService.getActiveTables();
    }
    async getTimerEnabled() {
        return { enabled: this.queueService.getTimerEnabled() };
    }
    async setTimerEnabled(body) {
        const enabled = this.queueService.setTimerEnabled(body.enabled);
        this.eventsGateway.emitTimerUpdate(enabled);
        return { enabled };
    }
};
exports.QueueController = QueueController;
__decorate([
    (0, common_1.Post)('request'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], QueueController.prototype, "requestSong", null);
__decorate([
    (0, common_1.Post)('add'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], QueueController.prototype, "addSongDirectly", null);
__decorate([
    (0, common_1.Patch)('approve/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], QueueController.prototype, "approveSong", null);
__decorate([
    (0, common_1.Patch)('reject/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], QueueController.prototype, "rejectSong", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], QueueController.prototype, "deleteSong", null);
__decorate([
    (0, common_1.Post)('playback/pause'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], QueueController.prototype, "pausePlayback", null);
__decorate([
    (0, common_1.Post)('playback/resume'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], QueueController.prototype, "resumePlayback", null);
__decorate([
    (0, common_1.Post)('table/:id/reset'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], QueueController.prototype, "resetTable", null);
__decorate([
    (0, common_1.Get)('stats'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], QueueController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)('stats/tables'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], QueueController.prototype, "getTableLogs", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], QueueController.prototype, "getQueue", null);
__decorate([
    (0, common_1.Get)('recover'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], QueueController.prototype, "recover", null);
__decorate([
    (0, common_1.Post)('play/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], QueueController.prototype, "playSong", null);
__decorate([
    (0, common_1.Post)('next'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], QueueController.prototype, "completeSong", null);
__decorate([
    (0, common_1.Patch)('reorder'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], QueueController.prototype, "reorderQueue", null);
__decorate([
    (0, common_1.Post)('table/join'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], QueueController.prototype, "joinTable", null);
__decorate([
    (0, common_1.Get)('table/:id/session'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], QueueController.prototype, "getTableSession", null);
__decorate([
    (0, common_1.Get)('tables'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], QueueController.prototype, "getTables", null);
__decorate([
    (0, common_1.Get)('timer'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], QueueController.prototype, "getTimerEnabled", null);
__decorate([
    (0, common_1.Post)('timer'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], QueueController.prototype, "setTimerEnabled", null);
exports.QueueController = QueueController = __decorate([
    (0, common_1.Controller)('queue'),
    __metadata("design:paramtypes", [queue_service_1.QueueService,
        events_gateway_1.EventsGateway,
        orders_service_1.OrdersService])
], QueueController);
//# sourceMappingURL=queue.controller.js.map