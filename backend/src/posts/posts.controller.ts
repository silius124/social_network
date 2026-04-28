import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import { CurrentUser } from 'src/auth/decorator/current-user.decorator';
import { CreatePostDto } from './dto/posts.dto';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @UseGuards(JwtGuard)
  create(@CurrentUser('id') userId: number, @Body() dto: CreatePostDto) {
    return this.postsService.create(userId, dto);
  }

  @Post(':id/like')
  @UseGuards(JwtGuard)
  toggleLike(
    @CurrentUser('id') userId: number,
    @Param('id', ParseIntPipe) postId: number,
  ) {
    return this.postsService.toggleLike(userId, postId);
  }

  @Get()
  findAll() {
    return this.postsService.findAll();
  }

  @Delete(':id')
  @UseGuards(JwtGuard)
  deletePost(
    @CurrentUser('id') userId: number,
    @Param('id', ParseIntPipe) postId: number,
  ) {
    return this.postsService.deletePost(userId, postId);
  }
}
