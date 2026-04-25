import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UseGuards } from '@nestjs/common';
import { WsJwtGuard } from './guard/ws-jwt.guard';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:3002',
    credential: true,
  },
})
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log(`Client conncted: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnect: ${client.id}`);
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(
    @MessageBody() data: { chatId: string },
    @ConnectedSocket() client: Socket,
  ) {
    client.join(`chat_${data.chatId}`);
    return { event: 'joined', room: `chat_${data.chatId}` };
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(
    @MessageBody() data: { chatId: number; content: string },
    @ConnectedSocket() client: Socket,
  ) {
    this.server.to(`chat_${data.chatId}`).emit('newMessage', {
      content: data.content,
      senderId: client.data.user.userId,
      createdAt: new Date(),
    });
  }
}
