import { FileValidator } from '@nestjs/common';
import { readFileSync } from 'fs';

export class VideoTypeValidator extends FileValidator {
  private readonly allowedTypes = [
    {
      mime: 'video/mp4',
      magic: [0x00, 0x00, 0x00, 0x18, 0x66, 0x74, 0x79, 0x70],
    },
    { mime: 'video/webm', magic: [0x1a, 0x45, 0xdf, 0xa3] },
    {
      mime: 'video/quicktime',
      magic: [0x00, 0x00, 0x00, 0x14, 0x66, 0x74, 0x79, 0x70],
    },
  ];

  constructor() {
    super({});
  }

  isValid(file: Express.Multer.File): boolean {
    const buffer = readFileSync(file.path);

    if (buffer[0] === 0x1a && buffer[1] === 0x45) return true;

    const ftyp = buffer.slice(4, 8).toString('ascii');
    if (ftyp === 'ftyp') return true;

    return false;
  }

  buildErrorMessage(): string {
    return 'Недопустимый тип файла. Разрешены: MP4, WebM, MOV';
  }
}
