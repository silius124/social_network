import { FileValidator } from '@nestjs/common';
import { readFileSync } from 'fs';

export class ImageTypeValidator extends FileValidator {
  private readonly allowedTypes = [
    { mime: 'image/jpeg', magic: [0xff, 0xd8, 0xff] },
    { mime: 'image/png', magic: [0x89, 0x50, 0x4e, 0x47] },
    { mime: 'image/webp', magic: [0x52, 0x49, 0x46, 0x46] },
    { mime: 'image/gif', magic: [0x47, 0x49, 0x46, 0x38] },
  ];

  constructor(private readonly allowGif = false) {
    super({});
  }

  isValid(file: Express.Multer.File): boolean {
    const allowed = this.allowGif
      ? this.allowedTypes
      : this.allowedTypes.filter((t) => t.mime !== 'image/gif');

    // Читаем первые байты файла с диска
    const buffer = readFileSync(file.path);

    return allowed.some(({ magic }) =>
      magic.every((byte, i) => buffer[i] === byte),
    );
  }

  buildErrorMessage(): string {
    const types = this.allowGif ? 'JPEG, PNG, WebP, GIF' : 'JPEG, PNG, WebP';
    return `Недопустимый тип файла. Разрешены: ${types}`;
  }
}
