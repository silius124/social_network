import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { WsException } from '@nestjs/websockets';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class WsJwtGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const client = context.switchToWs().getClient();
      const authToken = client.handshake.auth?.token;

      if (!authToken) {
        throw new WsException('Unauthorized: No taken provided');
      }

      const payload = this.jwtService.verify(authToken);

      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
      });

      if (!user) throw new WsException('Unauthorized: User not found');
      client.data.user = { userId: user.id, username: user.username };

      return true;
    } catch (err) {
      console.log('WsJwtGuard error:', err.message);
      throw new WsException('Unauthorized');
    }
  }
}
