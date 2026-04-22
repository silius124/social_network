import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePostDto } from './dto/posts.dto';
import { NotificationsService } from 'src/notifications/notifications.service';
import { NotFoundError } from 'rxjs';

@Injectable()
export class PostsService {
  constructor(
    private prisma: PrismaService,
    private notificationService: NotificationsService,
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
            avatarUrl: true,
          },
        },
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
      await this.notificationService.create(userId, 'likeToPost', postId);
    }

    return { liked: true };
  }
}
