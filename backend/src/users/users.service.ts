import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getProfile(username: string) {
    const user = await this.prisma.user.findUnique({
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

  async searchUsers(query: string, currentUserId: number) {
    return this.prisma.user.findMany({
      where: {
        AND: [
          { id: { not: currentUserId } },
          {
            OR: [
              { username: { contains: query, mode: 'insensitive' } },
              { firstName: { contains: query, mode: 'insensitive' } },
              { lastName: { contains: query, mode: 'insensitive' } },
            ],
          },
        ],
      },
      select: {
        id: true,
        username: true,
        firstName: true,
        lastName: true,
        avatarUrl: true,
      },
      take: 10,
    });
  }

  async updateProfile(
    userId: number,
    dto: { firstname?: string; lastname?: string; avatarUrl?: string },
  ) {
    return this.prisma.user.update({
      where: {
        id: userId,
      },
      data: dto,
      select: {
        id: true,
        username: true,
        firstName: true,
        lastName: true,
        avatarUrl: true,
      },
    });
  }

  async deleteAccount(userId: number) {
    return this.prisma.user.delete({
      where: { id: userId },
    });
  }
}
