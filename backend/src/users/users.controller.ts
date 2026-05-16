import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import { CurrentUser } from 'src/auth/decorator/current-user.decorator';
import { UpdateUserDto } from './dto/update.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('search')
  @UseGuards(JwtGuard)
  search(@Query('q') query: string, @CurrentUser('id') userId: number) {
    return this.usersService.searchUsers(query, userId);
  }

  @Patch('me')
  @UseGuards(JwtGuard)
  updateMe(@CurrentUser('id') userId: number, @Body() dto: UpdateUserDto) {
    return this.usersService.updateProfile(userId, dto);
  }

  @Delete('me')
  @UseGuards(JwtGuard)
  deleteMe(@CurrentUser('id') userId: number) {
    return this.usersService.deleteAccount(userId);
  }

  @Get(':identifier')
  getProfileByUsername(
    @CurrentUser('id') userId: number,
    @Param('identifier') identifier: string,
  ) {
    const profileId = Number(identifier);
    if (profileId) {
      return this.usersService.getProfile(userId, undefined, profileId);
    } else {
      return this.usersService.getProfile(userId, identifier);
    }
  }

  @Get(':id/posts')
  getPosts(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.getUserPosts(id);
  }
}
