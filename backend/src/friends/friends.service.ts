import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { NotificationsService } from 'src/notifications/notifications.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FriendsService {
  constructor(
    private prisma: PrismaService,
    private notificationService: NotificationsService,
  ) {}

  async sendRequest(requesterId: number, receiverId: number) {
    if (requesterId === receiverId) {
      throw new ConflictException('You cannot friend yourself');
    }

    const friendShip = await this.prisma.friendShip.findFirst({
      where: {
        AND: [
          {
            OR: [
              { requesterId: requesterId, receiverId: receiverId },
              { requesterId: receiverId, receiverId: requesterId },
            ],
          },
          { status: 'rejected' },
        ],
      },
    });
    if (friendShip) {
      await this.delete(friendShip.id);
    }

    const createfriendShip = await this.prisma.friendShip.create({
      data: {
        requesterId,
        receiverId,
        status: 'pending',
      },
    });

    await this.notificationService.create(
      receiverId,
      'inviteToFriend',
      createfriendShip.id,
    );

    return createfriendShip;
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
      throw new NotFoundException('Friend request not found');
    }

    const updatedFriendShip = await this.prisma.friendShip.update({
      where: { id: requestId },
      data: { status },
    });

    if (status === 'accepted') {
      await this.notificationService.create(
        request?.requesterId,
        'acceptInviteToFriend',
        requestId,
      );
    }

    return updatedFriendShip;
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
            lastName: true,
          },
        },
        receiverUser: {
          select: {
            id: true,
            username: true,
            avatarUrl: true,
            firstName: true,
            lastName: true,
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
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  }

  async delete(id: number) {
    return this.prisma.friendShip.delete({
      where: {
        id,
        OR: [{ status: 'accepted' }, { status: 'rejected' }],
      },
    });
  }
}
