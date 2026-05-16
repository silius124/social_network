import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { CurrentUser } from 'src/auth/decorator/current-user.decorator';
import { JwtGuard } from 'src/auth/guard/jwt.guard';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @UseGuards(JwtGuard)
  @Get('me')
  getNotification(@CurrentUser('id') userId: number) {
    return this.notificationsService.getMyNotification(userId);
  }

  @Patch(':id/read')
  markAsRead(@Param('id', ParseIntPipe) notifId: number) {
    return this.notificationsService.readNotification(notifId);
  }
}
