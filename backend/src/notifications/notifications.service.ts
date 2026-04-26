import { Injectable } from '@nestjs/common';
import { NotificationTypes } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number, type: NotificationTypes, entityId: number) {
    return this.prisma.notification.create({
      data: { userId, type, entityId, isRead: false },
    });
  }

  async getMyNotification(userId: number) {
    return this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }
}
