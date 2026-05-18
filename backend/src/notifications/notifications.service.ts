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
    const notifications = await this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    const countUnread = await this.prisma.notification.count({
      where: { userId, isRead: false },
    });

    return { notifications: [...notifications], countUnread };
  }

  async readNotification(notifId: number) {
    return this.prisma.notification.update({
      where: { id: notifId },
      data: { isRead: true },
    });
  }
}
