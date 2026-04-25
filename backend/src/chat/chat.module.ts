import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ChatGateway } from './chat.gateway';

@Module({
  providers: [ChatService, ChatGateway],
  imports: [JwtModule, PrismaModule],
})
export class ChatModule {}
