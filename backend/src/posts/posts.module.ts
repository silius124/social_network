import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { NotificationsService } from 'src/notifications/notifications.service';

@Module({
  imports: [NotificationsService],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
