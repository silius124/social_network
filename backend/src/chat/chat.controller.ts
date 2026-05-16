import {
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import { ChatService } from './chat.service';
import { CurrentUser } from 'src/auth/decorator/current-user.decorator';

@Controller('chats')
@UseGuards(JwtGuard)
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get()
  getChats(@CurrentUser('id') userId: number) {
    return this.chatService.getMyChats(userId);
  }

  @Get(':id/messages')
  getMessages(@Param('id', ParseIntPipe) chatId: number) {
    return this.chatService.getMessages(chatId);
  }

  @Get('find/:friendId')
  findChat(
    @CurrentUser('id') userId: number,
    @Param('friendId', ParseIntPipe) friendId: number,
  ) {
    return this.chatService.findExisitingChat(userId, friendId);
  }

  @Delete(':id')
  deleteChat(@Param('id', ParseIntPipe) chatId: number) {
    return this.chatService.delete(chatId);
  }
}
