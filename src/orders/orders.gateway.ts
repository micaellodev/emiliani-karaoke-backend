import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    MessageBody,
    ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { OrdersService } from './orders.service';

@WebSocketGateway({ cors: { origin: '*' } })
export class OrdersGateway {
    @WebSocketServer()
    server: Server;

    constructor(private readonly ordersService: OrdersService) { }

    @SubscribeMessage('order:create')
    async handleCreateOrder(
        @MessageBody() data: { tableNumber: number; items: any[] },
        @ConnectedSocket() client: Socket,
    ) {
        const order = await this.ordersService.createOrder(data);
        this.server.emit('order:new', order);
        return order;
    }

    @SubscribeMessage('order:get')
    async handleGetOrders() {
        return this.ordersService.getOrders();
    }

    @SubscribeMessage('order:complete')
    async handleCompleteOrder(@MessageBody() data: { id: string }) {
        await this.ordersService.completeOrder(data.id);
        this.server.emit('order:completed', { id: data.id });
    }
}
