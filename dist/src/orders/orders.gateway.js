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
exports.OrdersGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const orders_service_1 = require("./orders.service");
let OrdersGateway = class OrdersGateway {
    constructor(ordersService) {
        this.ordersService = ordersService;
    }
    async handleCreateOrder(data, client) {
        const order = await this.ordersService.createOrder(data);
        this.server.emit('order:new', order);
        return order;
    }
    async handleGetOrders() {
        return this.ordersService.getOrders();
    }
    async handleCompleteOrder(data) {
        await this.ordersService.completeOrder(data.id);
        this.server.emit('order:completed', { id: data.id });
    }
    async handleGetCompletedOrders() {
        return this.ordersService.getCompletedOrders();
    }
    async handleDeleteOrder(data) {
        await this.ordersService.deleteOrder(data.id);
        this.server.emit('order:deleted', { id: data.id });
    }
    async handleGetOrdersByTable(data) {
        return this.ordersService.getOrdersByTable(data.tableNumber);
    }
};
exports.OrdersGateway = OrdersGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], OrdersGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('order:create'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], OrdersGateway.prototype, "handleCreateOrder", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('order:get'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], OrdersGateway.prototype, "handleGetOrders", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('order:complete'),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OrdersGateway.prototype, "handleCompleteOrder", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('order:getCompleted'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], OrdersGateway.prototype, "handleGetCompletedOrders", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('order:delete'),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OrdersGateway.prototype, "handleDeleteOrder", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('order:getByTable'),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OrdersGateway.prototype, "handleGetOrdersByTable", null);
exports.OrdersGateway = OrdersGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({ cors: { origin: '*' } }),
    __metadata("design:paramtypes", [orders_service_1.OrdersService])
], OrdersGateway);
//# sourceMappingURL=orders.gateway.js.map