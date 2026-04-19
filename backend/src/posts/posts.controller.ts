import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { PostsService } from './posts.service';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import { CurrentUser } from 'src/auth/decorator/current-user.decorator';
import { CreatePostDto } from './dto/posts.dto';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @UseGuards(JwtGuard)
  create(@CurrentUser('userId') userId: number, @Body() dto: CreatePostDto) {
    return this.postsService.create(userId, dto);
  }

  @Get()
  findAll() {
    return this.postsService.findAll();
  }
}
