import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdatePostDto {
  @ApiPropertyOptional({
    description: 'Title of the post',
    example: 'Updated title',
    minLength: 3,
    maxLength: 50,
  })
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  title?: string;

  @ApiPropertyOptional({
    description: 'Content of the post',
    example: 'Updated content of the blog post. Must be long enough.',
    minLength: 50,
  })
  @IsOptional()
  @IsString()
  @MinLength(50)
  content?: string;

  @ApiPropertyOptional({
    description: 'Author of the post',
    example: 'Sabbir Hosen',
    minLength: 2,
    maxLength: 25,
  })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(25)
  authorName?: string;
}
