import { UseGuards } from '@nestjs/common';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { WsJwtGuard } from 'src/chat/guard/ws-jwt.guard';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:5173',
    credentials: true,
  },
})
export class NotificationGateway {
  @WebSocketServer()
  server!: Server;

  @UseGuards(WsJwtGuard)
  async handleConnection(client: Socket) {
    const userId = client.data?.user?.userId as number;

    if (userId) {
      const userRoom = `user_${userId}`;
      await client.join(userRoom);
      console.log(`User ${userId} joined their private room: ${userRoom}`);
    }
  }
}
