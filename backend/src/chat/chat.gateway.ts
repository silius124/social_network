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
  handleJoinRoom(
    @MessageBody() data: { chatId: string },
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
    @MessageBody() data: { chatId: number; content: string },
    @ConnectedSocket() client: Socket,
  ) {
    const senderId = client.data.user.userId;

    const message = await this.chatService.saveMessage(
      senderId,
      data.chatId,
      data.content,
    );

    this.server.to(`chat_${data.chatId}`).emit('newMessage', message);
  }
}
