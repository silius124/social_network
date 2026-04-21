import { Injectable, NotFoundException } from '@nestjs/common';
import { NotFoundError } from 'rxjs';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getProfile(username: string) {
    const user = this.prisma.user.findUnique({
      where: {
        username,
      },
      select: {
        id: true,
        username: true,
        firstname: true,
        lastname: true,
        avatarUrl: true,
        createdAt: true,
        _count: {
          select: { post: true, requesterUser: true, receiverUser: true },
        },
      },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async getUserPosts(userId: number) {
    return this.prisma.post.findMany({
      where: { userId },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        _count: { select: { like: true, comment: true } },
      },
    });
  }
}
