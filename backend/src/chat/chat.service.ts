import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  async findExisitingChat(userId: number, friendId: number) {
    return this.prisma.chat.findFirst({
      where: {
        participants: {
          every: { userId: { in: [userId, friendId] } },
        },
      },
    });
  }

  async saveMessage(
    userId: number,
    content: string,
    chatId?: number,
    friendId?: number,
  ) {
    let targetChatId = chatId;

    if (!targetChatId && friendId) {
      const chat = await this.prisma.chat.create({
        data: {
          participants: {
            create: [{ userId: userId }, { userId: friendId }],
          },
        },
      });
      targetChatId = chat.id;
    }

    if (!targetChatId) throw new Error('Chat ID is required');

    return this.prisma.messages.create({
      data: { content, chatId: targetChatId, senderId: userId },
      include: {
        sender: { select: { username: true, avatarUrl: true } },
      },
    });
  }

  async getMessages(chatId: number) {
    return this.prisma.messages.findMany({
      where: { chatId },
      orderBy: { createdAt: 'asc' },
      include: {
        sender: { select: { username: true, avatarUrl: true } },
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
