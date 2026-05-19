import { JwtService } from '@nestjs/jwt';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { PrismaService } from 'src/prisma/prisma.service';

@WebSocketGateway({
  cors: {
    origin: 'http://192.168.1.101:5173',
    credentials: true,
  },
})
export class NotificationGateway {
  @WebSocketServer()
  server!: Server;

  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async handleConnection(client: Socket) {
    try {
      const authToken = client.handshake.auth?.token;

      if (!authToken) {
        console.log(
          `[NotificationGateway] Отклонено: нет токена. ID: ${client.id}`,
        );
        client.disconnect();
        return;
      }

      const payload = this.jwtService.verify(authToken);

      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
      });

      if (!user) {
        console.log(`[NotificationGateway] Отклонено: юзер не найден в БД`);
        client.disconnect();
        return;
      }

      client.data.user = { userId: user.id, username: user.username };

      const userRoom = `user_${user.id}`;
      await client.join(userRoom);

      console.log(
        `User ${user.id} (${user.username}) joined their private room: ${userRoom}`,
      );
    } catch (err) {
      console.log(
        '[NotificationGateway] Ошибка авторизации при коннекте:',
        err.message,
      );
      client.disconnect();
    }
  }
  handleDisconnect(client: Socket) {
    console.log('Клиент отключился ', client.data.user.userId);
  }
}
