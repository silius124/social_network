import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { join } from 'path';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(
    '/uploads',
    express.static(join(process.cwd(), 'uploads'), {
      setHeaders: (res, filePath) => {
        if (filePath.endsWith('.gif'))
          res.setHeader('Content-Type', 'image/gif');
        if (filePath.endsWith('.mp4'))
          res.setHeader('Content-Type', 'video/mp4');
        if (filePath.endsWith('.webm'))
          res.setHeader('Content-Type', 'video/webm');
        if (filePath.endsWith('.mov'))
          res.setHeader('Content-Type', 'video/quicktime');
      },
    }),
  );

  app.use(helmet());

  app.enableCors({
    origin: 'http://192.168.1.101:5173',
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.setGlobalPrefix('api');

  await app.listen(3000, '0.0.0.0');
}

bootstrap();
