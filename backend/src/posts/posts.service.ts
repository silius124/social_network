import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePostDto } from './dto/posts.dto';
import { NotificationsService } from 'src/notifications/notifications.service';
import { NotificationGateway } from 'src/notifications/notification.gateway';

@Injectable()
export class PostsService {
  constructor(
    private prisma: PrismaService,
    private notificationService: NotificationsService,
    private notificationGateway: NotificationGateway,
  ) {}

  async create(userId: number, dto: CreatePostDto) {
    return this.prisma.post.create({
      data: {
        ...dto,
        userId,
      },
    });
  }

  async findAll() {
    return await this.prisma.post.findMany({
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
        _count: { select: { like: true, comment: true } },
        like: true,
        comment: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async toggleLike(userId: number, postId: number) {
    const existingLike = await this.prisma.postLike.findUnique({
      where: {
        postId_userId: { postId, userId },
      },
    });

    if (existingLike) {
      await this.prisma.postLike.delete({
        where: {
          postId_userId: { postId, userId },
        },
      });
      return { liked: false };
    }

    const post = await this.prisma.post.findUnique({
      where: { id: postId },
      select: { userId: true },
    });

    if (!post) throw new NotFoundException('Post not found');

    await this.prisma.postLike.create({
      data: { postId, userId },
    });

    if (post?.userId !== userId) {
      const notification = await this.notificationService.create(
        post?.userId,
        'likeToPost',
        postId,
      );

      this.notificationGateway.server
        .to(`user_${post?.userId}`)
        .emit('newNotification', notification);
    }

    return { liked: true };
  }

  async deletePost(userId: number, postId: number) {
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) throw new NotFoundException('Post not found');
    if (post.userId !== userId)
      throw new ForbiddenException('You can only delete your own posts');

    return this.prisma.post.delete({
      where: {
        id: postId,
      },
    });
  }
}
