import { Controller, Get, Param, ParseIntPipe, Patch } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { CurrentUser } from 'src/auth/decorator/current-user.decorator';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get('me')
  getNotification(@CurrentUser('id') userId: number) {
    return this.notificationsService.getMyNotification(userId);
  }

  @Patch(':id/read')
  markAsRead(@Param('id', ParseIntPipe) notifId: number) {
    return this.notificationsService.readNotification(notifId);
  }
}
