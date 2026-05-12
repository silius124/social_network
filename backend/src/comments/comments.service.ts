import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCommentDto } from './DTO/comments.dto';
import { NotificationsService } from 'src/notifications/notifications.service';

@Injectable()
export class CommentsService {
  constructor(
    private prisma: PrismaService,
    private notificationService: NotificationsService,
  ) {}

  async create(userId: number, dto: CreateCommentDto) {
    return this.prisma.comment.create({
      data: {
        content: dto.content,
        postId: dto.postId,
        userId: userId,
      },
      include: {
        user: { select: { username: true, avatarUrl: true } },
      },
    });
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
      await this.notificationService.create(
        comment.userId,
        'likeToComment',
        commentId,
      );
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
