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

  async getMyChats(userId: number) {
    const chats = await this.prisma.chat.findMany({
      where: {
        participants: {
          some: {
            userId: userId,
          },
        },
      },
      include: {
        participants: {
          where: {
            userId: { not: userId },
          },
          include: {
            user: {
              select: {
                id: true,
                username: true,
                firstName: true,
                lastName: true,
                avatarUrl: true,
              },
            },
          },
        },
        messages: {
          take: 1,
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    return chats.map((chat) => ({
      id: chat.id,
      updatedAt: chat.createdAt,
      lastMessage: chat.messages[0] || null,
      friend: chat.participants[0]?.user || null,
    }));
  }
}
