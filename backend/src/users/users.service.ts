import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getProfile(id: number, username?: string, profileId?: number) {
    const user = await this.prisma.user.findUnique({
      where: profileId ? { id: profileId } : { username },
      select: {
        id: true,
        username: true,
        firstName: true,
        lastName: true,
        avatarUrl: true,
        createdAt: true,
        _count: {
          select: { posts: true, requesterUser: true, receiverUser: true },
        },
      },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const friendShip = await this.prisma.friendShip.findFirst({
      where: {
        OR: [
          { requesterId: id, receiverId: user.id },
          { requesterId: user.id, receiverId: id },
        ],
      },
      select: {
        status: true,
        requesterId: true,
        id: true,
      },
    });
    if (friendShip) {
      const { id: friendShipId, ...friendShipRest } = friendShip;
      return { ...user, ...friendShipRest, friendShipId };
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
        user: {
          select: {
            username: true,
            avatarUrl: true,
            firstName: true,
            lastName: true,
          },
        },
        like: true,
        comment: true,
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
