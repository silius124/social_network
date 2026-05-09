import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { FriendsService } from './friends.service';
import { CurrentUser } from 'src/auth/decorator/current-user.decorator';
import { JwtGuard } from 'src/auth/guard/jwt.guard';

@Controller('friends')
@UseGuards(JwtGuard)
export class FriendsController {
  constructor(private readonly friendsService: FriendsService) {}

  @Post('request/:id')
  sendRequest(
    @CurrentUser('id') userId: number,
    @Param('id', ParseIntPipe) receiverId: number,
  ) {
    return this.friendsService.sendRequest(userId, receiverId);
  }

  @Patch('respond/:id')
  respond(
    @CurrentUser('id') userId: number,
    @Param('id', ParseIntPipe) requestId: number,
    @Body('status') status: 'accepted' | 'rejected',
  ) {
    return this.friendsService.updateStatus(userId, requestId, status);
  }

  @Get()
  getFriends(@CurrentUser('id') userId: number) {
    return this.friendsService.getMyFriends(userId);
  }

  @Get('pending')
  getPending(@CurrentUser('id') userId: number) {
    return this.friendsService.getPendingRequest(userId);
  }
}
