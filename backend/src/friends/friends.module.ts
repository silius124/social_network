import { Module } from '@nestjs/common';
import { FriendsService } from './friends.service';
import { FriendsController } from './friends.controller';
import { NotificationsService } from 'src/notifications/notifications.service';

@Module({
  imports: [NotificationsService],
  controllers: [FriendsController],
  providers: [FriendsService],
})
export class FriendsModule {}
