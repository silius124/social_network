import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCommentDto } from './DTO/comments.dto';

@Injectable()
export class CommentsService {
  constructor(private prisma: PrismaService) {}

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

  async findByPost(postId: number) {
    return this.prisma.comment.findMany({
      where: { postId },
      include: {
        user: {
          select: {
            username: true,
            avatarUrl: true,
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    });
  }
}
