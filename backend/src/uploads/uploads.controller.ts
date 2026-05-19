import {
  Controller,
  FileValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { ImageTypeValidator } from './ImageTypeValidator';
import { VideoTypeValidator } from './VideoTypeValidator';

const imageStorage = (folder: 'avatars' | 'posts') =>
  diskStorage({
    destination: `./uploads/${folder}`,
    filename: (req, file, cb) => {
      cb(null, `${uuidv4()}${extname(file.originalname)}`);
    },
  });

const videoStorage = diskStorage({
  destination: './uploads/videos',
  filename: (req, file, cb) => {
    cb(null, `${uuidv4()}${extname(file.originalname)}`);
  },
});

const createVideoPipe = () =>
  new ParseFilePipe({
    validators: [
      new MaxFileSizeValidator({
        maxSize: 100 * 1024 * 1024, // 100MB
        message: 'Видео слишком большое. Максимум 100MB.',
      }),
      new VideoTypeValidator(),
    ],
  });

const createAvatarPipe = () =>
  new ParseFilePipe({
    validators: [
      new MaxFileSizeValidator({
        maxSize: 10 * 1024 * 1024,
        message: 'Файл слишком большой. Максимум 10MB.',
      }),
      new ImageTypeValidator(true),
    ],
  });

const createPostImagePipe = () =>
  new ParseFilePipe({
    validators: [
      new MaxFileSizeValidator({
        maxSize: 5 * 1024 * 1024,
        message: 'Файл слишком большой. Максимум 5MB.',
      }),
      new ImageTypeValidator(true),
    ],
  });
@Controller('uploads')
@UseGuards(JwtGuard)
export class UploadsController {
  @Post('avatar')
  @UseInterceptors(
    FileInterceptor('file', { storage: imageStorage('avatars') }),
  )
  uploadAvatar(@UploadedFile(createAvatarPipe()) file: Express.Multer.File) {
    return { url: `/uploads/avatars/${file.filename}` };
  }

  @Post('post-image')
  @UseInterceptors(FileInterceptor('file', { storage: imageStorage('posts') }))
  uploadPostImage(
    @UploadedFile(createPostImagePipe()) file: Express.Multer.File,
  ) {
    return { url: `/uploads/posts/${file.filename}` };
  }

  @Post('video')
  @UseInterceptors(FileInterceptor('file', { storage: videoStorage }))
  uploadVideo(@UploadedFile(createVideoPipe()) file: Express.Multer.File) {
    return { url: `/uploads/videos/${file.filename}` };
  }
}
