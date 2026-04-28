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

  @Post(':id/like')
  @UseGuards(JwtGuard)
  toggleLike(
    @CurrentUser('id') userId: number,
    @Param('commentId', ParseIntPipe) commentId: number,
  ) {
    this.commentsService.toggleLike(userId, commentId);
  }

  @Get('post/:postId')
  getByPost(@Param('postId', ParseIntPipe) postId: number) {
    return this.commentsService.findByPost(postId);
  }
}
