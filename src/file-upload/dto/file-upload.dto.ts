import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UploadFileDto {
  @ApiPropertyOptional({
    description: 'Optional description for the uploaded file',
    example: 'Profile picture of the user',
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;
}
