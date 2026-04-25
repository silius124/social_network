import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from 'src/prisma/prisma.module';
import { WsJwtGuard } from './guard/ws-jwt.guard';

@Module({
  providers: [ChatService, WsJwtGuard],
  imports: [JwtModule, PrismaModule],
})
export class ChatModule {}
