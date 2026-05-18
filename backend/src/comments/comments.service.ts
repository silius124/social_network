import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCommentDto } from './DTO/comments.dto';
import { NotificationsService } from 'src/notifications/notifications.service';
import { NotificationGateway } from 'src/notifications/notification.gateway';

@Injectable()
export class CommentsService {
  constructor(
    private prisma: PrismaService,
    private notificationService: NotificationsService,
    private notificationGateway: NotificationGateway,
  ) {}

  async create(userId: number, dto: CreateCommentDto) {
    const comment = await this.prisma.comment.create({
      data: {
        content: dto.content,
        postId: dto.postId,
        userId: userId,
      },
      include: {
        user: { select: { username: true, avatarUrl: true } },
        post: { select: { userId: true, id: true } },
      },
    });

    if (userId !== comment.post.userId) {
      const notification = await this.notificationService.create(
        comment.post.userId,
        'createComment',
        comment.id,
      );

      this.notificationGateway.server
        .to(`user_${comment.post.userId}`)
        .emit('newNotification', notification);
    }

    return comment;
  }

  async toggleLike(userId: number, commentId: number) {
    const existingLike = await this.prisma.commentLike.findUnique({
      where: {
        commentId_userId: { commentId: commentId, userId: userId },
      },
    });

    if (existingLike) {
      await this.prisma.commentLike.delete({
        where: {
          commentId_userId: { commentId: commentId, userId: userId },
        },
      });
      return { liked: false };
    }

    const comment = await this.prisma.comment.findUnique({
      where: { id: commentId },
      select: { userId: true },
    });

    if (!comment) throw new NotFoundException('Comment not found');

    await this.prisma.commentLike.create({
      data: {
        commentId,
        userId,
      },
    });

    if (comment.userId !== userId) {
      const notification = await this.notificationService.create(
        comment.userId,
        'likeToComment',
        commentId,
      );
      this.notificationGateway.server
        .to(`user_${comment.userId}`)
        .emit('newNotification', notification);
    }

    return { liked: true };
  }

  async findByPost(postId: number) {
    return this.prisma.comment.findMany({
      where: { postId },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            username: true,
            avatarUrl: true,
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    });
  }
}
