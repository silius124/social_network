import { IsOptional, IsString, IsUrl } from 'class-validator';

export class CreatePostDto {
  @IsString()
  @IsOptional()
  content?: string;

  @IsUrl()
  @IsOptional()
  imageUrl?: string;
}
