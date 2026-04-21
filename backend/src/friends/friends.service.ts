import { ConflictException, Injectable } from '@nestjs/common';
import { NotFoundError } from 'rxjs';

@Injectable()
export class FriendsService {
  constructor(private prisma: PrismaService) {}

  async sendRequest(requesterId: number, receiverId: number) {
    if (requesterId === receiverId) {
      throw new ConflictException('You cannot friend yourself');
    }

    return await this.prisma.friendShip.create({
      data: {
        requesterId,
        receiverId,
        status: 'pending',
      },
    });
  }

  async updateStatus(
    receiverId: number,
    requestId: number,
    status: 'accepted' | 'rejected',
  ) {
    const request = await this.prisma.friendShip.findUnique({
      where: {
        id: requestId,
      },
    });

    if (!request || request.receiverId !== receiverId) {
      throw new NotFoundError('Friend request not found');
    }

    return this.prisma.friendShip.update({
      where: { id: requestId },
      data: { status },
    });
  }

  async getMyFriends(userId: number) {
    const friends = await this.prisma.friendShip.findMany({
      where: {
        status: 'accepted',
        OR: [{ requesterId: userId }, { receiverId: userId }],
      },
      include: {
        requesterUser: {
          select: {
            id: true,
            username: true,
            avatarUrl: true,
            firstName: true,
            lastname: true,
          },
        },
        receiverUser: {
          select: {
            id: true,
            username: true,
            avatarUrl: true,
            firstName: true,
            lastname: true,
          },
        },
      },
    });

    return friends.map((rel) =>
      rel.requesterId === userId ? rel.receiverUser : rel.requesterUser,
    );
  }

  async getPendingRequest(userId: number) {
    return this.prisma.friendShip.findMany({
      where: {
        receiverId: userId,
        status: 'pending',
      },
      include: {
        requesterUser: {
          select: {
            id: true,
            username: true,
            avatarUrl: true,
            firstname: true,
            lastname: true,
          },
        },
      },
    });
  }
}
