import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CurrentUser } from 'src/auth/decorator/current-user.decorator';
import { CreateCommentDto } from './DTO/comments.dto';
import { JwtGuard } from 'src/auth/guard/jwt.guard';

@Controller('comments')
@UseGuards(JwtGuard)
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  create(@CurrentUser('userId') userId: number, @Body() dto: CreateCommentDto) {
    return this.commentsService.create(userId, dto);
  }

  @Get('post/:postId')
  getByPost(@Param('postId', ParseIntPipe) postId: number) {
    return this.commentsService.findByPost(postId);
  }
}
