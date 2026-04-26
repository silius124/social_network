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
import { ChatService } from './chat.service';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:3002',
    credential: true,
  },
})
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  constructor(private chatService: ChatService) {}

  handleConnection(client: Socket) {
    console.log(`Client conncted: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnect: ${client.id}`);
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('joinRoom')
  async handleJoinRoom(
    @MessageBody() data: { chatId: number },
    @ConnectedSocket() client: Socket,
  ) {
    client.join(`chat_${data.chatId}`);

    const history = await this.chatService.getMessages(data.chatId);
    client.emit('chatHistory', history);

    return { event: 'joined', room: `chat_${data.chatId}` };
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('sendMessage')
  async handleMessage(
    @MessageBody()
    data: { chatId?: number; friendId?: number; content: string },
    @ConnectedSocket() client: Socket,
  ) {
    const senderId: number = client.data.user.userId as number;

    const message = await this.chatService.saveMessage(
      senderId,
      data.content,
      data.chatId,
      data.friendId,
    );

    const roomId = `chat_${message.chatId}`;
    client.join(roomId);

    this.server.to(`chat_${data.chatId}`).emit('newMessage', message);

    if (!data.chatId) {
      client.emit('chatCreated', { chatId: message.chatId });
    }
  }
}
