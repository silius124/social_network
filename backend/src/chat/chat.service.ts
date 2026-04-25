import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  async getOrCreateChat(userId: number, friendId: number) {
    const existingChat = await this.prisma.chat.findFirst({
      where: {
        participants: { every: { userId: { in: [userId, friendId] } } },
      },
    });

    if (existingChat) return existingChat;

    return this.prisma.chat.create({
      data: {
        participants: {
          create: [{ userId: userId }, { userId: friendId }],
        },
      },
    });
  }

  async saveMessage(userId: number, chatId: number, content: string) {
    return this.prisma.message.create({
      data: { content, chatId, userId },
      include: {
        user: { select: { username: true, avatarUrl: true } },
      },
    });
  }

  async getMessages(chatId: number) {
    return this.prisma.chat.findMany({
      where: { chatId },
      orderBy: { createdAt: 'asc' },
      include: {
        user: { select: { username: true, avatarUrl: true } },
      },
    });
  }
}
